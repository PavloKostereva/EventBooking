'use client';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import ProfileInfo from '../components/Profile/ProfileInfo';
import UserRatings from '../components/Profile/UserRatings';
import BookingList from '../components/Booking/BookingList';

export const dynamic = 'force-dynamic';

export default function UserProfilePage() {
  const { currentUser, loading } = useAuth();
  const { darkMode } = useTheme();

  if (loading) {
    return (
      <div
        className={`max-w-[1400px] mx-auto px-8 py-8 min-h-[calc(100vh-200px)] ${
          darkMode ? 'bg-slate-800' : ''
        }`}>
        <div className="text-center py-12 px-12 bg-white dark:bg-slate-800 rounded-lg shadow-md">
          <p className="text-text-primary dark:text-slate-100">Завантаження профілю...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div
        className={`max-w-[1400px] mx-auto px-8 py-8 min-h-[calc(100vh-200px)] ${
          darkMode ? 'bg-slate-800' : ''
        }`}>
        <div className="text-center py-12 px-12 bg-white dark:bg-slate-800 rounded-lg shadow-md">
          <h2 className="text-text-primary dark:text-slate-100 mb-4 text-2xl font-semibold">
            Профіль Користувача
          </h2>
          <p className="text-text-primary dark:text-slate-100">
            Будь ласка,{' '}
            <Link
              href="/logIn"
              className="text-primary font-semibold no-underline transition-colors duration-300 hover:text-primary-dark hover:underline">
              увійдіть
            </Link>
            , щоб переглянути свої дані профілю.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`max-w-[1400px] mx-auto px-8 py-8 min-h-[calc(100vh-200px)] ${
        darkMode ? 'bg-slate-800' : ''
      }`}>
      <div className="mb-8">
        <h1 className="text-4xl text-text-primary dark:text-slate-100 font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Мій Профіль
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <div className="flex flex-col gap-8">
          <ProfileInfo />

          <div
            className={`bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md border border-gray-200 dark:border-slate-700 mb-8 ${
              darkMode ? 'bg-slate-800 border-slate-700' : ''
            }`}>
            <h3 className="text-text-primary dark:text-slate-100 text-2xl mb-6 font-semibold">
              Статистика
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-bg-tertiary dark:bg-slate-700 rounded-lg p-6 flex items-center gap-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="text-4xl leading-none">📅</div>
                <div className="flex flex-col gap-1">
                  <span className="text-text-secondary dark:text-slate-400 text-sm">
                    Активних бронювань
                  </span>
                  <span className="text-text-primary dark:text-slate-100 text-2xl font-bold text-primary">
                    —
                  </span>
                </div>
              </div>
              <div className="bg-bg-tertiary dark:bg-slate-700 rounded-lg p-6 flex items-center gap-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="text-4xl leading-none">⭐</div>
                <div className="flex flex-col gap-1">
                  <span className="text-text-secondary dark:text-slate-400 text-sm">
                    Залишено відгуків
                  </span>
                  <span className="text-text-primary dark:text-slate-100 text-2xl font-bold text-primary">
                    —
                  </span>
                </div>
              </div>
              <div className="bg-bg-tertiary dark:bg-slate-700 rounded-lg p-6 flex items-center gap-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="text-4xl leading-none">🎫</div>
                <div className="flex flex-col gap-1">
                  <span className="text-text-secondary dark:text-slate-400 text-sm">
                    Всього квитків
                  </span>
                  <span className="text-text-primary dark:text-slate-100 text-2xl font-bold text-primary">
                    —
                  </span>
                </div>
              </div>
            </div>
          </div>

          <UserRatings />
        </div>

        <div className="flex flex-col gap-8">
          <div
            className={`bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md border border-gray-200 dark:border-slate-700 ${
              darkMode ? 'bg-slate-800 border-slate-700' : ''
            }`}>
            <h3 className="text-text-primary dark:text-slate-100 text-2xl mb-6 font-semibold">
              Мої Бронювання
            </h3>
            <BookingList />
          </div>

          <div
            className={`bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md border border-gray-200 dark:border-slate-700 ${
              darkMode ? 'bg-slate-800 border-slate-700' : ''
            }`}>
            <h3 className="text-text-primary dark:text-slate-100 text-2xl mb-6 font-semibold">
              Швидкі дії
            </h3>
            <div className="flex flex-col gap-4">
              <Link
                href="/events"
                className="px-6 py-4 rounded-md no-underline text-center font-semibold transition-all duration-300 block bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg">
                Переглянути події
              </Link>
              <Link
                href="/booking"
                className="px-6 py-4 rounded-md no-underline text-center font-semibold transition-all duration-300 block bg-bg-tertiary dark:bg-slate-700 text-text-primary dark:text-slate-100 border-2 border-gray-200 dark:border-slate-600 hover:bg-primary hover:text-white hover:border-primary">
                Мої бронювання
              </Link>
            </div>
          </div>

          <div
            className={`bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md border border-gray-200 dark:border-slate-700 ${
              darkMode ? 'bg-slate-800 border-slate-700' : ''
            }`}>
            <h3 className="text-text-primary dark:text-slate-100 text-2xl mb-6 font-semibold">
              Інформація
            </h3>
            <div className="text-text-secondary dark:text-slate-300 leading-relaxed">
              <p className="mb-4">
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
