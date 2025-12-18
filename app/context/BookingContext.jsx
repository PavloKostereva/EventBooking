'use client';
import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
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
        setBookings(data || []);
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
            setBookings((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setBookings((prev) => prev.map((b) => (b.id === payload.new.id ? payload.new : b)));
          } else if (payload.eventType === 'DELETE') {
            setBookings((prev) => prev.filter((b) => b.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, isAuthenticated]);

  const addBooking = async (booking) => {
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
        total_price: booking.totalPrice,
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

  const cancelBooking = async (id) => {
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error canceling booking:', error);
      return false;
    }
  };

  const isEventBooked = (eventTitle) => {
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
