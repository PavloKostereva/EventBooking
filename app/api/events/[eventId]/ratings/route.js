import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { eventId } = params;

    // Динамічний імпорт, щоб не падати, якщо ключ не встановлений
    let supabaseAdmin;
    try {
      const { supabaseAdmin: admin } = await import('../../../../../lib/supabase-server');
      supabaseAdmin = admin;
    } catch (importError) {
      console.warn('Failed to import supabaseAdmin, returning empty ratings:', importError.message);
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
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 2;
    const offset = (page - 1) * limit;

    let eventTitle = null;
    try {
      const { data: eventData } = await supabaseAdmin
        .from('events')
        .select('title')
        .eq('id', eventId)
        .single();

      if (eventData) {
        eventTitle = eventData.title;
      }
    } catch (err) {
      // Ignore error
    }

    // Перевіряємо, чи таблиця існує, спочатку пробуємо отримати рейтинги
    const { data: ratings, error } = await supabaseAdmin
      .from('rating_of_events')
      .select('*')
      .eq('event_id', eventId);

    if (error) {
      console.error('Error fetching ratings from database:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);

      // Якщо помилка пов'язана з API ключем або доступом, повертаємо порожній результат
      if (
        error.message?.includes('Invalid API key') ||
        error.message?.includes('API key') ||
        error.code === '42P01' ||
        error.message?.includes('does not exist')
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

    const allRatings = ratings || [];
    console.log(`Found ${allRatings.length} ratings for event ${eventId}`);
    const userIds = [...new Set(allRatings.map((r) => r.user_id))];

    const averageRating =
      allRatings.length > 0
        ? allRatings.reduce((sum, item) => sum + item.rating, 0) / allRatings.length
        : 0;

    const userEmails = {};
    if (userIds.length > 0) {
      const { data: users, error: usersError } = await supabaseAdmin
        .from('users')
        .select('id, email')
        .in('id', userIds);

      if (usersError) {
        console.error('Error fetching users:', usersError);
      } else {
        users?.forEach((user) => {
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
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      stack: error.stack,
    });

    // Повертаємо детальну інформацію про помилку для відлагодження
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch ratings',
        error: error.message,
        code: error.code,
        details: error.details,
      },
      { status: 500 },
    );
  }
}
