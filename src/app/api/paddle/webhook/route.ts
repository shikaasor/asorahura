import { NextRequest, NextResponse } from 'next/server';
import { verifyPaddleWebhookSignature } from '../../../../lib/paddle-webhook';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('paddle-signature');
  const body = await req.text();

  if (!signature || !verifyPaddleWebhookSignature(body, signature, process.env.PADDLE_WEBHOOK_SECRET!)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.type === 'transaction.completed') {
    console.log('[paddle-webhook] transaction.completed', event.data.id);
  } else {
    console.log('[paddle-webhook] ignoring event type', event.type);
  }

  return NextResponse.json({ ok: true });
}
