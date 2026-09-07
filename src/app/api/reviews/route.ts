import { NextResponse } from "next/server";
import { Resend } from "resend";

const faithEmail = "faithelarose@faithindance.com";
const safe = (value: unknown) => String(value ?? "").replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character] ?? character);

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.name || !body.email || !body.review) {
    return NextResponse.json({ error: "Please complete your name, email, and review." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "Review email is not configured yet." }, { status: 503 });

  try {
    await new Resend(key).emails.send({
      from: "Faith.In.Dance. <faithelarose@faithindance.com>",
      to: [faithEmail],
      replyTo: body.email,
      subject: `New Faith.In.Dance review from ${safe(body.name)}`,
      html: `<p><strong>New review for Faith.In.Dance.</strong></p><p><strong>From:</strong> ${safe(body.name)}<br><strong>Email:</strong> ${safe(body.email)}<br><strong>Dancer:</strong> ${safe(body.dancerName) || "Not provided"}<br><strong>Permission to share:</strong> ${body.permission ? "Yes" : "No"}</p><p><strong>Review:</strong></p><p>${safe(body.review).replace(/\n/g, "<br>")}</p>`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Your review could not be sent. Please try again." }, { status: 500 });
  }
}
