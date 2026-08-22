import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

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
  const { data: booking, error } = await supabase.from("faith_bookings").insert({ name: body.name, email: body.email, phone: body.phone, dancer_name: body.dancerName || null, session_type: body.sessionType, notes: body.notes || null }).select("id").single();
  if (error || !booking) return NextResponse.json({ error: "We could not save your booking. Please try again." }, { status: 500 });
  if (isWorship) return NextResponse.json({ ok: true });
  const { error: slotError } = await supabase.from("faith_booking_slots").insert(slots.map((slot: { key: string; label: string }) => ({ booking_id: booking.id, slot_key: slot.key, slot_label: slot.label })));
  if (slotError) { await supabase.from("faith_bookings").delete().eq("id", booking.id); return NextResponse.json({ error: "One of those times was just booked. Please choose another available time." }, { status: 409 }); }
  return NextResponse.json({ ok: true });
}
