import { useState, useEffect } from 'react';
import { UseRatingsReturn, RatingResponse, Rating } from '../../types';

export const useRatings = (eventId: string | undefined, currentPage = 1): UseRatingsReturn => {
  const [averageRating, setAverageRating] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchRatings = async (page: number) => {
    if (!eventId) {
      return;
    }

    setLoading(true);
    try {
      const url = `/api/events/${eventId}/ratings?page=${page}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Ratings API error:', errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || errorData.error || 'Unknown error'}`);
      }

      const data: RatingResponse = await response.json();

      if (data.success) {
        setAverageRating(data.averageRating || '0.0');
        setRatings(data.ratings || []);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error('useRatings: API returned error:', data.message);
        setAverageRating('0.0');
        setRatings([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('useRatings: Error fetching ratings:', error);
      setAverageRating('0.0');
      setRatings([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchRatings(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, currentPage]);

  return {
    averageRating,
    ratings,
    totalPages,
    loading,
    refetch: () => fetchRatings(currentPage),
  };
};

