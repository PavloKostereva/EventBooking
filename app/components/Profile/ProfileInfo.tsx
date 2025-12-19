'use client';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const ProfileInfo = () => {
  const { currentUser, userData } = useAuth();
  const { darkMode } = useTheme();

  if (!currentUser) {
    return null;
  }

  const displayName = (userData as { displayName?: string })?.displayName || currentUser.email?.split('@')[0] || 'Користувач';
  const email = currentUser.email || userData?.email || 'Немає email';

  let joinDate = 'Невідомо';
  if (userData?.created_at) {
    try {
      if (typeof userData.created_at === 'string') {
        joinDate = new Date(userData.created_at).toLocaleDateString('uk-UA');
      } else if ((userData.created_at as { toDate?: () => Date })?.toDate) {
        joinDate = (userData.created_at as { toDate: () => Date }).toDate().toLocaleDateString('uk-UA');
      }
    } catch (error) {
      console.error('Error parsing date:', error);
      joinDate = 'Невідомо';
    }
  }

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl p-10 shadow-lg border border-gray-200 dark:border-slate-700 mb-8 flex flex-col items-center text-center ${darkMode ? 'bg-slate-800 border-slate-700' : ''}`}>
      <div className="mb-6">
        <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-5xl font-bold text-white shadow-lg mx-auto">
          {displayName.charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="w-full">
        <h2 className="text-3xl text-text-primary dark:text-slate-100 mb-2 font-semibold">{displayName}</h2>
        <p className="text-text-secondary dark:text-slate-300 text-base mb-6">{email}</p>
        <div className="flex flex-col gap-4 mt-6 pt-6 border-t-2 border-gray-200 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary dark:text-slate-400 text-sm">Дата реєстрації:</span>
            <span className="text-text-primary dark:text-slate-100 font-semibold text-sm">{joinDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary dark:text-slate-400 text-sm">ID користувача:</span>
            <span className="text-primary font-semibold text-sm font-mono">{currentUser.id?.substring(0, 8)}...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
