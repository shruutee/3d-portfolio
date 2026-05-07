import { NextResponse } from "next/server";
import { contactRateLimit, getClientIp } from "@/lib/rate-limit";
import { contactFormSchema } from "@/lib/validations";

export const runtime = "nodejs";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = await contactRateLimit.limit(ip);

  if (!rate.success) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form fields and try again." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return NextResponse.json(
      {
        error:
          "Contact email is not configured yet. Set RESEND_API_KEY and CONTACT_TO_EMAIL.",
      },
      { status: 503 }
    );
  }

  const { name, email, message } = parsed.data;

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `Portfolio contact from ${name}`,
      reply_to: email,
      text: [`Name: ${name}`, `Email: ${email}`, "", message].join("\n"),
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Email delivery failed. Please try again later." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
