'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface StarRatingProps {
  eventId?: string;
  onAverageRatingChange?: () => void;
  onRatingsChange?: () => void;
}

const StarRating = ({ eventId, onAverageRatingChange, onRatingsChange }: StarRatingProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchRating = async () => {
      if (currentUser && eventId) {
        try {
          const { data, error } = await supabase
            .from('rating_of_events')
            .select('rating, comment')
            .eq('event_id', eventId)
            .eq('user_id', currentUser.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching rating:', error);
          } else if (data) {
            setRating((data.rating as number) || 0);
            setComment((data.comment as string) || '');
          }
        } catch (error) {
          console.error('Error fetching rating:', error);
        }
      }
    };
    fetchRating();
  }, [currentUser, eventId]);

  const handleRate = async (value: number) => {
    if (!currentUser) {
      alert('Увійдіть, щоб оцінити подію');
      return;
    }

    if (!eventId) return;

    setRating(value);

    try {
      const response = await fetch(`/api/events/${eventId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          rating: value,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        if (onAverageRatingChange) {
          onAverageRatingChange();
        }
        if (onRatingsChange) {
          onRatingsChange();
        }
      }
    } catch (error) {
      console.error('Server error:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!currentUser) {
      alert('Увійдіть, щоб залишити коментар');
      return;
    }

    if (!eventId) return;

    try {
      const response = await fetch(`/api/events/${eventId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setComment('');
        if (onAverageRatingChange) onAverageRatingChange();
        if (onRatingsChange) onRatingsChange();
      }
    } catch (error) {
      console.error('Помилка відправлення коментаря:', error);
    }
  };

  return (
    <div className="stars-section">
      <div className="comment-container">
        <input
          type="text"
          className="comment-input"
          value={comment}
          placeholder="Залиште коментар..."
          onChange={(e: ChangeEvent<HTMLInputElement>) => setComment(e.target.value)}
        />
        <button onClick={handleCommentSubmit}>Відправити</button>
      </div>

      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            style={{ color: num <= rating ? 'gold' : 'gray', cursor: 'pointer' }}
            onClick={() => handleRate(num)}>
            ★
          </span>
        ))}
      </div>
    </div>
  );
};

export default StarRating;

