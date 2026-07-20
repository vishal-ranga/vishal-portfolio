import { NextRequest, NextResponse } from "next/server";
import { site } from "@/data/site";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body as { name?: string; email?: string; message?: string };

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "All fields are required." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "That email address doesn't look right." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;

    // No email provider configured yet — tell the caller clearly instead of
    // silently pretending the message was sent. See SETUP_GUIDE.md > "Wire up the contact form".
    if (!apiKey) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Contact form isn't wired up yet. Set RESEND_API_KEY in your environment (see SETUP_GUIDE.md) — until then, reach out directly.",
        },
        { status: 501 }
      );
    }

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio Contact Form <onboarding@resend.dev>",
        to: [site.email],
        reply_to: email,
        subject: `New portfolio message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });

    if (!resendRes.ok) {
      const detail = await resendRes.text();
      console.error("Resend error:", detail);
      return NextResponse.json({ ok: false, error: "Message couldn't be sent. Please try again shortly." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
