import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/profile.css';

const ProfileInfo = () => {
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  if (loading) {
    return <div className="profile-info-loading">Завантаження...</div>;
  }

  if (!currentUser) {
    return null;
  }

  const displayName = userData?.displayName || currentUser.displayName || 'Користувач';
  const email = currentUser.email || 'Немає email';
  
  // Обробка дати реєстрації - може бути ISO рядок або Firestore Timestamp
  let joinDate = 'Невідомо';
  if (userData?.createdAt) {
    try {
      if (typeof userData.createdAt === 'string') {
        // Якщо це ISO рядок
        joinDate = new Date(userData.createdAt).toLocaleDateString('uk-UA');
      } else if (userData.createdAt.seconds) {
        // Якщо це Firestore Timestamp
        joinDate = new Date(userData.createdAt.seconds * 1000).toLocaleDateString('uk-UA');
      } else if (userData.createdAt.toDate) {
        // Якщо це Firestore Timestamp з методом toDate
        joinDate = userData.createdAt.toDate().toLocaleDateString('uk-UA');
      }
    } catch (error) {
      console.error('Error parsing date:', error);
      joinDate = 'Невідомо';
    }
  }

  return (
    <div className={`profile-info-card ${darkMode ? 'dark' : ''}`}>
      <div className="profile-avatar">
        <div className="avatar-circle">
          {displayName.charAt(0).toUpperCase()}
        </div>
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
            <span className="meta-value-id">{currentUser.uid.substring(0, 8)}...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;

