import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';
import { createClient } from '@/lib/supabase/server';

/**
 * API Route to send welcome email to new users
 * POST /api/auth/send-welcome-email
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Send welcome email
    const result = await sendWelcomeEmail(profile.email, profile.full_name);

    if (!result.success) {
      console.error('Failed to send welcome email:', result.error);
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Welcome email sent successfully',
    });
  } catch (error) {
    console.error('Error in send-welcome-email route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
