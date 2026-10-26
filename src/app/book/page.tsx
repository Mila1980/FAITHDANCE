import Link from "next/link";
import type { Metadata } from "next";
import { BookingSlotPicker } from "@/components/booking-slot-picker";

export const metadata: Metadata = {
  title: "Book Zoom Dance Lessons | October 2026",
  description: "Book a private Zoom dance lesson on October 30–November 1, 2026. Choose an available half-hour start time.",
  alternates: { canonical: "/book" },
  openGraph: { url: "/book", title: "Book Zoom Dance Lessons", description: "Choose an available half-hour start time for a private Zoom dance lesson on October 30–November 1, 2026." },
};

export default function BookPage() {
  return (
    <main className="booking-page">
      <nav className="member-nav booking-nav" aria-label="Faith.In.Dance navigation">
        <Link href="/" className="brand">Faith.In.Dance.</Link>
        <Link href="/" className="nav-button">Back to home</Link>
      </nav>

      <section className="booking-hero">
        <p className="eyebrow">Private dance lessons</p>
        <h1>Private Zoom lessons<br /><em>October 30–November 1</em></h1>
        <p>Choose a 30- or 60-minute Zoom lesson. Start times are available in half-hour increments; unavailable times cannot be selected.</p>
        <div className="booking-dates">
          <div><span>Friday, October 30</span><strong>4:00–5:30 PM</strong><small>Zoom lessons</small></div>
          <div><span>Saturday, October 31</span><strong>11:00 AM–5:00 PM</strong><small>Zoom lessons</small></div>
          <div><span>Sunday, November 1</span><strong>3:00–7:00 PM</strong><small>Zoom lessons</small></div>
        </div>
        <div className="booking-fit">
          <span>Zoom lessons</span>
          <span>30 or 60 minutes</span>
          <span>One or two dancers</span>
        </div>
      </section>

      <BookingSlotPicker />

      <section className="session-pricing" aria-label="Private lesson prices">
        <div className="section-heading">
          <p className="eyebrow">Private lessons</p>
          <h2>Lesson pricing.</h2>
        </div>
        <div className="price-grid">
          <article>
            <p className="price-label">One dancer</p>
            <p className="price">$25 <span>/ 30 min</span></p>
            <p className="price">$50 <span>/ 60 min</span></p>
          </article>
          <article>
            <p className="price-label">Two dancers</p>
            <p className="price">$30 <span>/ 30 min</span></p>
            <p className="price">$60 <span>/ 60 min</span></p>
          </article>
        </div>
      </section>

      <section className="booking-review">
        <p className="eyebrow">Kind words from a Faith.In.Dance. family</p>
        <blockquote>“Faith had my daughter working hard, having fun, and excited for the next lesson. She is positive, uplifting, and knows exactly when to encourage and when to push.”</blockquote>
        <p>— Parent of a Faith.In.Dance. dancer</p>
      </section>

      <section className="booking-review">
        <p>Have a question about future lessons?</p>
        <Link className="button" href="/#contact">Contact Faith <span>→</span></Link>
      </section>

      <footer className="booking-footer">
        <p>Faith.In.Dance. · Private coaching with purpose.</p>
        <Link href="/">Return to home</Link>
      </footer>
    </main>
  );
}
