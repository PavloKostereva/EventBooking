export type EventType = 'concert' | 'theater' | 'festival' | 'comedy';

export interface Event {
  id?: string;
  title: string;
  date: string;
  location: string;
  price: string;
  type: EventType;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Booking {
  id?: string;
  user_uid: string;
  event_data?: Event;
  event?: Event;
  event_id?: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  ticket_quantity: number;
  total_price: string;
  timestamp: string;
}

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ticketQuantity: number;
  totalPrice?: string;
  event?: Event;
}

export interface Rating {
  id?: string;
  event_id: string;
  user_id: string;
  rating: number;
  comment?: string | null;
  created_at?: string;
  updated_at?: string;
  email?: string;
}

export interface RatingResponse {
  success: boolean;
  averageRating?: string;
  ratings?: Rating[];
  totalRatings?: number;
  currentPage?: number;
  totalPages?: number;
  message?: string;
  error?: string;
  code?: string;
  details?: string;
}

export interface AuthContextType {
  currentUser: User | null;
  userData: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface BookingContextType {
  bookings: Booking[];
  loading: boolean;
  addBooking: (booking: BookingFormData) => Promise<boolean>;
  cancelBooking: (id: string) => Promise<boolean>;
  isEventBooked: (eventTitle: string) => boolean;
}

export interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
}

export interface UseRatingsReturn {
  averageRating: string | null;
  ratings: Rating[];
  totalPages: number;
  loading: boolean;
  refetch: () => Promise<void>;
}

