export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'Hoodies' | 'T-Shirts' | 'Outerwear' | 'Accessories' | 'Sneakers';
  country: 'JAPAN' | 'USA' | 'ITALY' | 'FRANCE' | 'KOREA';
  countryName: string;
  countryFlag: string;
  price: number; // in Rubles
  originalPrice: string; // e.g., "¥45,000" or "$320"
  sizes: string[];
  images: string[];
  description: string;
  details: string[];
  weightKg: number;
  slug: string;
  stock: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export type CountryCode = 'JAPAN' | 'USA' | 'ITALY' | 'FRANCE' | 'KOREA';

export interface CountryInfo {
  code: CountryCode;
  name: string;
  flag: string;
  city: string;
  timeZone: string;
  estimatedDeliveryDays: string;
  cargoStatus: string;
  shippingRateRub: number;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface CheckoutDetails {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  promoCode: string;
  estimatedArrivalDate: string;
}
