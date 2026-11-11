import Link from "next/link";
import type { Metadata } from "next";
import { BookingSlotPicker } from "@/components/booking-slot-picker";

export const metadata: Metadata = {
  title: "Book November Dance Lessons | Zoom & In Person",
  description: "Book November 2026 private Zoom or in-person dance lessons in 30-minute increments.",
  alternates: { canonical: "/book" },
  openGraph: { url: "/book", title: "Book November Dance Lessons", description: "Choose available half-hour start times for Zoom and in-person dance lessons." },
};

export default function BookPage() {
  return (
    <main className="booking-page">
      <nav className="member-nav booking-nav" aria-label="Faith.In.Dance navigation">
        <Link href="/" className="brand">Faith.In.Dance.</Link>
        <Link href="/" className="nav-button">Back to home</Link>
      </nav>

      <section className="booking-hero">
        <p className="eyebrow">November 2026 · Private dance lessons</p>
        <h1>Book your next<br /><em>dance lesson.</em></h1>
        <p>Choose a 30- or 60-minute Zoom or in-person lesson. Start times are available every half hour, and unavailable times cannot be selected.</p>
        <div className="booking-dates">
          <div><span>Zoom · Sunday, November 15</span><strong>9 AM–2 PM · 3–7 PM</strong><small>Online</small></div>
          <div><span>Zoom · Sunday, November 22</span><strong>1:30–2 PM · 3–7 PM</strong><small>Online</small></div>
          <div><span>In person · Wednesday, November 25</span><strong>8 AM–9 PM</strong><small>Laura Coté</small></div>
          <div><span>In person · Thursday, November 26</span><strong>8–11 AM</strong><small>Laura Coté</small></div>
          <div><span>In person · Saturday, November 28</span><strong>8–10 AM · 11 AM–3 PM</strong><small>Laura Coté</small></div>
          <div><span>In person · Sunday, November 29</span><strong>9–10 AM</strong><small>Laura Coté</small></div>
        </div>
        <div className="booking-fit">
          <span>Zoom or in person</span><span>30 or 60 minutes</span><span>One or two dancers</span>
        </div>
      </section>

      <section className="booking-review" aria-label="Worship class">
        <p className="eyebrow">Special group class · Laura Coté</p>
        <h2>Worship Class · November 29</h2>
        <p>Sunday, 8:00–9:00 AM · $10 per person</p>
        <p>Group class registration is separate from private lesson time slots.</p>
        <a className="button" href="mailto:hello@faithdance.com?subject=November%2029%20Worship%20Class%20Registration">Ask to join the worship class <span>→</span></a>
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
