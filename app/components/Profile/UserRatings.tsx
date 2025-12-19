'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Rating } from '../../../types';
import '../../styles/profile.css';

interface EventsMap {
  [key: string]: {
    title: string;
    date: string;
    location?: string;
    price?: string;
    id?: string;
  };
}

interface RatingWithEventId extends Rating {
  eventId?: string | number;
  updatedAt?: string | { seconds: number };
  createdAt?: string | { seconds: number };
}

const UserRatings = () => {
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();
  const [ratings, setRatings] = useState<RatingWithEventId[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsMap, setEventsMap] = useState<EventsMap>({});

  useEffect(() => {
    const fetchUserRatings = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/users/${currentUser.id || (currentUser as { uid?: string }).uid}/ratings`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            console.log('UserRatings: Received data:', {
              ratingsCount: data.ratings?.length,
              eventsMapKeys: Object.keys(data.eventsMap || {}),
              sampleRating: data.ratings?.[0],
              eventsMap: data.eventsMap,
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
          <p className="no-ratings-hint">
            Перейдіть на сторінку подій, щоб залишити свій перший відгук!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`user-ratings-section ${darkMode ? 'dark' : ''}`}>
      <h3>Мої відгуки ({ratings.length})</h3>
      <div className="ratings-list">
        {ratings.map((rating, index) => {
          const eventId = rating.eventId;
          let event = eventsMap[String(eventId)];

          if (!event && eventId !== undefined && eventId !== null) {
            event = eventsMap[String(eventId)];
            if (!event && !isNaN(Number(eventId))) {
              event = eventsMap[Number(eventId).toString()];
            }
          }

          if (!event) {
            event = { title: 'Невідома подія', date: 'Невідома дата' };
            console.warn(
              'UserRatings: Event not found for eventId:',
              eventId,
              'Available keys:',
              Object.keys(eventsMap),
            );
          }

          const formatDate = (date?: string | { seconds: number }) => {
            if (!date) return 'Невідома дата';
            if (typeof date === 'object' && 'seconds' in date) {
              return new Date(date.seconds * 1000).toLocaleDateString('uk-UA');
            }
            return new Date(date).toLocaleDateString('uk-UA');
          };

          return (
            <div key={index} className="rating-item">
              <div className="rating-item-header">
                <h4 className="rating-event-title">{event.title}</h4>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={star <= (rating.rating || 0) ? 'star-filled' : 'star-empty'}>
                      ★
                    </span>
                  ))}
                  <span className="rating-value">{rating.rating}/5</span>
                </div>
              </div>
              {rating.comment && <p className="rating-comment">{rating.comment}</p>}
              <div className="rating-meta">
                <span className="rating-date">
                  {rating.updatedAt
                    ? formatDate(rating.updatedAt)
                    : rating.createdAt
                    ? formatDate(rating.createdAt)
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

