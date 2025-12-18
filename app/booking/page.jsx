'use client';
import BookingList from '../components/Booking/BookingList';
import '../styles/booking.css';

export default function BookingPage() {
    return (
        <>
            <h2>Мої бронювання</h2>
            <BookingList />
        </>
    )
}

