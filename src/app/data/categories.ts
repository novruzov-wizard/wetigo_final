// Single source of truth for categories — used by Home, Explore/Search and Add-Place
// so the three always stay in sync. Add a category here and it appears everywhere.
import {
  Compass, Pizza, Coffee, ShoppingBag, Dumbbell, Sparkles, Footprints, Building2,
  Heart, Car, Hotel, Stethoscope, GraduationCap, ShoppingCart, Wine, Cake,
  Wrench, Scissors, PawPrint, BookOpen, Palette, Landmark, Gamepad2, Plane,
  type LucideIcon,
} from 'lucide-react';

export interface Category {
  id: string;
  name: string;       // short label (Home / Explore chips)
  longName: string;   // descriptive label (Add Place)
  emoji: string;
  icon: LucideIcon;
  tint: string;       // chip background
  fg: string;         // chip foreground
  image: string;      // fallback hero image for places in this category
}

const img = (id: string) => `https://images.unsplash.com/${id}?w=600&h=400&fit=crop`;

export const CATEGORIES: Category[] = [
  { id: 'restaurant', name: 'Dining', longName: 'Restaurants & Dining', emoji: '🍽️', icon: Pizza, tint: '#fef0e3', fg: '#c2853f', image: img('photo-1517248135467-4c7edcad34c4') },
  { id: 'cafe', name: 'Cafes', longName: 'Cafes & Bakeries', emoji: '☕', icon: Coffee, tint: '#f6efd9', fg: '#b0902f', image: img('photo-1559925393-8be0ec4767c8') },
  { id: 'bakery', name: 'Bakery', longName: 'Bakery & Desserts', emoji: '🥐', icon: Cake, tint: '#fbeede', fg: '#bd7a35', image: img('photo-1509440159596-0249088772ff') },
  { id: 'bar', name: 'Bars', longName: 'Bars & Nightlife', emoji: '🍸', icon: Wine, tint: '#efe7fb', fg: '#7a3fc2', image: img('photo-1514362545857-3bc16c4c7d1b') },
  { id: 'fashion', name: 'Fashion', longName: 'Fashion & Apparel', emoji: '👔', icon: ShoppingBag, tint: '#ece4f7', fg: '#7a3fc2', image: img('photo-1441986300917-64674bd600d8') },
  { id: 'footwear', name: 'Footwear', longName: 'Footwear & Accessories', emoji: '👟', icon: Footprints, tint: '#e2ecf7', fg: '#3f6fc2', image: img('photo-1460353581641-37baddab0fa2') },
  { id: 'beauty', name: 'Beauty', longName: 'Beauty & Spa', emoji: '💄', icon: Sparkles, tint: '#fbe7f0', fg: '#c23f96', image: img('photo-1600334129128-685c5582fd35') },
  { id: 'fitness', name: 'Fitness', longName: 'Fitness & Wellness', emoji: '💪', icon: Dumbbell, tint: '#e4f5ec', fg: '#2f9461', image: img('photo-1534438327276-14e5300c3a48') },
  { id: 'grocery', name: 'Grocery', longName: 'Grocery & Markets', emoji: '🛒', icon: ShoppingCart, tint: '#e7f3e1', fg: '#5a9a3f', image: img('photo-1542838132-92c53300491e') },
  { id: 'entertainment', name: 'Fun', longName: 'Entertainment', emoji: '🎭', icon: Gamepad2, tint: '#fdeaf0', fg: '#c23f78', image: img('photo-1470225620780-dba8ba36b745') },
  { id: 'wedding', name: 'Wedding', longName: 'Wedding Venues', emoji: '💒', icon: Heart, tint: '#fbe7ef', fg: '#c23f6f', image: img('photo-1464366400600-7168b8af9bc3') },
  { id: 'hotel', name: 'Hotels', longName: 'Hotels & Lodging', emoji: '🏨', icon: Hotel, tint: '#e3eefb', fg: '#3f6fc2', image: img('photo-1566073771259-6a8506099945') },
  { id: 'automotive', name: 'Auto', longName: 'Automotive', emoji: '🚗', icon: Car, tint: '#e9ecf2', fg: '#5b6470', image: img('photo-1487754180451-c456f719a1fc') },
  { id: 'healthcare', name: 'Health', longName: 'Healthcare', emoji: '🏥', icon: Stethoscope, tint: '#e1f1f3', fg: '#2f8e94', image: img('photo-1519494026892-80bbd2d6fd0d') },
  { id: 'pharmacy', name: 'Pharmacy', longName: 'Pharmacies', emoji: '💊', icon: Heart, tint: '#e1f3ea', fg: '#2f9468', image: img('photo-1576602976047-174e57a47881') },
  { id: 'education', name: 'Education', longName: 'Education', emoji: '📚', icon: GraduationCap, tint: '#eef0e1', fg: '#8a8f33', image: img('photo-1523050854058-8df90110c9f1') },
  { id: 'services', name: 'Services', longName: 'Professional Services', emoji: '🔧', icon: Wrench, tint: '#eceef1', fg: '#5b6470', image: img('photo-1581092160562-40aa08e78837') },
  { id: 'salon', name: 'Salon', longName: 'Hair & Barber', emoji: '💈', icon: Scissors, tint: '#f1e7f6', fg: '#8a3fc2', image: img('photo-1503951914875-452162b0f3f1') },
  { id: 'pets', name: 'Pets', longName: 'Pet Care', emoji: '🐾', icon: PawPrint, tint: '#f3ece1', fg: '#9a743f', image: img('photo-1450778869180-41d0601e046e') },
  { id: 'books', name: 'Books', longName: 'Books & Stationery', emoji: '📖', icon: BookOpen, tint: '#e7eef3', fg: '#3f7392', image: img('photo-1512820790803-83ca734da794') },
  { id: 'art', name: 'Art', longName: 'Art & Culture', emoji: '🎨', icon: Palette, tint: '#f6e7ee', fg: '#c23f8a', image: img('photo-1499781350541-7783f6c6a0c8') },
  { id: 'bank', name: 'Finance', longName: 'Banks & Finance', emoji: '🏦', icon: Landmark, tint: '#e6eef0', fg: '#3f7c92', image: img('photo-1556742502-ec7c0e9f34b1') },
  { id: 'travel', name: 'Travel', longName: 'Travel & Agencies', emoji: '✈️', icon: Plane, tint: '#e3eefb', fg: '#3f6fc2', image: img('photo-1436491865332-7a61a109cc05') },
];

/** The "All" chip used in browse/filter strips. */
export const ALL_CATEGORY = { id: 'all', name: 'All', longName: 'All', emoji: '🧭', icon: Compass, tint: '#f1ebff', fg: '#6200FF', image: '' } as Omit<Category, never>;

export const CATEGORIES_WITH_ALL: Category[] = [ALL_CATEGORY as Category, ...CATEGORIES];

export const CATEGORY_IMAGES: Record<string, string> = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.image]));

export function categoryName(id?: string): string {
  return CATEGORIES.find((c) => c.id === id)?.name ?? 'Place';
}
