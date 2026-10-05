"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { bookingAvailability, bookingSlotKey, unavailableBookingSlotKeys } from "@/lib/booking-availability";

type Slot = { key: string; label: string };

const reservedSlots = new Set<string>();

const privatePaymentUrls: Record<string, Record<number, string>> = {
  "in-person-one": { 1: "https://buy.stripe.com/3cI3cvcfX26V8XX41E3cc01", 2: "https://buy.stripe.com/9B614n7ZHh1Pa21gOq3cc02" },
  "in-person-two": { 1: "https://buy.stripe.com/eVqfZhbbTbHv2zzdCe3cc03", 2: "https://buy.stripe.com/3cI28rdk1fXL4HH41E3cc04" },
  "zoom-one": {
    1: "https://buy.stripe.com/3cI3cvcfX26V8XX41E3cc01",
    2: "https://buy.stripe.com/9B614n7ZHh1Pa21gOq3cc02",
  },
  "zoom-two": {
    1: "https://buy.stripe.com/eVqfZhbbTbHv2zzdCe3cc03",
    2: "https://buy.stripe.com/3cI28rdk1fXL4HH41E3cc04",
  },
};



export function BookingSlotPicker() {
  const [booked, setBooked] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [sessionType, setSessionType] = useState("in-person-one");
  const [selectedDate, setSelectedDate] = useState("");
  const [startKey, setStartKey] = useState("");
  const [lessonBlocks, setLessonBlocks] = useState(1);

  useEffect(() => {
    fetch("/api/bookings")
      .then((response) => (response.ok ? response.json() : { bookedSlots: [] }))
      .then((data) => setBooked(data.bookedSlots ?? []))
      .catch(() => undefined);
  }, []);

  const chosenDay = bookingAvailability.find((day) => day.date === selectedDate);
  const daySlots = useMemo(
    () => chosenDay?.times.map((time) => ({
      key: bookingSlotKey(chosenDay.date, time),
      label: `${chosenDay.label} · ${time}`,
      time,
    })) ?? [],
    [chosenDay],
  );
  const startAvailability = daySlots.map((slot, index) => {
    const needed = daySlots.slice(index, index + lessonBlocks);
    const blocked = needed.length !== lessonBlocks || needed.some((item) =>
      unavailableBookingSlotKeys.has(item.key) || reservedSlots.has(item.key) || booked.includes(item.key),
    );
    return { ...slot, blocked };
  });
  const availableStarts = startAvailability.filter((slot) => !slot.blocked);
  const startIndex = daySlots.findIndex((slot) => slot.key === startKey);
  const selected: Slot[] = startIndex >= 0
    ? daySlots.slice(startIndex, startIndex + lessonBlocks).map(({ key, label }) => ({ key, label }))
    : [];
  const duration = lessonBlocks * 30;
  const paymentUrl = privatePaymentUrls[sessionType]?.[lessonBlocks];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected.length) return;

    const formElement = event.currentTarget;
    setSaving(true);
    setStatus("");
    const form = new FormData(formElement);
    const promoCode = String(form.get("promoCode") ?? "").trim();
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        dancerName: form.get("dancerName"),
        sessionType,
        slots: selected,
        notes: form.get("notes"),
      }),
    });
    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      setBooked((current) => [...current, ...selected.map((slot) => slot.key)]);
      setStartKey("");
      formElement.reset();
      if (paymentUrl && data.bookingId) {
        const checkout = new URL(paymentUrl);
        checkout.searchParams.set("client_reference_id", data.bookingId);
        if (promoCode) checkout.searchParams.set("prefilled_promo_code", promoCode);
        setStatus("Your time is saved. Taking you to secure payment…");
        window.location.assign(checkout.toString());
        return;
      }
    } else {
      setStatus(data.error ?? "That time was just booked. Please choose another available time.");
    }
    setSaving(false);
  }

  return (
    <>
      <section className="booking-register" id="register">
        <div>
          <p className="eyebrow">Your booking</p>
          <h2>
            Build the session
            <br />
            <em>that works.</em>
          </h2>
          <p>
            Choose an in-person date and time, then enter your details to reserve your lesson.
          </p>
          <label className="booking-session-label">
            Booking type
            <select value={sessionType} onChange={(event) => setSessionType(event.target.value)}>
              <option value="in-person-one">In-person lesson: one dancer</option>
              <option value="in-person-two">In-person lesson: two dancers</option>
            </select>
          </label>
        </div>

        <form className="booking-summary" onSubmit={submit}>
          <div className="booking-picker">
            <label>
              Choose a date
              <select value={selectedDate} onChange={(event) => {
                setSelectedDate(event.target.value);
                setStartKey("");
                setStatus("");
              }}>
                <option value="">Select a date</option>
                {bookingAvailability.map((day) => (
                  <option key={day.date} value={day.date}>{day.label} · {day.hours}</option>
                ))}
              </select>
            </label>
            <label>
              Lesson length
              <select value={lessonBlocks} onChange={(event) => {
                setLessonBlocks(Number(event.target.value));
                setStartKey("");
                setStatus("");
              }}>
                <option value={1}>30 minutes</option>
                <option value={2}>60 minutes</option>
              </select>
            </label>
            <label>
              Choose a start time
              <select value={startKey} disabled={!selectedDate} onChange={(event) => {
                setStartKey(event.target.value);
                setStatus("");
              }}>
                <option value="">{selectedDate ? "Select an available time" : "Choose a date first"}</option>
                {startAvailability.map((slot) => (
                  <option key={slot.key} value={slot.key} disabled={slot.blocked} style={slot.blocked ? { textDecoration: "line-through" } : undefined}>{slot.time}{slot.blocked ? " (Booked)" : ""}</option>
                ))}
              </select>
            </label>
            {selectedDate && !availableStarts.length && (
              <p className="booking-picker-empty">No {duration}-minute appointments remain on this date.</p>
            )}
          </div>
          <p>Your selected time</p>
          {selected.length ? (
            <>
              <strong>{selected.length} block{selected.length === 1 ? "" : "s"} · {duration} minutes</strong>
              <ul>{selected.map((slot) => <li key={slot.key}>{slot.label}</li>)}</ul>
            </>
          ) : (
            <span>Choose your date, lesson length, and start time.</span>
          )}
          <div className="booking-details">
            <label>Parent / dancer name<input name="name" required placeholder="Your name" /></label>
            <label>Email for booking details<input name="email" type="email" required placeholder="you@example.com" /></label>
            <label>Phone<input name="phone" type="tel" required placeholder="Phone number" /></label>
            <label>Dancer name<input name="dancerName" placeholder="Optional" /></label>
            <label>Discount code<input name="promoCode" placeholder="Optional" /></label>
            <label>
              What would you like to work on? (optional)
              <textarea name="notes" rows={3} placeholder="Tell Faith what you would like help with." />
            </label>
          </div>
          <button type="submit" className="button" disabled={!selected.length || saving}>
            {saving ? "Saving…" : "Continue to payment"} <span>→</span>
          </button>
          {status && <small className="booking-status">{status}</small>}
          <small>Your selected time is held while you complete secure payment.</small>
        </form>
      </section>
    </>
  );
}
