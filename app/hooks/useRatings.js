import { useState, useEffect } from 'react';

export const useRatings = (eventId, currentPage = 1) => {
  const [averageRating, setAverageRating] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchRatings = async (page) => {
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

      const data = await response.json();

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
