import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const faithEmail = "faithelarose@faithindance.com";

function safeHtml(value: unknown) { return String(value ?? "").replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character] ?? character); }
async function sendBookingEmails(body: Record<string, string>, slots: { label: string }[], isWorship: boolean) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const details = isWorship ? "Sunday Worship Dance Class<br>Sunday, August 30 · 8:00–9:00 AM<br>Laura Cote School of Dance · $10" : slots.map((slot) => safeHtml(slot.label)).join("<br>");
  const customerName = safeHtml(body.name);
  const resend = new Resend(key);
  try {
    await Promise.all([
      resend.emails.send({ from: "Faith.In.Dance. <faithelarose@faithindance.com>", to: [body.email], replyTo: faithEmail, subject: "We received your Faith.In.Dance booking", html: `<p>Hi ${customerName},</p><p>We received your booking request for:</p><p><strong>${details}</strong></p><p>${isWorship ? "Your spot is held pending the $10 Stripe payment." : "Your time is held pending Stripe payment."}</p><p>Faith will follow up with any final details.</p><p>With love,<br>Faith.In.Dance.</p>` }),
      resend.emails.send({ from: "Faith.In.Dance. <faithelarose@faithindance.com>", to: [faithEmail], subject: `New booking: ${safeHtml(body.name)}`, html: `<p><strong>New Faith.In.Dance booking</strong></p><p>${details}</p><p>Name: ${customerName}<br>Email: ${safeHtml(body.email)}<br>Phone: ${safeHtml(body.phone)}<br>Dancer: ${safeHtml(body.dancerName) || "Not provided"}<br>Notes: ${safeHtml(body.notes) || "None"}</p><p>Payment status: pending Stripe checkout.</p>` }),
    ]);
  } catch (error) { console.error("Booking email could not be sent", error); }
}

function database() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
}

export async function GET() {
  const supabase = database();
  if (!supabase) return NextResponse.json({ bookedSlots: [] });
  const { data } = await supabase.from("faith_booking_slots").select("slot_key");
  return NextResponse.json({ bookedSlots: data?.map((slot) => slot.slot_key) ?? [] });
}

export async function POST(request: Request) {
  const supabase = database();
  if (!supabase) return NextResponse.json({ error: "Booking setup is not connected yet." }, { status: 503 });
  const body = await request.json(); const slots = Array.isArray(body.slots) ? body.slots : []; const isWorship = body.sessionType === "worship-class";
  if (!body.name || !body.email || !body.phone || (!isWorship && !slots.length) || slots.some((slot: { key?: unknown }) => typeof slot.key !== "string" || !/^2026-08-(29|30)T\d{2}:\d{2}$/.test(slot.key))) return NextResponse.json({ error: "Please complete your contact details and choose an available time." }, { status: 400 });
  const { data: booking, error } = await supabase.from("faith_bookings").insert({ name: body.name, email: body.email, phone: body.phone, dancer_name: body.dancerName || null, session_type: body.sessionType, notes: body.notes || null, status: "pending_payment", payment_status: "pending", requested_slots: slots }).select("id").single();
  if (error || !booking) return NextResponse.json({ error: "We could not save your booking. Please try again." }, { status: 500 });
  return NextResponse.json({ ok: true, bookingId: booking.id });
}
