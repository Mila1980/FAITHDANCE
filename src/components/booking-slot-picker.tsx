"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AvailabilityRequestForm } from "@/components/availability-request-form";

type Slot = { key: string; label: string };

const reservedSlots = new Set<string>();

const privatePaymentUrls: Record<string, Record<number, string>> = {
  "zoom-one": {
    1: "https://buy.stripe.com/3cI3cvcfX26V8XX41E3cc01",
    2: "https://buy.stripe.com/9B614n7ZHh1Pa21gOq3cc02",
  },
  "zoom-two": {
    1: "https://buy.stripe.com/eVqfZhbbTbHv2zzdCe3cc03",
    2: "https://buy.stripe.com/3cI28rdk1fXL4HH41E3cc04",
  },
};

const availability = [
  {
    label: "Saturday, September 12",
    date: "2026-09-12",
    hours: "12:00–4:00 PM",
    times: ["12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM"],
  },
  {
    label: "Sunday, September 13",
    date: "2026-09-13",
    hours: "3:00–8:00 PM",
    times: ["3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"],
  },
  {
    label: "Sunday, September 20",
    date: "2026-09-20",
    hours: "3:00–8:00 PM",
    times: ["3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"],
  },
  {
    label: "Sunday, September 27",
    date: "2026-09-27",
    hours: "3:00–8:00 PM",
    times: ["3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"],
  },
] as const;

function slotKey(date: string, time: string) {
  const [clock, meridiem] = time.split(" ");
  const [hourText, minute] = clock.split(":");
  let hour = Number(hourText);
  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  return `${date}T${String(hour).padStart(2, "0")}:${minute}`;
}

export function BookingSlotPicker() {
  const [booked, setBooked] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [sessionType, setSessionType] = useState("zoom-one");
  const [selectedDate, setSelectedDate] = useState("");
  const [startKey, setStartKey] = useState("");
  const [lessonBlocks, setLessonBlocks] = useState(1);

  useEffect(() => {
    fetch("/api/bookings")
      .then((response) => (response.ok ? response.json() : { bookedSlots: [] }))
      .then((data) => setBooked(data.bookedSlots ?? []))
      .catch(() => undefined);
  }, []);

  const chosenDay = availability.find((day) => day.date === selectedDate);
  const daySlots = useMemo(
    () => chosenDay?.times.map((time) => ({
      key: slotKey(chosenDay.date, time),
      label: `${chosenDay.label} · ${time}`,
      time,
    })) ?? [],
    [chosenDay],
  );
  const availableStarts = daySlots.filter((slot, index) => {
    const needed = daySlots.slice(index, index + lessonBlocks);
    return needed.length === lessonBlocks && needed.every(
      (item) => !reservedSlots.has(item.key) && !booked.includes(item.key),
    );
  });
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
      <section className="availability">
        <p className="eyebrow">September availability</p>
        <h2>
          Choose every block
          <br />
          <em>you need.</em>
        </h2>
        <p className="availability-note">
          Select a date, lesson length, and available start time. Booked times are
          removed automatically. All lessons are held on Zoom.
        </p>
        <div className="booking-picker">
          <label>
            Choose a date
            <select value={selectedDate} onChange={(event) => {
              setSelectedDate(event.target.value);
              setStartKey("");
              setStatus("");
            }}>
              <option value="">Select a date</option>
              {availability.map((day) => (
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
              {availableStarts.map((slot) => (
                <option key={slot.key} value={slot.key}>{slot.time}</option>
              ))}
            </select>
          </label>
          {selectedDate && !availableStarts.length && (
            <p className="booking-picker-empty">No {duration}-minute appointments remain on this date.</p>
          )}
        </div>
      </section>

      <AvailabilityRequestForm />

      <section className="booking-register" id="register">
        <div>
          <p className="eyebrow">Your booking</p>
          <h2>
            Build the session
            <br />
            <em>that works.</em>
          </h2>
          <p>
            Enter your email to save your Zoom lesson with Faith. After secure
            payment, Faith will send the Zoom link to that email address.
          </p>
          <label className="booking-session-label">
            Booking type
            <select value={sessionType} onChange={(event) => setSessionType(event.target.value)}>
              <option value="zoom-one">Zoom lesson · one dancer</option>
              <option value="zoom-two">Zoom lesson · two dancers</option>
            </select>
          </label>
        </div>

        <form className="booking-summary" onSubmit={submit}>
          <p>Your selected time</p>
          {selected.length ? (
            <>
              <strong>{selected.length} block{selected.length === 1 ? "" : "s"} · {duration} minutes</strong>
              <ul>{selected.map((slot) => <li key={slot.key}>{slot.label}</li>)}</ul>
            </>
          ) : (
            <span>Choose one or two time blocks above.</span>
          )}
          <div className="booking-details">
            <label>Parent / dancer name<input name="name" required placeholder="Your name" /></label>
            <label>Email for Zoom link<input name="email" type="email" required placeholder="you@example.com" /></label>
            <label>Phone<input name="phone" type="tel" required placeholder="Phone number" /></label>
            <label>Dancer name<input name="dancerName" placeholder="Optional" /></label>
            <label>Discount code<input name="promoCode" placeholder="Optional" /></label>
            <label>
              What would you like to work on? (optional)
              <textarea name="notes" rows={3} placeholder="Tell Faith what you would like help with." />
            </label>
          </div>
          <button type="submit" className="button" disabled={!selected.length || saving}>
            {saving ? "Saving…" : "Save my Zoom lesson"} <span>→</span>
          </button>
          {status && <small className="booking-status">{status}</small>}
          <small>Your selected time is held while you complete secure payment.</small>
        </form>
      </section>
    </>
  );
}
