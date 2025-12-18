'use client';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import ProfileInfo from '../components/Profile/ProfileInfo';
import UserRatings from '../components/Profile/UserRatings';
import BookingList from '../components/Booking/BookingList';
import '../styles/profile.css';

export const dynamic = 'force-dynamic';

export default function UserProfilePage() {
  const { currentUser, loading } = useAuth();
  const { darkMode } = useTheme();

  if (loading) {
    return (
      <div className={`profile-page-container ${darkMode ? 'dark' : ''}`}>
        <div className="profile-loading">
          <p>Завантаження профілю...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className={`profile-page-container ${darkMode ? 'dark' : ''}`}>
        <div className="profile-not-authenticated">
          <h2>Профіль Користувача</h2>
          <p>
            Будь ласка,{' '}
            <Link href="/logIn" className="profile-login-link">
              увійдіть
            </Link>
            , щоб переглянути свої дані профілю.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`profile-page-container ${darkMode ? 'dark' : ''}`}>
      <div className="profile-header">
        <h1>Мій Профіль</h1>
      </div>

      <div className="profile-content">
        <div className="profile-main-section">
          <ProfileInfo />

          <div className={`profile-stats-section ${darkMode ? 'dark' : ''}`}>
            <h3>Статистика</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <span className="stat-label">Активних бронювань</span>
                  <span className="stat-value">—</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <span className="stat-label">Залишено відгуків</span>
                  <span className="stat-value">—</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎫</div>
                <div className="stat-info">
                  <span className="stat-label">Всього квитків</span>
                  <span className="stat-value">—</span>
                </div>
              </div>
            </div>
          </div>

          <UserRatings />
        </div>

        <div className="profile-sidebar">
          <div className={`profile-booking-section ${darkMode ? 'dark' : ''}`}>
            <h3>Мої Бронювання</h3>
            <BookingList />
          </div>

          <div className={`profile-actions-section ${darkMode ? 'dark' : ''}`}>
            <h3>Швидкі дії</h3>
            <div className="action-buttons">
              <Link href="/events" className="action-btn primary">
                Переглянути події
              </Link>
              <Link href="/booking" className="action-btn secondary">
                Мої бронювання
              </Link>
            </div>
          </div>

          <div className={`profile-info-section ${darkMode ? 'dark' : ''}`}>
            <h3>Інформація</h3>
            <div className="info-content">
              <p>
                Тут ви можете переглянути всю інформацію про свій профіль, відгуки та бронювання.
              </p>
              <p>Ваші відгуки допомагають іншим користувачам вибрати найкращі події!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
