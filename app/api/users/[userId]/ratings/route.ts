import { NextRequest, NextResponse } from 'next/server';
import { Rating } from '../../../../../types';
import { Event } from '../../../../../types';

interface RouteParams {
  params: Promise<{ userId: string }>;
}

interface EventsMap {
  [key: string]: {
    title: string;
    date: string;
    location?: string;
    price?: string;
    id?: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await params;

    const { supabaseAdmin } = await import('../../../../../lib/supabase-server');

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: 'Server configuration error. Please configure SUPABASE_SERVICE_ROLE_KEY.',
        },
        { status: 503 },
      );
    }

    const { data: ratings, error } = await supabaseAdmin
      .from('rating_of_events')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    const eventIds = [...new Set((ratings as Rating[] | null)?.map((r) => r.event_id).filter(Boolean) || [])];

    const { data: events } = await supabaseAdmin.from('events').select('*');

    const allEventsMap: Record<string, Event> = {};
    (events as Event[] | null)?.forEach((event) => {
      if (event.id) {
        allEventsMap[event.id] = event;
        allEventsMap[String(event.id)] = event;
      }
    });

    const eventsArray = (events as Event[]) || [];
    eventsArray.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
    });

    eventsArray.forEach((event, index) => {
      const numericId = String(index + 1);
      if (event.id) {
        allEventsMap[numericId] = event;
        allEventsMap[index + 1] = event;
      }
    });

    const eventsMap: EventsMap = {};
    eventIds.forEach((eventId) => {
      const eventIdStr = String(eventId);
      const event = allEventsMap[eventIdStr] || allEventsMap[eventId];

      if (event) {
        eventsMap[eventId] = {
          title: event.title || 'Невідома подія',
          date: event.date || 'Невідома дата',
          location: event.location || '',
          price: event.price || '',
          id: event.id || eventIdStr,
        };
      } else {
        eventsMap[eventId] = { title: 'Невідома подія', date: 'Невідома дата' };
      }
    });

    const sortedRatings = ((ratings as Rating[]) || []).sort((a, b) => {
      const dateA = a.updated_at || a.created_at || '';
      const dateB = b.updated_at || b.created_at || '';
      return String(dateB).localeCompare(String(dateA));
    });

    return NextResponse.json({
      success: true,
      ratings: sortedRatings,
      eventsMap,
      totalRatings: sortedRatings.length,
    });
  } catch (error) {
    console.error('Error fetching user ratings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user ratings' },
      { status: 500 },
    );
  }
}

