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
        setLoading(true);
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_uid', currentUser.id)
          .order('timestamp', { ascending: false });

        if (error) {
          throw error;
        }
        setBookings((data as Booking[]) || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        if (error instanceof Error) {
          console.error('Error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack,
          });
        } else if (typeof error === 'object') {
          console.error('Error object:', JSON.stringify(error, null, 2));
        } else {
          console.error('Error value:', error);
        }
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    let channel: ReturnType<typeof supabase.channel> | null = null;

    try {
      channel = supabase
        .channel(`bookings-changes-${currentUser.id}`)
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
              setBookings((prev) =>
                prev.map((b) =>
                  b.id === (payload.new as Booking).id ? (payload.new as Booking) : b,
                ),
              );
            } else if (payload.eventType === 'DELETE') {
              setBookings((prev) => prev.filter((b) => b.id !== (payload.old as Booking).id));
            }
          },
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Bookings subscription active');
          } else if (status === 'CHANNEL_ERROR') {
            console.warn('Bookings subscription error - continuing without realtime updates');
          } else if (status === 'TIMED_OUT') {
            console.warn('Bookings subscription timeout - continuing without realtime updates');
          } else if (status === 'CLOSED') {
            console.warn('Bookings subscription closed');
          }
        });
    } catch (error) {
      console.warn('Failed to set up bookings subscription:', error);
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [currentUser, isAuthenticated]);

  const addBooking = async (booking: BookingFormData): Promise<boolean> => {
    if (!isAuthenticated || !currentUser) {
      console.error('Attempting booking without authorization');
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

      const { data, error } = await supabase.from('bookings').insert([bookingData]).select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setBookings((prev) => [data[0] as Booking, ...prev]);
      }

      return true;
    } catch (error) {
      console.error('Error adding booking:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
        });
      } else if (typeof error === 'object') {
        console.error('Error object:', JSON.stringify(error, null, 2));
      }
      return false;
    }
  };

  const cancelBooking = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id);

      if (error) {
        throw error;
      }

      setBookings((prev) => prev.filter((b) => b.id !== id));

      return true;
    } catch (error) {
      console.error('Error canceling booking:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
        });
      } else if (typeof error === 'object') {
        console.error('Error object:', JSON.stringify(error, null, 2));
      }
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
