import { NextRequest, NextResponse } from 'next/server';
import { RatingResponse, Rating } from '../../../../../types';

interface RouteParams {
  params: Promise<{ eventId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { eventId } = await params;

    const { supabaseAdmin } = await import('../../../../../lib/supabase-server');

    if (!supabaseAdmin) {
      console.warn('Supabase admin client not configured, returning empty ratings');
      return NextResponse.json({
        success: true,
        averageRating: '0.0',
        ratings: [],
        totalRatings: 0,
        currentPage: 1,
        totalPages: 0,
      });
    }

    if (!eventId) {
      return NextResponse.json(
        { success: false, message: 'Event ID is required' },
        { status: 400 },
      );
    }

    console.log(`Fetching ratings for event: ${eventId}`);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '2');
    const offset = (page - 1) * limit;

    let eventTitle: string | null = null;
    try {
      const { data: eventData } = await supabaseAdmin
        .from('events')
        .select('title')
        .eq('id', eventId)
        .single();

      if (eventData) {
        eventTitle = (eventData as { title: string }).title;
      }
    } catch (err) {
      // Ignore error
    }

    const { data: ratings, error } = await supabaseAdmin
      .from('rating_of_events')
      .select('*')
      .eq('event_id', eventId);

    if (error) {
      console.error('Error fetching ratings from database:', error);
      console.error('Error code:', (error as { code?: string }).code);
      console.error('Error message:', (error as { message?: string }).message);

      if (
        (error as { message?: string }).message?.includes('Invalid API key') ||
        (error as { message?: string }).message?.includes('API key') ||
        (error as { code?: string }).code === '42P01' ||
        (error as { message?: string }).message?.includes('does not exist')
      ) {
        console.warn('Cannot fetch ratings (API key or access issue). Returning empty ratings.');
        return NextResponse.json({
          success: true,
          averageRating: '0.0',
          ratings: [],
          totalRatings: 0,
          currentPage: page,
          totalPages: 0,
        });
      }

      throw error;
    }

    const allRatings = (ratings as Rating[]) || [];
    console.log(`Found ${allRatings.length} ratings for event ${eventId}`);
    const userIds = [...new Set(allRatings.map((r) => r.user_id))];

    const averageRating =
      allRatings.length > 0
        ? allRatings.reduce((sum, item) => sum + (item.rating || 0), 0) / allRatings.length
        : 0;

    const userEmails: Record<string, string> = {};
    if (userIds.length > 0) {
      const { data: users, error: usersError } = await supabaseAdmin
        .from('users')
        .select('id, email')
        .in('id', userIds);

      if (usersError) {
        console.error('Error fetching users:', usersError);
      } else {
        (users || []).forEach((user: { id: string; email: string }) => {
          userEmails[user.id] = user.email;
        });
      }
    }

    const enrichedRatings = allRatings.map((rating) => ({
      ...rating,
      email: userEmails[rating.user_id] || 'Невідомий',
    }));

    const paginatedRatings = enrichedRatings.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      averageRating: averageRating.toFixed(1),
      ratings: paginatedRatings,
      totalRatings: allRatings.length,
      currentPage: page,
      totalPages: Math.ceil(allRatings.length / limit),
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    console.error('Error details:', {
      message: (error as Error).message,
      code: (error as { code?: string }).code,
      details: (error as { details?: string }).details,
      hint: (error as { hint?: string }).hint,
      stack: (error as Error).stack,
    });

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch ratings',
        error: (error as Error).message,
        code: (error as { code?: string }).code,
        details: (error as { details?: string }).details,
      },
      { status: 500 },
    );
  }
}

