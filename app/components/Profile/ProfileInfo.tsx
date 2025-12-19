'use client';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/profile.css';

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
    <div className={`profile-info-card ${darkMode ? 'dark' : ''}`}>
      <div className="profile-avatar">
        <div className="avatar-circle">{displayName.charAt(0).toUpperCase()}</div>
      </div>
      <div className="profile-details">
        <h2 className="profile-name">{displayName}</h2>
        <p className="profile-email">{email}</p>
        <div className="profile-meta">
          <div className="meta-item">
            <span className="meta-label">Дата реєстрації:</span>
            <span className="meta-value">{joinDate}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">ID користувача:</span>
            <span className="meta-value-id">{currentUser.id?.substring(0, 8)}...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;

