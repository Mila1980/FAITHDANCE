import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const prices = {
  "zoom-one": { 1: 4000, 2: 7000 },
  "zoom-two": { 1: 6000, 2: 10000 },
} as const;

function database() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
}

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const supabase = database();
  if (!secretKey || !supabase) {
    return NextResponse.json({ error: "Secure payment is not connected yet." }, { status: 503 });
  }

  const { bookingId, promoCode } = await request.json();
  if (!bookingId || typeof bookingId !== "string") {
    return NextResponse.json({ error: "Your booking could not be found." }, { status: 400 });
  }

  const { data: booking } = await supabase
    .from("faith_bookings")
    .select("id,name,email,session_type,requested_slots,status,payment_status")
    .eq("id", bookingId)
    .single();

  const blockCount = Array.isArray(booking?.requested_slots) ? booking.requested_slots.length : 0;
  const sessionType = booking?.session_type as keyof typeof prices;
  if (!booking || booking.status !== "pending_payment" || !(sessionType in prices) || (blockCount !== 1 && blockCount !== 2)) {
    return NextResponse.json({ error: "This booking is no longer available. Please choose a new time." }, { status: 400 });
  }

  const normalizedCode = String(promoCode ?? "").trim().toUpperCase();
  let amount: number = prices[sessionType][blockCount as 1 | 2];
  if (normalizedCode) {
    if (normalizedCode !== "FAITH26") {
      return NextResponse.json({ error: "That discount code is not valid." }, { status: 400 });
    }
    if (blockCount !== 2) {
      return NextResponse.json({ error: "FAITH26 is for a 60-minute Zoom lesson only." }, { status: 400 });
    }
    amount = sessionType === "zoom-one" ? 3000 : 4000;
  }

  const origin = request.headers.get("origin") ?? `https://${request.headers.get("host")}`;
  const lessonLength = blockCount === 2 ? "60-minute" : "30-minute";
  const dancerCount = sessionType === "zoom-one" ? "one dancer" : "two dancers";

  try {
    const stripe = new Stripe(secretKey);
    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: booking.email,
      client_reference_id: booking.id,
      success_url: `${origin}/book?payment=success`,
      cancel_url: `${origin}/book?payment=cancelled`,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: amount,
          product_data: { name: `Faith.In.Dance ${lessonLength} Zoom lesson · ${dancerCount}` },
        },
      }],
    });
    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error("Stripe checkout could not be created", error);
    return NextResponse.json({ error: "We could not start secure payment. Please try again." }, { status: 500 });
  }
}
