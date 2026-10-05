import Link from "next/link";
import type { Metadata } from "next";
import { BookingSlotPicker } from "@/components/booking-slot-picker";

export const metadata: Metadata = {
  title: "Book In-Person Dance Lessons | October 2026",
  description: "Book an in-person dance lesson on October 9 or October 12, 2026. Choose an available half-hour slot.",
  alternates: { canonical: "/book" },
  openGraph: { url: "/book", title: "Book In-Person Dance Lessons", description: "Choose an available half-hour dance lesson on October 9 or October 12, 2026." },
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
        <h1>In-person dance lessons<br /><em>October 9 + 12</em></h1>
        <p>Choose a half-hour appointment. Booked times are shown and cannot be selected.</p>
        <div className="booking-dates"><div><span>Friday, October 9</span><strong>11:30 AM&ndash;3:00 PM</strong></div><div><span>Monday, October 12</span><strong>8:00 AM&ndash;12:00 PM</strong></div></div>
        <div className="booking-fit">
          <span>In-person lessons</span>
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
