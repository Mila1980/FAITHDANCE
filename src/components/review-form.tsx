"use client";

import { FormEvent, useState } from "react";

export function ReviewForm() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setSending(true);
    setStatus("");

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        dancerName: form.get("dancerName"),
        review: form.get("review"),
        permission: form.get("permission") === "yes",
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      formElement.reset();
      setStatus("Thank you — Faith received your review.");
    } else {
      setStatus(data.error ?? "Your review could not be sent. Please try again.");
    }
    setSending(false);
  }

  return (
    <form className="review-form" onSubmit={submit}>
      <label>Your name<input name="name" required placeholder="Your name" /></label>
      <label>Email<input name="email" type="email" required placeholder="you@example.com" /></label>
      <label>Dancer&apos;s name <span>(optional)</span><input name="dancerName" placeholder="Optional" /></label>
      <label>
        Share your experience
        <textarea name="review" rows={6} required placeholder="What did your dancer enjoy or gain from working with Faith?" />
      </label>
      <label className="review-permission">
        <input name="permission" type="checkbox" value="yes" />
        <span>Faith may share this review on the Faith in Dance website.</span>
      </label>
      <button type="submit" className="button" disabled={sending}>
        {sending ? "Sending…" : "Send my review"} <span>→</span>
      </button>
      {status && <small>{status}</small>}
    </form>
  );
}
