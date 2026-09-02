"use client";

import { FormEvent, useMemo, useState } from "react";

type Slot = { key: string; label: string };

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
    label: "Thursday, September 3",
    date: "2026-09-03",
    hours: "5:00–9:00 PM",
    times: ["5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM"],
  },
  {
    label: "Sunday, September 6",
    date: "2026-09-06",
    hours: "2:00–8:00 PM",
    times: ["2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"],
  },
  {
    label: "Monday, September 7",
    date: "2026-09-07",
    hours: "10:00 AM–1:00 PM",
    times: ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM"],
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
  const [selected, setSelected] = useState<Slot[]>([]);
  const [booked, setBooked] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [sessionType, setSessionType] = useState("zoom-one");
  const duration = selected.length * 30;
  const paymentUrl = privatePaymentUrls[sessionType]?.[selected.length];

  const selectedKeys = useMemo(() => new Set(selected.map((slot) => slot.key)), [selected]);

  function toggleSlot(slot: Slot) {
    if (booked.includes(slot.key)) return;
    setStatus("");
    setSelected((current) => {
      if (current.some((item) => item.key === slot.key)) {
        return current.filter((item) => item.key !== slot.key);
      }
      if (current.length >= 2) {
        setStatus("Choose up to two blocks for a 60-minute Zoom lesson.");
        return current;
      }
      return [...current, slot];
    });
  }

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
        focus: form.get("focus"),
        sessionType,
        slots: selected,
        notes: form.get("notes"),
      }),
    });
    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      setBooked((current) => [...current, ...selected.map((slot) => slot.key)]);
      setSelected([]);
      formElement.reset();
      if (paymentUrl && data.bookingId && !promoCode) {
        const checkout = new URL(paymentUrl);
        checkout.searchParams.set("client_reference_id", data.bookingId);
        setStatus("Your time is saved. Taking you to secure payment…");
        window.location.assign(checkout.toString());
        return;
      }
      if (data.bookingId) {
        const checkoutResponse = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: data.bookingId,
            promoCode,
          }),
        });
        const checkoutData = await checkoutResponse.json().catch(() => ({}));
        if (checkoutResponse.ok && checkoutData.url) {
          setStatus("Your time is saved. Taking you to secure payment…");
          window.location.assign(checkoutData.url);
          return;
        }
        setStatus(checkoutData.error ?? "We could not start secure payment. Please try again.");
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
          Every button is a 30-minute block. Choose one for a 30-minute lesson or
          two for one hour. All lessons are held on Zoom.
        </p>
        <div className="day-grid">
          {availability.map((day) => (
            <article className="day-card" key={day.date}>
              <p>{day.label}</p>
              <span>{day.hours}</span>
              <div className="time-grid">
                {day.times.map((time) => {
                  const key = slotKey(day.date, time);
                  const slot = { key, label: `${day.label} · ${time}` };
                  const isSelected = selectedKeys.has(key);
                  const isBooked = booked.includes(key);
                  return (
                    <button
                      type="button"
                      key={key}
                      className={isSelected ? "is-selected" : ""}
                      disabled={isBooked}
                      onClick={() => toggleSlot(slot)}
                    >
                      {isBooked ? "Booked" : time}
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

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
              What would you like to work on?
              <select name="focus" required defaultValue="">
                <option value="" disabled>Select a coaching focus</option>
                <option>Private Zoom lesson</option>
                <option>Tricks & technique</option>
                <option>Performance prep</option>
                <option>Audition or team placement</option>
                <option>Confidence and encouragement</option>
                <option>Something else</option>
              </select>
            </label>
            <label>Anything Faith should know?<textarea name="notes" rows={3} placeholder="Optional" /></label>
          </div>
          <button type="submit" className="button" disabled={!selected.length || saving}>
            {saving ? "Saving…" : "Save my Zoom lesson"} <span>→</span>
          </button>
          {status && <small className="booking-status">{status}</small>}
          <small>Use code FAITH26 for a 60-minute Zoom lesson: $30 for one dancer or $40 for two dancers.</small>
          <small>Your selected time is held while you complete secure payment.</small>
        </form>
      </section>
    </>
  );
}
