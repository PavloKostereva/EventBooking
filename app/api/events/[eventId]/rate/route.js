import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const { eventId } = params;
    
    let supabaseAdmin;
    try {
      const { supabaseAdmin: admin } = await import('../../../../../lib/supabase-server');
      supabaseAdmin = admin;
    } catch (importError) {
      console.warn('Failed to import supabaseAdmin:', importError.message);
      return NextResponse.json(
        { success: false, message: 'Server configuration error. Please configure SUPABASE_SERVICE_ROLE_KEY.' },
        { status: 503 }
      );
    }
    const { userId, rating, comment } = await request.json();

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

    if (checkError && checkError.code !== 'PGRST116') {
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
        .eq('id', existing.id);

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

    const avgRating = allRatings?.length > 0
      ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length
      : 0;

    const limit = 2;
    const paginatedRatings = (allRatings || []).slice(0, limit);

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

