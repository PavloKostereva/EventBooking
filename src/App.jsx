import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import BookingPage from './pages/BookingPage'
import AboutPage from './pages/AboutPage'
import UserProfilePage from './pages/UserProfilePage'
import { BookingProvider } from './context/BookingContext'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import './styles/global.css'
import LogInPage from './pages/LogInPage'
import EventDetailsPage from './pages/EventDetailsPage';

const routerFutureOptions = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
}

function App() {
  return (
    <Router future={routerFutureOptions}>
      <AuthProvider>
        <BookingProvider>
          <ThemeProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/logIn" element={<LogInPage />} />
                <Route path="/events/:id" element={<EventDetailsPage />} />
              </Routes>
            </Layout>
          </ThemeProvider>
        </BookingProvider>
      </AuthProvider>
    </Router>
  )
}

export default App