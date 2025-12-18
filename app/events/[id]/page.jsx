'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import StarRating from '../../components/Event/StarRating';
import { useRatings } from '../../hooks/useRatings';
import '../../styles/EventDetailsPage.css';

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { ratings, totalPages, loading: ratingsLoading } = useRatings(id, currentPage);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase.from('events').select('*').eq('id', id).single();

        if (error) throw error;
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  if (loading) {
    return <div>Завантаження...</div>;
  }

  if (!event) {
    return (
      <div className="page-container" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Подію не знайдено</h2>
        <button className="back-btn" onClick={() => router.push('/')}>
          На головну
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button className="back-btn" onClick={() => router.back()}>
        ← Назад
      </button>

      <div className="event-details">
        <h1>{event.title}</h1>
        <div className="event-info">
          <p>
            <strong>Дата:</strong> {event.date}
          </p>
          <p>
            <strong>Місце:</strong> {event.location}
          </p>
          <p>
            <strong>Ціна:</strong> {event.price}
          </p>
          <p>
            <strong>Тип:</strong> {event.type}
          </p>
        </div>

        <StarRating eventId={id} />

        <div className="ratings-section">
          <h3>Відгуки</h3>
          {ratingsLoading ? (
            <p>Завантаження відгуків...</p>
          ) : ratings.length > 0 ? (
            <>
              {ratings.map((rating, index) => (
                <div key={index} className="rating-item">
                  <p>
                    <strong>{rating.email}</strong> - {rating.rating}/5
                  </p>
                  {rating.comment && <p>{rating.comment}</p>}
                </div>
              ))}

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}>
                    Попередня
                  </button>
                  <span>
                    Сторінка {currentPage} з {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}>
                    Наступна
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>Поки що немає відгуків</p>
          )}
        </div>
      </div>
    </div>
  );
}
