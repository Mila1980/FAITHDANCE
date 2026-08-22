import Image from "next/image";
import Link from "next/link";
import { PrayerPrintButton } from "@/components/prayer-print-button";

const prayers = [
  ["Prayer for all dancers", "prayer-for-all-dancers.png"], ["All things through Christ", "prayer-for-strength.png"], ["Prayer for anxiety", "prayer-for-anxiety.png"], ["Prayer before taking the stage", "before-taking-the-stage.png"], ["You are more than dance", "graceful-strength.png"], ["Love in every deed", "love-in-every-deed.png"], ["Faith over sight", "faith-over-sight.png"], ["Let them praise through dancing", "praise-through-dancing.png"], ["Dance prayer", "dance-prayer.png"],
] as const;

export default function PrayersPage() {
  return <main className="prayers-page">
    <nav className="member-nav"><Link className="brand" href="/">Faith.In.Dance.</Link><div><Link href="/about">About</Link><Link href="/membership">Lessons + Tutorials</Link><Link href="/prayers">Prayers</Link></div><Link className="nav-button" href="/book">Book now</Link></nav>
    <section className="prayer-hero"><div className="prayer-hero-crosses"><Image src="/images/faith-crosses.jpg" alt="Faith standing before crosses" fill sizes="120px" priority /></div><p className="eyebrow">For every step</p><h1>Prayers for<br /><em>dancers.</em></h1><p>Dance is a gift, but it can also come with pressure, nerves, comparison, and hard days. This page is a place to slow down, pray, and remember who you are dancing for. Whether you are preparing to step on stage, struggling with anxiety, or simply needing strength, I hope these prayers remind you that God is with you through every step.</p></section>
    <section className="prayer-library"><div className="prayer-library-heading"><div><p className="eyebrow">Keep what you need</p><h2>Choose one.<br /><em>Print one.</em></h2></div><p>Each prayer is designed to be kept, printed, or shared with a dancer who needs encouragement.</p></div><div className="prayer-grid">{prayers.map(([title, fileName]) => <article key={fileName}><div className="prayer-card-image"><Image src={`/prayers/${fileName}`} alt={title} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 45vw, 30vw" /></div><h3>{title}</h3><PrayerPrintButton title={title} imageUrl={`/prayers/${fileName}`} /></article>)}</div></section>
    <section className="prayer-closing"><p className="eyebrow">Faith in every step</p><h2>You are more than<br /><em>one performance.</em></h2><p>Take what you need with you. God is with you in the work, the waiting, the nerves, the joy, and every step in between.</p></section>
    <footer><Link className="brand" href="/">Faith.In.Dance.</Link><span>Dance with confidence.</span><span>© 2026 Faith.In.Dance.</span></footer>
  </main>;
}
