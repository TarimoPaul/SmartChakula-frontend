// User Models
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'SYSTEM_ADMIN' | 'RESTAURANT_ADMIN' | 'CUSTOMER';
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Region Models
export interface Region {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Restaurant Models
export interface Restaurant {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  cuisineType: string;
  priceRange: 'BUDGET' | 'MODERATE' | 'PREMIUM';
  latitude?: number;
  longitude?: number;
  formattedAddress: string;
  region?: string;
  regionId?: string;
  city: string;
  phone?: string;
  website?: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'CLOSED';
  adminId?: string;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  workingHours?: WorkingHours[];
  createdAt: string;
  updatedAt?: string;
}

export interface WorkingHours {
  id?: string;
  restaurantId?: string;
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

// Menu Item Models
export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  price: number;
  category: 'MAIN_MEAL' | 'DESSERT' | 'DRINKS';
  categoryId?: string;
  imageUrl?: string;
  isAvailable: boolean;
  portionSize?: string;
  preparationTime?: number;
  calories?: number;
  dietaryTags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateMenuItemRequest {
  restaurantId: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  portionSize?: string;
  preparationTime?: number;
  calories?: number;
  dietaryTags?: string[];
  isAvailable?: boolean;
}

// Category Models
export interface Category {
  id: string;
  restaurantId?: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

// Reservation Models
export interface Reservation {
  id: string;
  confirmationCode: string;
  userId?: string;
  restaurantId: string;
  restaurant?: Restaurant;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  specialRequests?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateReservationRequest {
  restaurantId: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  specialRequests?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}

// Review Models
export interface Review {
  id: string;
  userId?: string;
  user?: { fullName: string };
  restaurantId: string;
  reservationId?: string;
  priceFairness: boolean;
  serviceClarity: boolean;
  menuAccuracy: boolean;
  comment?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface ReviewStats {
  totalReviews: number;
  priceFairnessPercent: number;
  serviceClarityPercent: number;
  menuAccuracyPercent: number;
}

export interface CreateReviewRequest {
  restaurantId: string;
  reservationId?: string;
  priceFairness: boolean;
  serviceClarity: boolean;
  menuAccuracy: boolean;
  comment?: string;
}

// Restaurant Service Models
export interface RestaurantServiceItem {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  priceType?: 'FIXED' | 'HOURLY' | 'PER_PERSON';
  duration?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// API Response Types
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}
