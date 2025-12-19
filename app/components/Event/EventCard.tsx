'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '../../context/BookingContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import BookingForm from '../Booking/BookingForm';
import StarRating from './StarRating';
import { useRatings } from '../../hooks/useRatings';
import { Event } from '../../../types';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { isEventBooked } = useBooking();
  const { darkMode } = useTheme();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const booked = isEventBooked(event.title);

  const { averageRating, refetch } = useRatings(event.id, 1);

  const isPastEvent = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate < today;
  };

  const pastEvent = isPastEvent();

  const handleBookClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setShowModal(true);
  };

  const handleGoToLogin = () => {
    setShowAuthModal(false);
    router.push('/logIn');
  };

  const handleDetailsClick = () => {
    if (event.id) {
      router.push(`/events/${event.id}`);
    }
  };

  return (
    <div
      className={`bg-white dark:bg-slate-700 p-8 rounded-lg text-center shadow-md border border-gray-200 dark:border-slate-600 transition-all duration-300 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-xl ${
        darkMode ? 'bg-slate-700 text-slate-100' : ''
      }`}>
      <h3 className="text-2xl text-text-primary dark:text-slate-100 mb-2 font-semibold">
        {event.title}
      </h3>
      <p className="text-text-secondary dark:text-slate-300 text-base my-2">
        <strong className="text-text-primary dark:text-slate-100 font-semibold">Дата:</strong>{' '}
        {event.date}
      </p>
      <p className="text-text-secondary dark:text-slate-300 text-base my-2">
        <strong className="text-text-primary dark:text-slate-100 font-semibold">Місце:</strong>{' '}
        {event.location}
      </p>
      <p className="text-text-secondary dark:text-slate-300 text-base my-2">
        <strong className="text-text-primary dark:text-slate-100 font-semibold">Ціна:</strong>{' '}
        {event.price}
      </p>

      <div className="flex gap-2.5 mb-4">
        <button
          className={`flex-1 text-base font-medium px-6 py-3.5 border-none rounded-md cursor-pointer transition-all duration-300 mt-auto shadow-sm ${
            booked || pastEvent
              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-60'
              : 'bg-primary text-white hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-md'
          }`}
          disabled={booked || pastEvent}
          onClick={handleBookClick}>
          {booked ? 'Заброньовано' : pastEvent ? 'Подія минула' : 'Забронювати'}
        </button>

        <button
          className="bg-primary text-white border-none px-4 py-2.5 rounded-md cursor-pointer hover:bg-primary-dark transition-all"
          onClick={handleDetailsClick}>
          Детальніше
        </button>
      </div>

      <div className="flex flex-col items-center gap-3 mt-4 p-4 bg-bg-tertiary dark:bg-slate-600 rounded-md">
        <StarRating
          eventId={event.id}
          onAverageRatingChange={() => refetch()}
          onRatingsChange={() => refetch()}
        />
        <span className="text-text-primary dark:text-slate-100">
          Середня оцінка:{' '}
          {averageRating !== null && averageRating !== undefined && averageRating !== '0.0'
            ? parseFloat(averageRating).toFixed(1)
            : averageRating === '0.0'
            ? '0.0'
            : '—'}
        </span>
      </div>

      {showModal && !pastEvent && isAuthenticated && (
        <BookingForm event={event} onClose={() => setShowModal(false)} />
      )}

      {showAuthModal && (
        <div
          className={`fixed block z-[1000] left-0 top-0 w-full h-full overflow-auto bg-black/60 backdrop-blur-sm ${
            darkMode ? 'bg-black/80' : ''
          }`}>
          <div
            className={`bg-white dark:bg-slate-800 m-[5%] mx-auto p-10 border-none w-[90%] max-w-[550px] rounded-2xl shadow-xl relative ${
              darkMode ? 'bg-slate-800 text-slate-100' : ''
            }`}>
            <button
              className="text-text-secondary dark:text-slate-400 absolute right-6 top-6 text-4xl font-bold cursor-pointer leading-none transition-all duration-300 bg-none border-none p-0 w-8 h-8 flex items-center justify-center rounded-sm hover:text-error dark:hover:text-red-400 hover:bg-bg-tertiary dark:hover:bg-slate-700 hover:rotate-90"
              onClick={() => setShowAuthModal(false)}>
              &times;
            </button>
            <h3 className="text-center text-3xl mb-6 text-text-primary dark:text-slate-100 font-semibold">
              Потрібна авторизація
            </h3>
            <p className="text-text-secondary dark:text-slate-300 my-4 leading-relaxed text-center">
              Для бронювання квитків необхідно увійти в свій акаунт.
            </p>
            <div className="flex flex-col gap-4 mt-6">
              <button
                onClick={handleGoToLogin}
                className="bg-primary text-white px-8 py-3.5 border-none rounded-md cursor-pointer text-base font-medium transition-all duration-300 shadow-md w-full hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-lg">
                Увійти
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className="bg-white dark:bg-slate-700 text-text-primary dark:text-slate-100 px-8 py-3.5 border-2 border-gray-200 dark:border-slate-600 rounded-md cursor-pointer text-base font-medium transition-all duration-300 w-full hover:bg-bg-tertiary dark:hover:bg-slate-600 hover:border-primary dark:hover:border-primary hover:-translate-y-0.5">
                Скасувати
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;
