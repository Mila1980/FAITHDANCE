import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Dance Lessons Coming Soon",
  description: "In-person and Zoom lessons are coming soon! Booking dates will be announced here as availability opens.",
  alternates: { canonical: "/book" },
  openGraph: { url: "/book", title: "Book Private Online Dance Lessons", description: "In-person and Zoom lessons are coming soon! Booking dates will be announced here as availability opens." },
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
        <h1>In-person and Zoom lessons<br /><em>are coming soon!</em></h1>
        <p>Booking dates will be announced here as availability opens.</p>
        <div className="booking-fit">
          <span>In-person and Zoom lessons</span>
          <span>30 or 60 minutes</span>
          <span>One or two dancers</span>
        </div>
      </section>

      <section className="session-pricing" aria-label="Private lesson prices">
        <div className="section-heading">
          <p className="eyebrow">Private Zoom lessons</p>
          <h2>Zoom lesson pricing.</h2>
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
