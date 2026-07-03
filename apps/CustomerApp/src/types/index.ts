export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface Address {
  id: string;
  title: string; // Home, Work, etc.
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}

export interface FoodItemVariant {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface AddonItem {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface AddonGroup {
  id: string;
  name: string;
  minSelections: number;
  maxSelections: number;
  isRequired: boolean;
  items: AddonItem[];
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVeg: boolean;
  isEgg: boolean;
  isNonVeg: boolean;
  isAvailable: boolean;
  isFeatured?: boolean;
  variants?: FoodItemVariant[];
  addonGroups?: AddonGroup[];
  rating?: number;
  prepTimeMinutes?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  logoUrl: string;
  coverImageUrl: string;
  phoneNumber: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  deliveryRadiusKm: number;
  minOrderAmount: number;
  baseDeliveryFee: number;
  prepTimeRange: string; // e.g. "15-25 min"
  categories: string[];
  foodItems: FoodItem[];
  distanceKm?: number;
  promoTag?: string;
}

export interface CartItem {
  id: string; // Unique identifier for the specific configuration of item + variants + addons
  foodItem: FoodItem;
  variant?: FoodItemVariant;
  addons: AddonItem[];
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  restaurant: {
    id: string;
    name: string;
    logoUrl: string;
  };
  items: {
    name: string;
    price: number;
    quantity: number;
    variantName?: string;
    addons?: string[];
  }[];
  status: 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED';
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  totalAmount: number;
  createdAt: string;
}
