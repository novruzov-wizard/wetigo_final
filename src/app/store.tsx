import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translate, detectLang, type Lang } from './i18n';
import { PLACES as SEED_PLACES, placeImage, type Place } from './data/places';
import { places as placesApi, favorites as favoritesApi, auth as authApi, profile as profileApi } from './lib/api';

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  avatar: string;
  birthDate?: string;
}

interface Store {
  favorites: number[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
  user: UserProfile;
  updateUser: (patch: Partial<UserProfile>) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  country: string;
  setCountry: (c: string) => void;
  places: Place[];
  placesLoading: boolean;
  refreshFavorites: () => void;
  refreshPlaces: () => void;
}

const StoreContext = createContext<Store | null>(null);

const DEFAULT_USER: UserProfile = {
  name: 'Jhon Smith',
  email: 'jhon.smith@example.com',
  bio: 'Always hunting for the next great place. ☕️🍝',
  avatar: 'https://i.pravatar.cc/160?img=12',
};

function load<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>(() => load('wetigo:favorites', [1, 2, 3]));
  const [user, setUser] = useState<UserProfile>(() => load('wetigo:user', DEFAULT_USER));
  const [lang, setLangState] = useState<Lang>(() => load<Lang | null>('wetigo:lang', null) ?? detectLang());
  const [country, setCountryState] = useState<string>(() => load('wetigo:country', 'all'));
  const [places, setPlaces] = useState<Place[]>(SEED_PLACES);
  const [placesLoading, setPlacesLoading] = useState(true);

  useEffect(() => { localStorage.setItem('wetigo:favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('wetigo:user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('wetigo:lang', JSON.stringify(lang)); document.documentElement.lang = lang; }, [lang]);

  // Load real places from the backend (falls back to seed data on failure).
  const refreshPlaces = () => {
    placesApi.list()
      .then((data: any) => {
        if (Array.isArray(data) && data.length) {
          // normalize backend rows: reviewsCount -> reviews, image fallback
          const norm: Place[] = data.map((p: any) => ({
            id: p.id, name: p.name, category: p.category, categoryId: p.categoryId ?? 'all',
            rating: p.rating ?? 0, reviews: p.reviews ?? p.reviewsCount ?? 0,
            image: placeImage(p), city: p.city ?? '', country: p.country ?? 'all',
            price: p.price ?? '$$', verified: !!p.verified, premium: !!p.premium,
            open: p.open ?? true, lat: p.lat ?? 0, lng: p.lng ?? 0,
            phone: p.phone ?? undefined, website: p.website ?? undefined, openingHours: p.openingHours ?? undefined,
            tier: p.tier ?? undefined, promotedUntil: p.promotedUntil ?? undefined,
          }));
          setPlaces(norm);
        }
      })
      .catch(() => { /* keep seed */ })
      .finally(() => setPlacesLoading(false));
  };
  useEffect(() => { refreshPlaces(); /* eslint-disable-next-line */ }, []);

  // If logged in, load favorites from the backend.
  const refreshFavorites = () => {
    if (!authApi.getToken()) return;
    favoritesApi.list().then((ids) => { if (Array.isArray(ids)) setFavorites(ids as number[]); }).catch(() => {});
  };
  useEffect(() => { refreshFavorites(); }, []);

  const isFavorite = (id: number) => favorites.includes(id);
  const toggleFavorite = (id: number) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
    // persist server-side when authenticated
    if (authApi.getToken()) {
      const adding = !favorites.includes(id);
      (adding ? favoritesApi.add(id) : favoritesApi.remove(id)).catch(() => {});
    }
  };
  const updateUser = (patch: Partial<UserProfile>) => setUser((u) => ({ ...u, ...patch }));
  const setLang = (l: Lang) => {
    setLangState(l);
    // remember the choice server-side so it follows the user across devices/logins
    if (authApi.getToken()) profileApi.updateSettings({ language: l }).catch(() => {});
  };
  const t = (key: string) => translate(lang, key);
  const setCountry = (c: string) => setCountryState(c);
  useEffect(() => { localStorage.setItem('wetigo:country', JSON.stringify(country)); }, [country]);

  return (
    <StoreContext.Provider value={{ favorites, isFavorite, toggleFavorite, user, updateUser, lang, setLang, t, country, setCountry, places, placesLoading, refreshFavorites, refreshPlaces }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
