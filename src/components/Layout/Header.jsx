import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useTheme } from '../../context/ThemeContext';
import { useAuthState } from '../../hooks/useAuthState';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [iconPath, setIconPath] = useState('/images/pngicon.png');
  const { darkMode, toggleTheme } = useTheme();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const { user, userData } = useAuthState();

  useEffect(() => {
    const img = new Image();
    img.onload = () => {};
    img.onerror = () => {
      setIconPath('./images/pngicon.png');
    };
    img.src = iconPath;
  }, [iconPath]);

  const handleLogout = async () => {
    await signOut(auth);
    setShowConfirmLogout(false);
    navigate('/logIn');
  };

  return (
    <header>
      <nav>
        <ul>
          <img src={iconPath} alt="Іконка" />
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/events" className={location.pathname === '/events' ? 'active' : ''}>
              Events
            </Link>
          </li>
          <li>
            <Link to="/booking" className={location.pathname === '/booking' ? 'active' : ''}>
              My booking
            </Link>
          </li>
          <li>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
              About
            </Link>
          </li>
          <li>
            {user ? (
              <>
                <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
                  Profile
                </Link>
                <span
                  onClick={() => setShowConfirmLogout(true)}
                  className={`nav-link ${location.pathname === '/logIn' ? 'active' : ''}`}>
                  Logout
                </span>
                <span className="user-greeting">Привіт, {userData?.email || 'користувачу'}!</span>
              </>
            ) : (
              <Link to="/logIn" className={location.pathname === '/logIn' ? 'active' : ''}>
                LogIn
              </Link>
            )}
          </li>
          <li className="theme-toggle">
            <button onClick={toggleTheme} className="theme-toggle-btn">
              {darkMode ? 'Light' : 'Dark'}
            </button>
          </li>
        </ul>
      </nav>

      {showConfirmLogout && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>Ви дійсно хочете вийти з акаунту?</p>
            <div className="modal-buttons">
              <button onClick={handleLogout}>Так</button>
              <button onClick={() => setShowConfirmLogout(false)}>Ні</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
