'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '../../context/BookingContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import BookingForm from '../Booking/BookingForm';
import StarRating from './StarRating';
import { useRatings } from '../../hooks/useRatings';

const EventCard = ({ event }) => {
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
    router.push(`/events/${event.id}`);
  };

  return (
    <div className={`event ${darkMode ? 'dark-event' : ''}`}>
      <h3>{event.title}</h3>
      <p>
        <strong>Дата:</strong> {event.date}
      </p>
      <p>
        <strong>Місце:</strong> {event.location}
      </p>
      <p>
        <strong>Ціна:</strong> {event.price}
      </p>

      <div className="event-actions" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button
          className={`book-btn ${booked ? 'booked' : ''} ${pastEvent ? 'past-event' : ''}`}
          disabled={booked || pastEvent}
          onClick={handleBookClick}>
          {booked ? 'Заброньовано' : pastEvent ? 'Подія минула' : 'Забронювати'}
        </button>

        <button
          className="details-btn"
          onClick={handleDetailsClick}
          style={{
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}>
          Детальніше
        </button>
      </div>

      <div className="rating-wrapper">
        <StarRating
          eventId={event.id}
          onAverageRatingChange={() => refetch()}
          onRatingsChange={() => refetch()}
        />
        <span>
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
        <div className={`modal ${darkMode ? 'dark-modal' : ''}`}>
          <div className={`modal-content ${darkMode ? 'dark-modal-content' : ''}`}>
            <button className="close" onClick={() => setShowAuthModal(false)}>
              &times;
            </button>
            <h3>Потрібна авторизація</h3>
            <p>Для бронювання квитків необхідно увійти в свій акаунт.</p>
            <div className="modal-buttons">
              <button onClick={handleGoToLogin} className="auth-submit-btn">
                Увійти
              </button>
              <button onClick={() => setShowAuthModal(false)} className="google-btn">
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
