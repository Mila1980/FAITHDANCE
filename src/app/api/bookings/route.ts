import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const validSlotKeys = new Set([
  "2026-09-03T17:00", "2026-09-03T17:30", "2026-09-03T18:00",
  "2026-09-03T18:30", "2026-09-03T19:00", "2026-09-03T19:30",
  "2026-09-03T20:00", "2026-09-03T20:30",
  "2026-09-06T14:00", "2026-09-06T14:30", "2026-09-06T15:00",
  "2026-09-06T15:30", "2026-09-06T16:00", "2026-09-06T16:30",
  "2026-09-06T17:00", "2026-09-06T17:30", "2026-09-06T18:00",
  "2026-09-06T18:30", "2026-09-06T19:00", "2026-09-06T19:30",
  "2026-09-07T10:00", "2026-09-07T10:30", "2026-09-07T11:00",
  "2026-09-07T11:30", "2026-09-07T12:00", "2026-09-07T12:30",
]);

function database() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
}

async function clearExpiredHolds(supabase: NonNullable<ReturnType<typeof database>>) {
  const { data } = await supabase
    .from("faith_bookings")
    .select("id")
    .eq("status", "pending_payment")
    .lt("hold_expires_at", new Date().toISOString());
  const ids = data?.map((booking) => booking.id) ?? [];
  if (!ids.length) return;
  await supabase.from("faith_booking_slots").delete().in("booking_id", ids);
  await supabase.from("faith_bookings").delete().in("id", ids);
}

export async function GET() {
  const supabase = database();
  if (!supabase) return NextResponse.json({ bookedSlots: [] });
  await clearExpiredHolds(supabase);
  const { data } = await supabase.from("faith_booking_slots").select("slot_key");
  return NextResponse.json({ bookedSlots: data?.map((slot) => slot.slot_key) ?? [] });
}

export async function POST(request: Request) {
  const supabase = database();
  if (!supabase) {
    return NextResponse.json({ error: "Booking setup is not connected yet." }, { status: 503 });
  }

  await clearExpiredHolds(supabase);
  const body = await request.json();
  const slots = Array.isArray(body.slots) ? body.slots : [];
  const validSlots = slots.every(
    (slot: { key?: unknown }) => typeof slot.key === "string" && validSlotKeys.has(slot.key),
  );

  if (!body.name || !body.email || !body.phone || !slots.length || !validSlots) {
    return NextResponse.json(
      { error: "Please complete your contact details and choose an available time." },
      { status: 400 },
    );
  }

  const coachingFocus = body.focus ? `What they would like to work on: ${body.focus}` : "";
  const notes = [coachingFocus, body.notes].filter(Boolean).join("\n\n") || null;
  const { data: booking, error } = await supabase
    .from("faith_bookings")
    .insert({
      name: body.name,
      email: body.email,
      phone: body.phone,
      dancer_name: body.dancerName || null,
      session_type: body.sessionType,
      notes,
      status: "pending_payment",
      payment_status: "pending",
      requested_slots: slots,
      hold_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    })
    .select("id")
    .single();

  if (error || !booking) {
    return NextResponse.json({ error: "We could not save your booking. Please try again." }, { status: 500 });
  }

  const { error: slotError } = await supabase
    .from("faith_booking_slots")
    .insert(slots.map((slot: { key: string; label: string }) => ({
      booking_id: booking.id,
      slot_key: slot.key,
      slot_label: slot.label,
    })));

  if (slotError) {
    await supabase.from("faith_bookings").delete().eq("id", booking.id);
    return NextResponse.json(
      { error: "That time was just selected by another family. Please choose another available time." },
      { status: 409 },
    );
  }

  return NextResponse.json({ ok: true, bookingId: booking.id });
}
