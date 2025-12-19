'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [iconPath, setIconPath] = useState('/images/pngicon.png');
  const { darkMode, toggleTheme } = useTheme();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const { currentUser, userData } = useAuth();

  useEffect(() => {
    const img = new Image();
    img.onload = () => {};
    img.onerror = () => {
      setIconPath('./images/pngicon.png');
    };
    img.src = iconPath;
  }, [iconPath]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowConfirmLogout(false);
    router.push('/logIn');
  };

  return (
    <header>
      <nav>
        <ul>
          <img src={iconPath} alt="Іконка" />
          <li>
            <Link href="/" className={pathname === '/' ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/events" className={pathname === '/events' ? 'active' : ''}>
              Events
            </Link>
          </li>
          <li>
            <Link href="/booking" className={pathname === '/booking' ? 'active' : ''}>
              My booking
            </Link>
          </li>
          <li>
            <Link href="/about" className={pathname === '/about' ? 'active' : ''}>
              About
            </Link>
          </li>
          <li>
            {currentUser ? (
              <>
                <Link href="/profile" className={pathname === '/profile' ? 'active' : ''}>
                  Profile
                </Link>
                <span
                  onClick={() => setShowConfirmLogout(true)}
                  className={`nav-link ${pathname === '/logIn' ? 'active' : ''}`}>
                  Logout
                </span>
                <span className="user-greeting">Привіт, {userData?.email || currentUser?.email || 'користувачу'}!</span>
              </>
            ) : (
              <Link href="/logIn" className={pathname === '/logIn' ? 'active' : ''}>
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

