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

          if (error && (error as { code?: string }).code !== 'PGRST116') {
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
    <div className="flex flex-col items-center gap-3 mt-4">
      <div className="flex justify-center items-center gap-2 mt-3 w-full">
        <input
          type="text"
          className="px-2.5 py-2.5 w-[70%] border border-gray-200 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-text-primary dark:text-slate-100 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-gray-400 dark:placeholder:text-slate-500"
          value={comment}
          placeholder="Залиште коментар..."
          onChange={(e: ChangeEvent<HTMLInputElement>) => setComment(e.target.value)}
        />
        <button 
          onClick={handleCommentSubmit}
          className="px-4 py-2.5 bg-success text-white border-none rounded-md cursor-pointer font-medium transition-all duration-300 hover:bg-green-700 hover:-translate-y-0.5">
          Відправити
        </button>
      </div>

      <div className="text-2xl mt-3 flex gap-1 justify-center">
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            className={`cursor-pointer transition-transform duration-200 hover:scale-125 ${num <= rating ? 'text-yellow-400' : 'text-gray-400'}`}
            onClick={() => handleRate(num)}>
            ★
          </span>
        ))}
      </div>
    </div>
  );
};

export default StarRating;
