import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase-server';

export async function GET() {
  try {
    console.log('Testing Supabase connection...');

    const { data, error } = await supabaseAdmin.from('events').select('count').limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    );
  }
}
