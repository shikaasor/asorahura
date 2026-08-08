import { NextRequest, NextResponse } from "next/server";
import { automateSuccessSchema } from "../../../../lib/schemas";
import { sendOnboardingNotification } from "../../../../lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { product } = body as { product?: unknown };
  if (product !== "dfy" && product !== "dwy") {
    return NextResponse.json({ error: "Invalid product type" }, { status: 400 });
  }

  const result = automateSuccessSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  try {
    const emailResult = await sendOnboardingNotification({ product, ...result.data });
    if (!emailResult.success) {
      console.error("[onboarding] sendOnboardingNotification failed:", emailResult.error);
    }
  } catch (err) {
    console.error("[onboarding] sendOnboardingNotification threw:", err);
  }

  return NextResponse.json({ ok: true });
}
