"use client";

import { FormEvent, useState } from "react";

export function InquiryForm() {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; setSending(true); setStatus("");
    const values = new FormData(form);
    const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: values.get("name"), email: values.get("email"), focus: values.get("focus"), message: values.get("message") }) });
    if (response.ok) { form.reset(); setStatus("Thank you — Faith received your message and will be in touch."); } else setStatus("We could not send that message. Please try again.");
    setSending(false);
  }
  return <form className="inquiry-form" onSubmit={submit}><label>Parent / dancer name<input name="name" required placeholder="Your name" /></label><label>Email<input name="email" type="email" required placeholder="you@example.com" /></label><label>What would you like help with?<select name="focus" required defaultValue=""><option value="" disabled>Select a coaching focus</option><option>Private Zoom lesson</option><option>In-person lesson</option><option>Tricks & technique</option><option>Performance prep</option><option>Audition or team placement</option><option>Confidence and encouragement</option><option>Something else</option></select></label><label>Tell Faith a little more<textarea name="message" rows={4} placeholder="Optional" /></label><button type="submit" className="button" disabled={sending}>{sending ? "Sending…" : "Send message"} <span>→</span></button>{status && <small>{status}</small>}</form>;
}
