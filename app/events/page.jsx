'use client';
import EventList from '../components/Event/EventList';
import '../styles/events.css';

// Force dynamic rendering on Vercel to prevent 404 on refresh
export const dynamic = 'force-dynamic';

export default function EventsPage() {
    return <EventList />
}

