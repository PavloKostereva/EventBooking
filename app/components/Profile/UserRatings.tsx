'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Rating } from '../../../types';

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
      <div className={`bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md border border-gray-200 dark:border-slate-700 mb-8 ${darkMode ? 'bg-slate-800 border-slate-700' : ''}`}>
        <h3 className="text-text-primary dark:text-slate-100 text-2xl mb-6 font-semibold">Мої відгуки</h3>
        <div className="text-center py-12 text-text-secondary dark:text-slate-300">Завантаження відгуків...</div>
      </div>
    );
  }

  if (ratings.length === 0) {
    return (
      <div className={`bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md border border-gray-200 dark:border-slate-700 mb-8 ${darkMode ? 'bg-slate-800 border-slate-700' : ''}`}>
        <h3 className="text-text-primary dark:text-slate-100 text-2xl mb-6 font-semibold">Мої відгуки</h3>
        <div className="text-center py-12 text-text-secondary dark:text-slate-300">
          <p>Ви ще не залишили жодного відгуку</p>
          <p className="mt-2 text-sm text-text-light dark:text-slate-500">
            Перейдіть на сторінку подій, щоб залишити свій перший відгук!
          </p>
        </div>
      </div>
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
    <div className={`bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md border border-gray-200 dark:border-slate-700 mb-8 ${darkMode ? 'bg-slate-800 border-slate-700' : ''}`}>
      <h3 className="text-text-primary dark:text-slate-100 text-2xl mb-6 font-semibold">Мої відгуки ({ratings.length})</h3>
      <div className="flex flex-col gap-6">
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

          return (
            <div key={index} className="bg-bg-tertiary dark:bg-slate-700 rounded-lg p-6 border-l-4 border-primary transition-all duration-300 hover:translate-x-1 hover:shadow-md">
              <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
                <h4 className="text-text-primary dark:text-slate-100 text-xl font-semibold m-0">{event.title}</h4>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-xl ${star <= (rating.rating || 0) ? 'text-yellow-400' : 'text-text-light dark:text-slate-500'}`}>
                      ★
                    </span>
                  ))}
                  <span className="text-text-primary dark:text-slate-100 font-semibold ml-2 text-base">{rating.rating}/5</span>
                </div>
              </div>
              {rating.comment && (
                <p className="text-text-secondary dark:text-slate-300 leading-relaxed my-4 p-4 bg-white dark:bg-slate-800 rounded-md italic">
                  {rating.comment}
                </p>
              )}
              <div className="flex justify-between items-center text-sm text-text-light dark:text-slate-500 pt-4 border-t border-gray-200 dark:border-slate-600">
                <span className="flex items-center gap-2">
                  {rating.updatedAt
                    ? formatDate(rating.updatedAt)
                    : rating.createdAt
                    ? formatDate(rating.createdAt)
                    : 'Невідома дата'}
                </span>
                <span className="flex items-center gap-2">Подія: {event.date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserRatings;
