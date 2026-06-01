export interface Place {
  id: number;
  name: string;
  category: string;
  categoryId: string;
  rating: number;
  reviews: number;
  image: string;
  city: string;
  country: string;
  price: string;
  verified: boolean;
  premium: boolean; // promoted (subscriber) listings rank first
  open: boolean;
  lat: number;
  lng: number;
}

// Category → stock image fallback (when a place has no image).
const CATEGORY_IMAGES: Record<string, string> = {
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
  cafe: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&h=400&fit=crop',
  fashion: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
  footwear: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=400&fit=crop',
  fitness: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
  beauty: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&h=400&fit=crop',
  entertainment: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop',
  wedding: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop',
};
export function placeImage(p: { image?: string; categoryId?: string }): string {
  if (p.image && p.image.trim()) return p.image;
  return CATEGORY_IMAGES[p.categoryId ?? ''] ?? 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop';
}

// Real, recognizable venues with accurate coordinates.
// In production these are served by the backend from Google Places / TripAdvisor (see api.places).
export const PLACES: Place[] = [
  { id: 1, name: "Katz's Delicatessen", category: 'Deli & Restaurant', categoryId: 'restaurant', rating: 4.6, reviews: 51820, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop', city: 'New York, USA', country: 'us', price: '$$', verified: true, premium: true, open: true, lat: 40.7223, lng: -73.9874 },
  { id: 2, name: "Gold's Gym Venice", category: 'Fitness Center', categoryId: 'fitness', rating: 4.5, reviews: 3120, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop', city: 'Los Angeles, USA', country: 'us', price: '$$', verified: true, premium: false, open: true, lat: 33.9925, lng: -118.4695 },
  { id: 3, name: "Lou Malnati's Pizzeria", category: 'Italian Restaurant', categoryId: 'restaurant', rating: 4.7, reviews: 9430, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop', city: 'Chicago, USA', country: 'us', price: '$$', verified: true, premium: true, open: false, lat: 41.8902, lng: -87.6330 },
  { id: 4, name: "Macy's Herald Square", category: 'Department Store', categoryId: 'fashion', rating: 4.4, reviews: 28760, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop', city: 'New York, USA', country: 'us', price: '$$', verified: true, premium: false, open: true, lat: 40.7510, lng: -73.9890 },
  { id: 5, name: 'Flight Club', category: 'Sneaker Store', categoryId: 'footwear', rating: 4.5, reviews: 1640, image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=400&fit=crop', city: 'New York, USA', country: 'us', price: '$$$', verified: true, premium: false, open: false, lat: 40.7250, lng: -73.9950 },
  { id: 6, name: 'Burke Williams Spa', category: 'Beauty & Spa', categoryId: 'beauty', rating: 4.7, reviews: 2210, image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&h=400&fit=crop', city: 'Los Angeles, USA', country: 'us', price: '$$$', verified: true, premium: true, open: true, lat: 34.0699, lng: -118.4015 },
  // Azerbaijan — Baku
  { id: 7, name: 'Şirvanşah Müzey Restoran', category: 'Azerbaijani Cuisine', categoryId: 'restaurant', rating: 4.6, reviews: 1890, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop', city: 'Baku, Azerbaijan', country: 'az', price: '$$$', verified: true, premium: true, open: true, lat: 40.3659, lng: 49.8326 },
  { id: 8, name: 'Sahil Park Cafe', category: 'Cafe', categoryId: 'cafe', rating: 4.5, reviews: 760, image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&h=400&fit=crop', city: 'Baku, Azerbaijan', country: 'az', price: '$$', verified: true, premium: false, open: true, lat: 40.3690, lng: 49.8420 },
  { id: 9, name: 'Nizami Street Boutique', category: 'Fashion Store', categoryId: 'fashion', rating: 4.4, reviews: 420, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop', city: 'Baku, Azerbaijan', country: 'az', price: '$$', verified: false, premium: false, open: false, lat: 40.3725, lng: 49.8430 },
  // UK & Türkiye
  { id: 10, name: 'The Ledbury', category: 'Fine Dining', categoryId: 'restaurant', rating: 4.8, reviews: 3210, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop', city: 'London, UK', country: 'uk', price: '$$$$', verified: true, premium: true, open: true, lat: 51.5160, lng: -0.2030 },
  { id: 11, name: 'Karaköy Güllüoğlu', category: 'Dessert & Cafe', categoryId: 'cafe', rating: 4.6, reviews: 14200, image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&h=400&fit=crop', city: 'Istanbul, Türkiye', country: 'tr', price: '$$', verified: true, premium: false, open: true, lat: 41.0255, lng: 28.9770 },
];

export const COUNTRIES: { id: string; name: string; flag: string }[] = [
  { id: 'all', name: 'All Countries', flag: '🌍' },
  { id: 'us', name: 'United States', flag: '🇺🇸' },
  { id: 'az', name: 'Azerbaijan', flag: '🇦🇿' },
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
  { id: 'tr', name: 'Türkiye', flag: '🇹🇷' },
];

/** Haversine distance in km between two coords */
export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}
