'use client';
import { useBooking } from '../../context/BookingContext';
import { useTheme } from '../../context/ThemeContext';

const BookingList = () => {
  const { bookings, cancelBooking, loading } = useBooking();
  const { darkMode } = useTheme();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] flex-1">
        <p className="text-text-primary dark:text-slate-100 text-lg">
          Завантаження ваших бронювань...
        </p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] flex-1">
        <p className="text-center py-5 text-lg text-text-primary dark:text-slate-100">
          Немає бронювань.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 flex-1">
      {bookings.map((booking) => (
        <div
          className={`bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 p-8 my-6 rounded-lg shadow-md text-left w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
            darkMode ? 'bg-slate-700 text-slate-100' : ''
          }`}
          key={booking.id}>
          <h3 className="text-3xl text-text-primary dark:text-slate-100 mb-4 font-semibold pb-3 border-b-2 border-gray-200 dark:border-slate-600">
            Подія: {booking.event_data?.title || booking.event?.title || 'Невідома подія'}
          </h3>
          <p
            className={`text-base text-text-secondary dark:text-slate-300 my-3 leading-relaxed ${
              darkMode ? 'text-slate-300' : ''
            }`}>
            <strong className="font-semibold text-text-primary dark:text-slate-100 mr-2">
              Дата:
            </strong>{' '}
            {booking.event_data?.date || booking.event?.date}
          </p>
          <p
            className={`text-base text-text-secondary dark:text-slate-300 my-3 leading-relaxed ${
              darkMode ? 'text-slate-300' : ''
            }`}>
            <strong className="font-semibold text-text-primary dark:text-slate-100 mr-2">
              Місце:
            </strong>{' '}
            {booking.event_data?.location || booking.event?.location}
          </p>
          <p
            className={`text-base text-text-secondary dark:text-slate-300 my-3 leading-relaxed ${
              darkMode ? 'text-slate-300' : ''
            }`}>
            <strong className="font-semibold text-text-primary dark:text-slate-100 mr-2">
              Ціна:
            </strong>{' '}
            {booking.event_data?.price || booking.event?.price}
          </p>
          <p
            className={`text-base text-text-secondary dark:text-slate-300 my-3 leading-relaxed ${
              darkMode ? 'text-slate-300' : ''
            }`}>
            <strong className="font-semibold text-text-primary dark:text-slate-100 mr-2">
              Ім'я:
            </strong>{' '}
            {booking.first_name} {booking.last_name}
          </p>
          <p
            className={`text-base text-text-secondary dark:text-slate-300 my-3 leading-relaxed ${
              darkMode ? 'text-slate-300' : ''
            }`}>
            <strong className="font-semibold text-text-primary dark:text-slate-100 mr-2">
              Email:
            </strong>{' '}
            {booking.email}
          </p>
          <p
            className={`text-base text-text-secondary dark:text-slate-300 my-3 leading-relaxed ${
              darkMode ? 'text-slate-300' : ''
            }`}>
            <strong className="font-semibold text-text-primary dark:text-slate-100 mr-2">
              Телефон:
            </strong>{' '}
            {booking.phone}
          </p>
          <p
            className={`text-base text-text-secondary dark:text-slate-300 my-3 leading-relaxed ${
              darkMode ? 'text-slate-300' : ''
            }`}>
            <strong className="font-semibold text-text-primary dark:text-slate-100 mr-2">
              Квитків:
            </strong>{' '}
            {booking.ticket_quantity}
          </p>
          <p
            className={`text-base text-text-secondary dark:text-slate-300 my-3 leading-relaxed ${
              darkMode ? 'text-slate-300' : ''
            }`}>
            <strong className="font-semibold text-text-primary dark:text-slate-100 mr-2">
              Загальна сума:
            </strong>{' '}
            {booking.total_price}
          </p>
          <button
            className="bg-error text-white border-none px-8 py-3.5 rounded-md cursor-pointer text-base font-medium transition-all duration-300 block mx-auto mt-6 shadow-sm w-full max-w-[300px] hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-md"
            onClick={() => booking.id && cancelBooking(booking.id)}>
            Скасувати
          </button>
        </div>
      ))}
    </div>
  );
};

export default BookingList;
