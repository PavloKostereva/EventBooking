import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useRatings } from '../hooks/useRatings';
import '../styles/EventDetailsPage.css'

const EventDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  
  const event = location.state?.event;
  const [currentPage, setCurrentPage] = useState(1);
  const { ratings, totalPages, loading } = useRatings(id, currentPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (!event) {
    return (
        <div className="page-container" style={{padding: '2rem', textAlign: 'center'}}>
            <h2>Подію не знайдено</h2>
            <button className="back-btn" onClick={() => navigate('/')}>На головну</button>
        </div>
    );
  }

  return (
    <div className={`page-container ${darkMode ? 'dark-mode' : ''}`}>
      
      {/* Головна обгортка для розміщення елементів зліва-направо */}
      <div className="details-wrapper">
        
        {/* ЛІВА ЧАСТИНА: Кнопка назад */}
        <aside className="details-sidebar">
            <button 
                onClick={() => navigate(-1)} 
                className="back-btn"
            >
                ← Назад
            </button>
        </aside>

        {/* ПРАВА ЧАСТИНА: Інформація та відгуки */}
        <main className="details-main">
            
            {/* Картка події */}
            <div className={`event-details-card ${darkMode ? 'dark-event' : ''}`}>

                <div className="event-image-container">
                    <img 
                        src={event.imageUrl || "https://via.placeholder.com/800x400?text=No+Image"} 
                        alt={event.title} 
                        className="event-image"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/800x400?text=No+Image" }} 
                    />
                </div>

                <h1>{event.title}</h1>
                
                <div className="event-info-grid">
                    <p><strong>📅 Дата:</strong> {event.date}</p>
                    <p><strong>📍 Місце:</strong> {event.location}</p>
                    <p><strong>💰 Ціна:</strong> {event.price}</p>
                    <p><strong>🎭 Тип:</strong> {event.type}</p>
                </div>

                <div className="event-description">
                    <h3>Про подію</h3>
                    <p>{event.description || "Опис для цієї події відсутній."}</p>
                </div>
            </div>

            {/* Секція відгуків */}
            <div className="reviews-section">
                <h3>Відгуки ({ratings ? ratings.length : 0})</h3>
                
                <div className="ratings-list-container">
                {loading ? (
                    <p>Завантаження...</p>
                ) : ratings && ratings.length > 0 ? (
                    <>
                    <ul className="ratings-list">
                        {ratings.map((rating, index) => (
                        <li key={index} className={`review-item ${darkMode ? 'dark-review' : ''}`}>
                            <div className="review-header">
                                <span className="review-author">{rating.email || 'Гість'}</span>
                                <span className="review-stars">{'★'.repeat(rating.rating)}</span>
                            </div>
                            {rating.comment && <p className="review-text">{rating.comment}</p>}
                        </li>
                        ))}
                    </ul>

                    {totalPages > 1 && (
                        <div className="pagination">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
                        <span>{currentPage} / {totalPages}</span>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                        </div>
                    )}
                    </>
                ) : (
                    <p className="no-reviews">Поки що немає відгуків.</p>
                )}
                </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default EventDetailsPage;