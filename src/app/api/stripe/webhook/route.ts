import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

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
      await supabase.from("faith_bookings").update({ payment_status: "paid", stripe_checkout_session_id: session.id, paid_at: new Date().toISOString() }).eq("id", session.client_reference_id);
    }
  }
  return NextResponse.json({ received: true });
}
