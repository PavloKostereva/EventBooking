import { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, query, where, onSnapshot } from 'firebase/firestore'; // <--- Імпорт Firestore функцій
import { useAuth } from './AuthContext';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); // Додаємо стан завантаження
  const { currentUser, isAuthenticated } = useAuth(); // <--- Отримуємо поточного користувача

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      setBookings([]);
      setLoading(false);
      return;
    }

    const bookingsCollectionRef = collection(db, 'bookings');
    const userBookingsQuery = query(bookingsCollectionRef, where('userUID', '==', currentUser.uid));

    const unsubscribe = onSnapshot(
      userBookingsQuery,
      (snapshot) => {
        const bookingsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(bookingsList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching bookings: ', error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [currentUser, isAuthenticated]);

  const addBooking = async (booking) => {
    if (!isAuthenticated || !currentUser) {
      console.error('Спроба бронювання без авторизації.');
      alert('Потрібно авторизуватися, щоб забронювати квиток!');
      return false;
    }

    try {
      const bookingData = {
        ...booking,
        userUID: currentUser.uid,
        timestamp: new Date(),
      };

      const docRef = await addDoc(collection(db, 'bookings'), bookingData);
      console.log('Booking added with ID: ', docRef.id);
      return true;
    } catch (error) {
      console.error('Error adding booking to Firestore:', error);
      return false;
    }
  };

  // const cancelBooking = (id) => {
  //     try {
  //         setBookings(prevBookings => prevBookings.filter(booking => booking.id !== id))
  //         return true
  //     } catch (error) {
  //         console.error('Error canceling booking:', error)
  //         return false
  //     }
  // }

  // --- ФУНКЦІЯ СКАСУВАННЯ БРОНЮВАННЯ З FIREBASE ---
  const cancelBooking = async (id) => {
    try {
      // Видаляємо документ з колекції 'bookings' за його ID
      await deleteDoc(doc(db, 'bookings', id));
      console.log('Booking canceled successfully: ', id);
      return true;
    } catch (error) {
      console.error('Error canceling booking in Firestore:', error);
      return false;
    }
  };

  // const isEventBooked = (eventTitle) => {
  //     return bookings.some(booking => booking.event?.title === eventTitle)
  // }

  // isEventBooked тепер просто перевіряє поточний стан `bookings`
  const isEventBooked = (eventTitle) => {
    return bookings.some((booking) => booking.event?.title === eventTitle);
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        cancelBooking,
        isEventBooked,
        loading, // Додаємо loading
      }}>
      {children}
    </BookingContext.Provider>
  );
};
