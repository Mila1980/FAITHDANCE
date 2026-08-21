"use client";

import { useMemo, useState } from "react";

const saturdayTimes = ["8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM"];
const sundayTimes = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM"];
type Day = "Saturday, August 29" | "Sunday, August 30";

export function BookingSlotPicker() {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [sessionType, setSessionType] = useState("in-person-one");
  const minutes = selectedSlots.length * 30;
  const duration = useMemo(() => minutes >= 60 ? `${Math.floor(minutes / 60)} hr${minutes >= 120 ? "s" : ""}${minutes % 60 ? ` ${minutes % 60} min` : ""}` : `${minutes} min`, [minutes]);
  const toggleSlot = (day: Day, time: string) => { const slot = `${day} · ${time}`; setSelectedSlots((current) => current.includes(slot) ? current.filter((item) => item !== slot) : [...current, slot]); };
  const dayCard = (day: Day, times: string[]) => <article><header><span>{day.startsWith("Saturday") ? "Saturday" : "Sunday"}</span><h3>{day.endsWith("29") ? "August 29" : "August 30"}</h3><p>{day.startsWith("Saturday") ? "8:00 AM–9:00 PM" : "9:00 AM–3:00 PM"}</p></header><div className="time-grid">{times.map((time) => { const slot = `${day} · ${time}`; const active = selectedSlots.includes(slot); return <button className={active ? "is-selected" : ""} type="button" aria-pressed={active} key={time} onClick={() => toggleSlot(day, time)}>{time}</button>; })}</div></article>;
  return <><section className="availability"><p className="eyebrow">Weekend availability</p><h2>Choose every block<br /><em>you need.</em></h2><p className="availability-note">Every button is a 30-minute block. Pick two for one hour, or select more blocks for a longer session or multiple dancers.</p><div className="day-grid">{dayCard("Saturday, August 29", saturdayTimes)}{dayCard("Sunday, August 30", sundayTimes)}</div></section><section className="booking-register" id="register"><div><p className="eyebrow">Your booking</p><h2>Build the session<br /><em>that works.</em></h2><p>Select the coaching type, then every time block you need. Stripe checkout will be added next to secure your appointment.</p><label className="booking-session-label">Coaching type<select value={sessionType} onChange={(event) => setSessionType(event.target.value)}><option value="in-person-one">In person · one dancer</option><option value="in-person-two">In person · two dancers</option><option value="virtual">Virtual Zoom coaching</option></select></label></div><div className="booking-summary"><p>Your selected time</p>{selectedSlots.length ? <><strong>{selectedSlots.length} block{selectedSlots.length === 1 ? "" : "s"} · {duration}</strong><ul>{selectedSlots.map((slot) => <li key={slot}>{slot}</li>)}</ul></> : <span>Choose one or more time blocks above.</span>}<button type="button" className="button" disabled={!selectedSlots.length}>Continue to booking <span>→</span></button><small>Your selected time will be locked after secure payment is connected.</small></div></section></>;
}
