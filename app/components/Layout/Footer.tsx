'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const Footer = () => {
  const pathname = usePathname();
  const { currentUser } = useAuth();

  return (
    <footer className="bg-gradient-to-br from-primary via-primary/90 to-secondary text-white pt-12 pb-4 shadow-xl mt-auto backdrop-blur-md border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-6">
          <div className="flex flex-col items-center md:items-start">
            <img
              src="/images/pngicon.png"
              alt="Логотип"
              className="w-[60px] h-[60px] rounded-xl object-cover shadow-lg mb-4 ring-2 ring-white/20"
            />
            <h3 className="text-xl font-bold mb-2">EventBooking</h3>
            <p className="text-sm opacity-90 text-center md:text-left">
              Якщо не хочеш пропустити наяскравіші події, бронюй білети з нами!
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Навігація</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className={`text-sm opacity-90 hover:opacity-100 hover:underline transition-all ${
                    pathname === '/' ? 'opacity-100 font-semibold' : ''
                  }`}>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className={`text-sm opacity-90 hover:opacity-100 hover:underline transition-all ${
                    pathname === '/events' ? 'opacity-100 font-semibold' : ''
                  }`}>
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/booking"
                  className={`text-sm opacity-90 hover:opacity-100 hover:underline transition-all ${
                    pathname === '/booking' ? 'opacity-100 font-semibold' : ''
                  }`}>
                  My booking
                </Link>
              </li>
              {currentUser ? (
                <li>
                  <Link
                    href="/profile"
                    className={`text-sm opacity-90 hover:opacity-100 hover:underline transition-all ${
                      pathname === '/profile' ? 'opacity-100 font-semibold' : ''
                    }`}>
                    Profile
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    href="/logIn"
                    className={`text-sm opacity-90 hover:opacity-100 hover:underline transition-all ${
                      pathname === '/logIn' ? 'opacity-100 font-semibold' : ''
                    }`}>
                    LogIn
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Контакти</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li>
                <span className="font-medium">Пошта:</span>{' '}
                <a
                  href="mailto:orest.kliuk.oi.2023@lpnu.ua"
                  className="underline hover:opacity-100 transition-opacity">
                  orest.kliuk.oi.2023@lpnu.ua
                </a>
              </li>
              <li>
                <span className="font-medium">Телефон:</span>{' '}
                <a
                  href="tel:380123456780"
                  className="underline hover:opacity-100 transition-opacity">
                  380123456780
                </a>
              </li>
              <li>
                <span className="font-medium">Робочі години:</span>
                <br />
                <span>9:00 - 21:00 (без вихідних)</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Про нас</h4>
            <p className="text-sm opacity-90 mb-3">
              Ми — команда ентузіастів, яка створила платформу для онлайн-бронювання квитків, щоб
              зробити процес відвідування заходів швидким, зручним і доступним для всіх.
            </p>
            <p className="text-xs opacity-75">© 2025 EventBooking. Всі права захищені.</p>
          </div>
        </div>

        <div className="border-t border-white/20 pt-4 pb-2 text-center">
          <p className="text-sm opacity-75">Orest Klyuk | veb 2025</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
