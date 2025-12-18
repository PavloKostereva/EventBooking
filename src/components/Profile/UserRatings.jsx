import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/profile.css';

const UserRatings = () => {
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventsMap, setEventsMap] = useState({});

  useEffect(() => {
    const fetchUserRatings = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/users/${currentUser.uid}/ratings`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            console.log('UserRatings: Received data:', {
              ratingsCount: data.ratings?.length,
              eventsMapKeys: Object.keys(data.eventsMap || {}),
              sampleRating: data.ratings?.[0],
              eventsMap: data.eventsMap
            });
            setRatings(data.ratings || []);
            setEventsMap(data.eventsMap || {});
          }
        }
      } catch (error) {
        console.error('Error fetching user ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRatings();
  }, [currentUser]);

  if (loading) {
    return (
      <div className={`user-ratings-section ${darkMode ? 'dark' : ''}`}>
        <h3>Мої відгуки</h3>
        <div className="ratings-loading">Завантаження відгуків...</div>
      </div>
    );
  }

  if (ratings.length === 0) {
    return (
      <div className={`user-ratings-section ${darkMode ? 'dark' : ''}`}>
        <h3>Мої відгуки</h3>
        <div className="no-ratings">
          <p>Ви ще не залишили жодного відгуку</p>
          <p className="no-ratings-hint">Перейдіть на сторінку подій, щоб залишити свій перший відгук!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`user-ratings-section ${darkMode ? 'dark' : ''}`}>
      <h3>Мої відгуки ({ratings.length})</h3>
      <div className="ratings-list">
        {ratings.map((rating, index) => {
          // Шукаємо подію за eventId (може бути рядком або числом)
          const eventId = rating.eventId;
          let event = eventsMap[eventId];
          
          if (!event && eventId !== undefined && eventId !== null) {
            // Спробуємо знайти як рядок
            event = eventsMap[String(eventId)];
            // Спробуємо знайти як число
            if (!event && !isNaN(eventId)) {
              event = eventsMap[Number(eventId)];
            }
          }
          
          if (!event) {
            event = { title: 'Невідома подія', date: 'Невідома дата' };
            console.warn('UserRatings: Event not found for eventId:', eventId, 'Available keys:', Object.keys(eventsMap));
          }
          
          return (
            <div key={index} className="rating-item">
              <div className="rating-item-header">
                <h4 className="rating-event-title">{event.title}</h4>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={star <= rating.rating ? 'star-filled' : 'star-empty'}>
                      ★
                    </span>
                  ))}
                  <span className="rating-value">{rating.rating}/5</span>
                </div>
              </div>
              {rating.comment && (
                <p className="rating-comment">{rating.comment}</p>
              )}
              <div className="rating-meta">
                <span className="rating-date">
                  {rating.updatedAt
                    ? typeof rating.updatedAt === 'object' && rating.updatedAt.seconds
                      ? new Date(rating.updatedAt.seconds * 1000).toLocaleDateString('uk-UA')
                      : new Date(rating.updatedAt).toLocaleDateString('uk-UA')
                    : rating.createdAt
                    ? typeof rating.createdAt === 'object' && rating.createdAt.seconds
                      ? new Date(rating.createdAt.seconds * 1000).toLocaleDateString('uk-UA')
                      : new Date(rating.createdAt).toLocaleDateString('uk-UA')
                    : 'Невідома дата'}
                </span>
                <span className="rating-event-date">Подія: {event.date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserRatings;

