import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { userId } = params;

    let supabaseAdmin;
    try {
      const { supabaseAdmin: admin } = await import('../../../../../lib/supabase-server');
      supabaseAdmin = admin;
    } catch (importError) {
      console.warn('Failed to import supabaseAdmin:', importError.message);
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 503 },
      );
    }

    const { data: ratings, error } = await supabaseAdmin
      .from('rating_of_events')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    const eventIds = [...new Set(ratings?.map((r) => r.event_id).filter(Boolean) || [])];

    const { data: events } = await supabaseAdmin.from('events').select('*');

    const allEventsMap = {};
    events?.forEach((event) => {
      allEventsMap[event.id] = event;
      allEventsMap[String(event.id)] = event;
    });

    const eventsArray = events || [];
    eventsArray.sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : new Date(0);
      const dateB = b.date ? new Date(b.date) : new Date(0);
      return dateA - dateB;
    });

    eventsArray.forEach((event, index) => {
      const numericId = String(index + 1);
      allEventsMap[numericId] = event;
      allEventsMap[index + 1] = event;
    });

    const eventsMap = {};
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

    const sortedRatings = (ratings || []).sort((a, b) => {
      const dateA = a.updated_at || a.created_at || '';
      const dateB = b.updated_at || b.created_at || '';
      return dateB.localeCompare(dateA);
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
