import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required.' }, { status: 400 });
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    console.error('[subscribe] RESEND_AUDIENCE_ID not set');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const { error } = await resend.contacts.create({
    email: email.trim().toLowerCase(),
    audienceId,
    unsubscribed: false,
  });

  if (error) {
    console.error('[subscribe] Resend contacts error:', error);
    return NextResponse.json({ error: 'Could not subscribe. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
