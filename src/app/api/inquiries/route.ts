import { NextResponse } from "next/server";
import { Resend } from "resend";

const faithEmail = "faithelarose@faithindance.com";
const safe = (value: unknown) => String(value ?? "").replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character] ?? character);

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.name || !body.email || !body.focus) return NextResponse.json({ error: "Please complete the required fields." }, { status: 400 });
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "Email is not configured." }, { status: 503 });
  try {
    await new Resend(key).emails.send({ from: "Faith.In.Dance. <faithelarose@faithindance.com>", to: [faithEmail], replyTo: body.email, subject: `New inquiry: ${safe(body.focus)}`, html: `<p><strong>New Faith.In.Dance inquiry</strong></p><p>Name: ${safe(body.name)}<br>Email: ${safe(body.email)}<br>They would like help with: ${safe(body.focus)}</p><p>${safe(body.message) || "No additional message."}</p>` });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Email could not be sent." }, { status: 500 }); }
}
