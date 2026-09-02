import Link from "next/link";
import { BookingSlotPicker } from "@/components/booking-slot-picker";

export default function BookPage() {
  return (
    <main className="booking-page">
      <nav className="booking-nav" aria-label="Faith.In.Dance navigation">
        <Link href="/" className="booking-wordmark">
          FAITH<br />
          <span>IN DANCE</span>
        </Link>
        <Link href="/" className="back-home">
          ← Back to home
        </Link>
      </nav>

      <section className="booking-hero">
        <p className="eyebrow">September Zoom coaching</p>
        <h1>
          Make time
          <br />
          <em>to grow.</em>
        </h1>
        <p>
          Faith is opening focused private Zoom sessions for dancers who want help
          with a skill, technique, routine, audition, or the confidence to take
          their next step.
        </p>
        <div className="booking-dates" aria-label="Available coaching dates">
          <div>
            <span>Thursday</span>
            <strong>September 3</strong>
            <small>5 PM–9 PM</small>
          </div>
          <div>
            <span>Sunday</span>
            <strong>September 6</strong>
            <small>2 PM–8 PM</small>
          </div>
          <div>
            <span>Monday</span>
            <strong>September 7</strong>
            <small>10 AM–1 PM</small>
          </div>
        </div>
        <div className="booking-fit">
          <span>Zoom coaching only</span>
          <span>30 or 60 minutes</span>
          <span>One or two dancers</span>
        </div>
      </section>

      <section className="session-pricing" aria-label="Private lesson prices">
        <div className="section-heading">
          <p className="eyebrow">Private Zoom lessons</p>
          <h2>Choose your session.</h2>
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

      <BookingSlotPicker />

      <footer className="booking-footer">
        <p>Faith.In.Dance. · Private coaching with purpose.</p>
        <Link href="/">Return to home</Link>
      </footer>
    </main>
  );
}
