import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.NEXT_PUBLIC_PADDLE_TOKEN;
  const dfyPrice = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_DFY;
  const dwyPrice = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_DWY;
  const carePlanPrice = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_CARE_PLAN;
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;

  const status = {
    paddle_mode: token?.startsWith('test_') ? 'sandbox' : 'production',
    paddle_token_set: !!token,
    dfy_price_id_set: !!dfyPrice,
    dwy_price_id_set: !!dwyPrice,
    care_plan_price_id_set: !!carePlanPrice,
    webhook_secret_set: !!webhookSecret,
  };

  if (status.paddle_mode === 'sandbox') {
    return NextResponse.json(
      { warning: 'Paddle is in SANDBOX mode. Production token required before PAY-01.', ...status },
      { status: 503 }
    );
  }

  if (!status.dfy_price_id_set || !status.dwy_price_id_set || !status.care_plan_price_id_set) {
    return NextResponse.json(
      { error: 'Missing price IDs', ...status },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, ...status });
}
