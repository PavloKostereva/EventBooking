'use client';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { useBooking } from '../../context/BookingContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useTimer } from '../../hooks/useTimer';
import { Event } from '../../../types';
import '../../styles/booking-form.css';

interface BookingFormProps {
  event: Event;
  onClose: () => void;
}

const BookingForm = ({ event, onClose }: BookingFormProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ticketQuantity: 1,
  });
  const { addBooking } = useBooking();
  const { darkMode } = useTheme();
  const { isAuthenticated } = useAuth();
  const { timeLeft, stop } = useTimer(600, () => {
    onClose();
    alert('Час на бронювання вийшов!');
  });

  const priceNumber = parseInt(event.price.replace(/\D/g, ''));
  const totalPrice = priceNumber * formData.ticketQuantity;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'ticketQuantity' ? parseInt(value) || 1 : value 
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    stop();

    if (!isAuthenticated) {
      alert('Для бронювання квитків необхідно увійти в свій акаунт.');
      onClose();
      return;
    }

    const bookingData = {
      event,
      ...formData,
      totalPrice: `${totalPrice} грн`,
    };

    const success = await addBooking(bookingData);

    if (success) {
      onClose();
      alert('Бронювання підтверджено!');
      window.location.href = '/booking';
    } else {
      alert('Помилка бронювання. Перевірте авторизацію.');
    }
  };

  const modalContent = (
    <div
      className="booking-form-modal-wrapper"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          stop();
          onClose();
        }
      }}>
      <div className="booking-form-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button
          className="booking-form-close-btn"
          onClick={() => {
            stop();
            onClose();
          }}
          aria-label="Закрити">
          &times;
        </button>

        <div className="booking-form-header">
          <h3>Бронювання квитків</h3>
          <div className="booking-form-event-info">
            <p className="booking-form-event-title">{event.title}</p>
            <p className="booking-form-event-details">
              {event.date} • {event.location}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="booking-form-timer">
            <span className="booking-form-timer-icon">⏱</span>
            <p>
              Час на підтвердження:{' '}
              <strong>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </strong>
            </p>
          </div>

          <div className="booking-form-grid">
            <div className="booking-form-group">
              <label htmlFor="booking-firstName" className="booking-form-label">
                Ім'я:
              </label>
              <input
                type="text"
                id="booking-firstName"
                name="firstName"
                className="booking-form-input"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Введіть ваше ім'я"
                required
              />
            </div>

            <div className="booking-form-group">
              <label htmlFor="booking-lastName" className="booking-form-label">
                Прізвище:
              </label>
              <input
                type="text"
                id="booking-lastName"
                name="lastName"
                className="booking-form-input"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Введіть ваше прізвище"
                required
              />
            </div>

            <div className="booking-form-group">
              <label htmlFor="booking-email" className="booking-form-label">
                Email:
              </label>
              <input
                type="email"
                id="booking-email"
                name="email"
                className="booking-form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="booking-form-group">
              <label htmlFor="booking-phone" className="booking-form-label">
                Номер телефону:
              </label>
              <input
                type="tel"
                id="booking-phone"
                name="phone"
                className="booking-form-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+380 XX XXX XX XX"
                required
              />
            </div>

            <div className="booking-form-group full-width">
              <label htmlFor="booking-ticketQuantity" className="booking-form-label">
                Кількість квитків:
              </label>
              <div className="booking-form-quantity-control">
                <button
                  type="button"
                  className="booking-form-quantity-btn"
                  onClick={() =>
                    formData.ticketQuantity > 1 &&
                    setFormData((prev) => ({ ...prev, ticketQuantity: prev.ticketQuantity - 1 }))
                  }
                  disabled={formData.ticketQuantity <= 1}>
                  -
                </button>
                <input
                  type="number"
                  id="booking-ticketQuantity"
                  name="ticketQuantity"
                  className="booking-form-input"
                  min="1"
                  max="10"
                  value={formData.ticketQuantity}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="booking-form-quantity-btn"
                  onClick={() =>
                    formData.ticketQuantity < 10 &&
                    setFormData((prev) => ({ ...prev, ticketQuantity: prev.ticketQuantity + 1 }))
                  }
                  disabled={formData.ticketQuantity >= 10}>
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="booking-form-price-summary">
            <div className="booking-form-price-row">
              <span>Ціна за квиток:</span>
              <span>{event.price}</span>
            </div>
            <div className="booking-form-price-row">
              <span>Кількість:</span>
              <span>{formData.ticketQuantity}</span>
            </div>
            <div className="booking-form-price-row total">
              <span>Загальна сума:</span>
              <span>{totalPrice} грн</span>
            </div>
          </div>

          <div className="booking-form-actions">
            <button type="submit" className="booking-form-submit-btn">
              Підтвердити бронювання
            </button>
            <button
              type="button"
              className="booking-form-cancel-btn"
              onClick={() => {
                stop();
                onClose();
              }}>
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default BookingForm;

