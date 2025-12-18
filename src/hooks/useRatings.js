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
      // Використовуємо відносний шлях, який через Vite проксі перенаправиться на сервер
      const apiUrl = import.meta.env.VITE_API_BASE_URL || '';
      const url = apiUrl 
        ? `${apiUrl}/api/events/${eventId}/ratings?page=${page}`
        : `/api/events/${eventId}/ratings?page=${page}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
  }, [eventId, currentPage]);

  return { averageRating, ratings, totalPages, loading, refetch: () => fetchRatings(currentPage) };
};
