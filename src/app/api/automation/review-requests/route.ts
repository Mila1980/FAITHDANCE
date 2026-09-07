import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const faithEmail = "faithelarose@faithindance.com";
const reviewLink = "https://www.faithindance.com/review";
const sentMarker = "[faith-review-request-sent]";

function database() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
}

function lessonEndedYesterday(slots: unknown) {
  if (!Array.isArray(slots) || !slots.length) return false;
  const latestSlot = slots
    .map((slot) => typeof slot?.key === "string" ? Date.parse(`${slot.key}:00`) : Number.NaN)
    .filter(Number.isFinite)
    .sort((a, b) => b - a)[0];
  return Number.isFinite(latestSlot) && Date.now() - latestSlot >= 24 * 60 * 60 * 1000;
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = database();
  const resendKey = process.env.RESEND_API_KEY;
  if (!supabase || !resendKey) {
    return NextResponse.json({ error: "Review email setup is not connected yet." }, { status: 503 });
  }

  const { data: bookings, error } = await supabase
    .from("faith_bookings")
    .select("id,name,email,dancer_name,notes,requested_slots")
    .eq("status", "confirmed")
    .eq("payment_status", "paid");
  if (error) return NextResponse.json({ error: "Could not load confirmed bookings." }, { status: 500 });

  const eligible = (bookings ?? []).filter((booking) =>
    !String(booking.notes ?? "").includes(sentMarker) && lessonEndedYesterday(booking.requested_slots),
  );
  const resend = new Resend(resendKey);
  let sent = 0;

  for (const booking of eligible) {
    try {
      await resend.emails.send({
        from: "Faith.In.Dance. <faithelarose@faithindance.com>",
        to: [booking.email],
        replyTo: faithEmail,
        subject: "Would you share a few words about your lesson with Faith?",
        html: `<p>Hi ${String(booking.name).replace(/[&<>\"]/g, "")},</p><p>Thank you for dancing with Faith.In.Dance. If you and ${booking.dancer_name ? `${String(booking.dancer_name).replace(/[&<>\"]/g, "")} ` : "your dancer "}enjoyed your Zoom lesson, would you share a few words about the experience?</p><p><a href="${reviewLink}">Share your review</a></p><p>Your note helps other families feel confident taking the next step. Thank you so much.</p><p>With love,<br>Faith.In.Dance.</p>`,
      });
      const notes = `${booking.notes ? `${booking.notes}\n\n` : ""}${sentMarker}`;
      await supabase.from("faith_bookings").update({ notes }).eq("id", booking.id);
      sent += 1;
    } catch (sendError) {
      console.error("Review request could not be sent", booking.id, sendError);
    }
  }

  return NextResponse.json({ ok: true, sent, eligible: eligible.length });
}
