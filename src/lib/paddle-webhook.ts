import crypto from 'crypto';

const REPLAY_WINDOW_SECONDS = 300; // 5 minutes

export function verifyPaddleWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    const parts = signature.split(';').reduce<Record<string, string>>((acc, segment) => {
      const [key, value] = segment.split('=');
      if (key && value) acc[key] = value;
      return acc;
    }, {});

    const ts = parts['ts'];
    const h1 = parts['h1'];
    if (!ts || !h1) return false;

    if (Math.abs(Date.now() / 1000 - Number(ts)) > REPLAY_WINDOW_SECONDS) {
      return false;
    }

    const expectedHmac = crypto
      .createHmac('sha256', secret)
      .update(`${ts}:${body}`)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedHmac, 'hex');
    const actualBuffer = Buffer.from(h1, 'hex');

    if (expectedBuffer.length !== actualBuffer.length) return false;

    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
  } catch {
    return false;
  }
}
