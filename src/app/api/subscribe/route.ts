import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { sendBuildMapEmail } from '../../../lib/email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email, source, offer } = await req.json();

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required.' }, { status: 400 });
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    console.error('[subscribe] RESEND_AUDIENCE_ID not set');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const isBuildMap = source === 'build-map';
  const isWaitlist = source === 'waitlist';
  const properties = isBuildMap ? { segment: 'build-map-downloader' } : undefined;

  const { error } = await resend.contacts.create({
    email: normalizedEmail,
    audienceId,
    unsubscribed: false,
    ...(properties ? { properties } : {}),
  });

  if (error) {
    const contactAlreadyExists = isBuildMap && /already exist/i.test(error.message ?? '');

    if (!contactAlreadyExists) {
      console.error('[subscribe] Resend contacts error:', error);
      return NextResponse.json({ error: 'Could not subscribe. Please try again.' }, { status: 500 });
    }

    const { error: updateError } = await resend.contacts.update({
      email: normalizedEmail,
      audienceId,
      properties,
    });

    if (updateError) {
      console.error('[subscribe] Resend contacts update error:', updateError);
      return NextResponse.json({ error: 'Could not subscribe. Please try again.' }, { status: 500 });
    }
  }

  if (isBuildMap) {
    try {
      const emailResult = await sendBuildMapEmail(normalizedEmail);
      if (!emailResult.success) {
        console.error('[subscribe] sendBuildMapEmail failed:', emailResult.error);
      }
    } catch (err) {
      console.error('[subscribe] sendBuildMapEmail threw:', err);
    }
  }

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (scriptUrl) {
    fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: isBuildMap ? 'build-map' : isWaitlist ? 'waitlist' : 'newsletter',
        email: normalizedEmail,
        ...(isWaitlist ? { offer } : {}),
      }),
      redirect: 'follow',
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
