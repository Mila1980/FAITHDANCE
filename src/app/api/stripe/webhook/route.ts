import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const faithEmail = "faithelarose@faithindance.com";
const safe = (value: unknown) => String(value ?? "").replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character] ?? character);

async function sendPaidBookingEmails(booking: { name: string; email: string; phone: string; dancer_name: string | null; notes: string | null; session_type: string; requested_slots: { label: string }[] | null }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const isWorship = booking.session_type === "worship-class";
  const details = isWorship ? "Sunday Worship Dance Class<br>Sunday, August 30 · 8:00–9:00 AM<br>Laura Cote School of Dance · $10" : (booking.requested_slots ?? []).map((slot) => safe(slot.label)).join("<br>");
  const resend = new Resend(key);
  try { await Promise.all([
    resend.emails.send({ from: "Faith.In.Dance. <faithelarose@faithindance.com>", to: [booking.email], replyTo: faithEmail, subject: "Your Faith.In.Dance booking is confirmed", html: `<p>Hi ${safe(booking.name)},</p><p>Your payment was received and your booking is confirmed:</p><p><strong>${details}</strong></p><p>Faith will follow up with any final details.</p><p>With love,<br>Faith.In.Dance.</p>` }),
    resend.emails.send({ from: "Faith.In.Dance. <faithelarose@faithindance.com>", to: [faithEmail], subject: `Paid booking: ${safe(booking.name)}`, html: `<p><strong>Paid Faith.In.Dance booking</strong></p><p>${details}</p><p>Name: ${safe(booking.name)}<br>Email: ${safe(booking.email)}<br>Phone: ${safe(booking.phone)}<br>Dancer: ${safe(booking.dancer_name) || "Not provided"}<br>Notes: ${safe(booking.notes) || "None"}</p><p>Payment status: paid.</p>` }),
  ]); } catch (error) { console.error("Paid booking email could not be sent", error); }
}

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const signature = request.headers.get("stripe-signature");
  if (!secretKey || !webhookSecret || !supabaseUrl || !supabaseKey || !signature) return NextResponse.json({ error: "Webhook is not configured." }, { status: 500 });
  let event: Stripe.Event;
  try { event = new Stripe(secretKey).webhooks.constructEvent(await request.text(), signature, webhookSecret); }
  catch { return NextResponse.json({ error: "Invalid signature." }, { status: 400 }); }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid" && session.client_reference_id) {
      const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
      const { data: booking } = await supabase.from("faith_bookings").select("id,name,email,phone,dancer_name,notes,session_type,requested_slots").eq("id", session.client_reference_id).single();
      if (booking) {
        const requestedSlots = Array.isArray(booking.requested_slots) ? booking.requested_slots : [];
        if (requestedSlots.length) {
          const { error: slotError } = await supabase.from("faith_booking_slots").insert(requestedSlots.map((slot: { key: string; label: string }) => ({ booking_id: booking.id, slot_key: slot.key, slot_label: slot.label })));
          if (slotError) { await supabase.from("faith_bookings").update({ status: "payment_conflict", payment_status: "paid", stripe_checkout_session_id: session.id, paid_at: new Date().toISOString() }).eq("id", booking.id); return NextResponse.json({ received: true }); }
        }
        await supabase.from("faith_bookings").update({ status: "confirmed", payment_status: "paid", stripe_checkout_session_id: session.id, paid_at: new Date().toISOString() }).eq("id", booking.id);
        await sendPaidBookingEmails(booking);
      }
    }
  }
  return NextResponse.json({ received: true });
}
