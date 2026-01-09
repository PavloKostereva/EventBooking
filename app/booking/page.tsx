'use client';
import BookingList from '../components/Booking/BookingList';

export const dynamic = 'force-dynamic';

export default function BookingPage() {
  return (
    <section className="min-h-[80vh] flex flex-col">
      <h2 className="text-center mb-8 text-4xl text-text-primary dark:text-slate-100 font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Мої бронювання
      </h2>
      <BookingList />
    </section>
  );
}
