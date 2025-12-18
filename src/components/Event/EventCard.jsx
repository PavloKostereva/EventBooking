import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import BookingForm from '../Booking/BookingForm';
import StarRating from './StarRating';
import { useRatings } from '../../hooks/useRatings';

const EventCard = ({ event }) => {
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Ми залишаємо useRatings, щоб отримати середню оцінку та оновлювати її
  const { isEventBooked } = useBooking();
  const { darkMode } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const booked = isEventBooked(event.title);
  
  // Нам тут потрібна тільки refetch і averageRating, пагінація тут більше не треба
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
    navigate('/logIn');
  };

  // Функція переходу на сторінку деталей
  const handleDetailsClick = () => {
    // Передаємо об'єкт event через state, щоб не завантажувати його знову
    navigate(`/events/${event.id}`, { state: { event } });
  };

  return (
    <div className={`event ${darkMode ? 'dark-event' : ''}`}>
      <h3>{event.title}</h3>
      <p><strong>Дата:</strong> {event.date}</p>
      <p><strong>Місце:</strong> {event.location}</p>
      <p><strong>Ціна:</strong> {event.price}</p>

      {/* Кнопки дій */}
      <div className="event-actions" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button
          className={`book-btn ${booked ? 'booked' : ''} ${pastEvent ? 'past-event' : ''}`}
          disabled={booked || pastEvent}
          onClick={handleBookClick}>
          {booked ? 'Заброньовано' : pastEvent ? 'Подія минула' : 'Забронювати'}
        </button>

        {/* НОВА КНОПКА ДЕТАЛЬНІШЕ */}
        <button 
            className="details-btn" 
            onClick={handleDetailsClick}
            style={{
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '5px',
                cursor: 'pointer'
            }}
        >
          Детальніше
        </button>
      </div>

      {/* Рейтинг залишаємо, щоб можна було швидко оцінити */}
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

      {/* Модальні вікна залишаються без змін */}
      {showModal && !pastEvent && isAuthenticated && (
        <BookingForm event={event} onClose={() => setShowModal(false)} />
      )}

      {showAuthModal && (
        <div className={`modal ${darkMode ? 'dark-modal' : ''}`}>
          <div className={`modal-content ${darkMode ? 'dark-modal-content' : ''}`}>
            <button className="close" onClick={() => setShowAuthModal(false)}>&times;</button>
            <h3>Потрібна авторизація</h3>
            <p>Для бронювання квитків необхідно увійти в свій акаунт.</p>
            <div className="modal-buttons">
              <button onClick={handleGoToLogin} className="auth-submit-btn">Увійти</button>
              <button onClick={() => setShowAuthModal(false)} className="google-btn">Скасувати</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;