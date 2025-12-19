import { NextRequest, NextResponse } from 'next/server';
import { Rating, RatingResponse } from '../../../../../types';

interface RouteParams {
  params: Promise<{ eventId: string }>;
}

interface RateRequestBody {
  userId: string;
  rating: number;
  comment?: string;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { eventId } = await params;
    
    const { supabaseAdmin } = await import('../../../../../lib/supabase-server');
    
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: 'Server configuration error. Please configure SUPABASE_SERVICE_ROLE_KEY.' },
        { status: 503 }
      );
    }
    const { userId, rating, comment } = await request.json() as RateRequestBody;

    if (!userId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Invalid data' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const { data: existing, error: checkError } = await supabaseAdmin
      .from('rating_of_events')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .single();

    if (checkError && (checkError as { code?: string }).code !== 'PGRST116') {
      throw checkError;
    }

    if (existing) {
      const { error: updateError } = await supabaseAdmin
        .from('rating_of_events')
        .update({
          rating,
          comment,
          updated_at: now
        })
        .eq('id', (existing as { id: string }).id);

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabaseAdmin
        .from('rating_of_events')
        .insert({
          event_id: eventId,
          user_id: userId,
          rating,
          comment,
          created_at: now,
          updated_at: now
        });

      if (insertError) throw insertError;
    }

    const { data: allRatings } = await supabaseAdmin
      .from('rating_of_events')
      .select('*')
      .eq('event_id', eventId);

    const ratingsArray = (allRatings as Rating[]) || [];
    const avgRating = ratingsArray.length > 0
      ? ratingsArray.reduce((sum, r) => sum + (r.rating || 0), 0) / ratingsArray.length
      : 0;

    const limit = 2;
    const paginatedRatings = ratingsArray.slice(0, limit);

    return NextResponse.json({
      success: true,
      averageRating: avgRating.toFixed(1),
      ratings: paginatedRatings
    });

  } catch (error) {
    console.error('Error saving rating:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save rating' },
      { status: 500 }
    );
  }
}

