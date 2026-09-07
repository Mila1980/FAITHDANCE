import Link from "next/link";
import { ReviewForm } from "@/components/review-form";

export default function ReviewPage() {
  return (
    <main className="review-page">
      <nav className="booking-nav" aria-label="Faith.In.Dance navigation">
        <Link href="/" className="booking-wordmark">FAITH<br /><span>IN DANCE</span></Link>
        <Link href="/" className="back-home">← Back to home</Link>
      </nav>
      <section className="review-hero">
        <p className="eyebrow">A note for Faith</p>
        <h1>Thank you for<br /><em>dancing with Faith.</em></h1>
        <p>Your words help other families feel confident taking the next step. Share as much or as little as you would like.</p>
      </section>
      <section className="review-section">
        <div><p className="eyebrow">Share your experience</p><h2>What did this time mean to your dancer?</h2><p>Faith reads every note. If you give permission, she may share your words on this website to help other families learn about her coaching.</p></div>
        <ReviewForm />
      </section>
    </main>
  );
}
