import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://asorahura.vercel.app';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.redirect(`${BASE_URL}/unsubscribe?status=invalid`);
  }

  try {
    const res = await fetch('https://api.resend.com/suppressions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      console.error('[unsubscribe] Resend suppression failed:', await res.text());
    }
  } catch (err) {
    console.error('[unsubscribe] Suppression request threw:', err);
  }

  return NextResponse.redirect(`${BASE_URL}/unsubscribe?status=done`);
}
