'use client';
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from './AuthContext';
import { BookingContextType, Booking, BookingFormData } from '../../types';

interface BookingContextProps {
  children: ReactNode;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }: BookingContextProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      setBookings([]);
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_uid', currentUser.id)
          .order('timestamp', { ascending: false });

        if (error) throw error;
        setBookings((data as Booking[]) || []);
      } catch (error) {
        console.error('Error fetching bookings: ', error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `user_uid=eq.${currentUser.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookings((prev) => [payload.new as Booking, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setBookings((prev) => prev.map((b) => (b.id === (payload.new as Booking).id ? payload.new as Booking : b)));
          } else if (payload.eventType === 'DELETE') {
            setBookings((prev) => prev.filter((b) => b.id !== (payload.old as Booking).id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, isAuthenticated]);

  const addBooking = async (booking: BookingFormData): Promise<boolean> => {
    if (!isAuthenticated || !currentUser) {
      console.error('Спроба бронювання без авторизації.');
      alert('Потрібно авторизуватися, щоб забронювати квиток!');
      return false;
    }

    try {
      const bookingData = {
        user_uid: currentUser.id,
        event_data: booking.event,
        event_id: booking.event?.id || null,
        first_name: booking.firstName,
        last_name: booking.lastName,
        email: booking.email,
        phone: booking.phone,
        ticket_quantity: booking.ticketQuantity,
        total_price: booking.totalPrice || '',
        timestamp: new Date().toISOString(),
      };

      const { error } = await supabase.from('bookings').insert([bookingData]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding booking:', error);
      return false;
    }
  };

  const cancelBooking = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error canceling booking:', error);
      return false;
    }
  };

  const isEventBooked = (eventTitle: string): boolean => {
    return bookings.some(
      (booking) => booking.event_data?.title === eventTitle || booking.event?.title === eventTitle,
    );
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        cancelBooking,
        isEventBooked,
        loading,
      }}>
      {children}
    </BookingContext.Provider>
  );
};

