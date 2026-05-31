import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translate, detectLang, type Lang } from './i18n';

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  avatar: string;
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

  useEffect(() => { localStorage.setItem('wetigo:favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('wetigo:user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('wetigo:lang', JSON.stringify(lang)); document.documentElement.lang = lang; }, [lang]);

  const isFavorite = (id: number) => favorites.includes(id);
  const toggleFavorite = (id: number) => setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  const updateUser = (patch: Partial<UserProfile>) => setUser((u) => ({ ...u, ...patch }));
  const setLang = (l: Lang) => setLangState(l);
  const t = (key: string) => translate(lang, key);
  const setCountry = (c: string) => setCountryState(c);
  useEffect(() => { localStorage.setItem('wetigo:country', JSON.stringify(country)); }, [country]);

  return (
    <StoreContext.Provider value={{ favorites, isFavorite, toggleFavorite, user, updateUser, lang, setLang, t, country, setCountry }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
