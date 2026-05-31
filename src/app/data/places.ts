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

export const PLACES: Place[] = [
  { id: 1, name: 'The Grand Ballroom', category: 'Wedding Venue', categoryId: 'wedding', rating: 4.8, reviews: 234, image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop', city: 'New York, USA', country: 'us', price: '$$$', verified: true, premium: true, open: true, lat: 40.7128, lng: -74.006 },
  { id: 2, name: 'Fitness Plus Gym', category: 'Fitness Center', categoryId: 'fitness', rating: 4.6, reviews: 456, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop', city: 'Los Angeles, USA', country: 'us', price: '$$', verified: true, premium: false, open: true, lat: 34.0522, lng: -118.2437 },
  { id: 3, name: 'La Cucina Italiana', category: 'Italian Restaurant', categoryId: 'restaurant', rating: 4.9, reviews: 789, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop', city: 'Chicago, USA', country: 'us', price: '$$$', verified: true, premium: true, open: false, lat: 41.8781, lng: -87.6298 },
  { id: 4, name: 'Urban Boutique', category: 'Fashion Store', categoryId: 'fashion', rating: 4.7, reviews: 321, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop', city: 'Miami, USA', country: 'us', price: '$$', verified: false, premium: false, open: true, lat: 25.7617, lng: -80.1918 },
  { id: 5, name: 'Sneaker Palace', category: 'Footwear Store', categoryId: 'footwear', rating: 4.5, reviews: 198, image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=400&fit=crop', city: 'Boston, USA', country: 'us', price: '$$', verified: true, premium: false, open: false, lat: 42.3601, lng: -71.0589 },
  { id: 6, name: 'Bloom Beauty Spa', category: 'Beauty & Spa', categoryId: 'beauty', rating: 4.8, reviews: 412, image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&h=400&fit=crop', city: 'Seattle, USA', country: 'us', price: '$$$', verified: true, premium: true, open: true, lat: 47.6062, lng: -122.3321 },
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
