"use client";

import { FormEvent, useState } from "react";

export function AvailabilityRequestForm() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setSending(true);
    setStatus("");
    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        focus: "Booking availability request",
        message: form.get("message"),
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      formElement.reset();
      setStatus("Thank you — Faith will be in touch with a time that works.");
    } else {
      setStatus(data.error ?? "Your request could not be sent. Please try again.");
    }
    setSending(false);
  }

  return (
    <section className="availability-request" aria-labelledby="availability-request-heading">
      <div>
        <p className="eyebrow">Need another time?</p>
        <h3 id="availability-request-heading">Don&apos;t see a time that works?</h3>
        <p>Tell Faith which days and times work best for your dancer. She&apos;ll get back to you with an option.</p>
      </div>
      <form onSubmit={submit}>
        <label>Name<input name="name" required placeholder="Parent / dancer name" /></label>
        <label>Email<input name="email" type="email" required placeholder="you@example.com" /></label>
        <label>Days and times that work<textarea name="message" rows={3} required placeholder="For example: Tuesdays after 5 PM or Saturday morning" /></label>
        <button type="submit" className="button" disabled={sending}>{sending ? "Sending…" : "Ask Faith about a time"} <span>→</span></button>
        {status && <small>{status}</small>}
      </form>
    </section>
  );
}
