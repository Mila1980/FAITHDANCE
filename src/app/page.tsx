import Link from "next/link";
import Image from "next/image";
import { InquiryForm } from "@/components/inquiry-form";

const services = [
  ["01", "Private Zoom lessons", "One-on-one Zoom coaching for dancers who want focused support, confident basics, and a clear next step."],
  ["02", "Tricks & technique", "Targeted coaching to build stronger foundations, sharper skills, and cleaner execution."],
  ["03", "Performance prep", "Prepare for auditions, competitions, team placement, or the moment you want to walk in ready."],
];

export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <nav className="nav" aria-label="Main navigation">
          <a className="brand" href="#top">Faith.In.Dance.</a>
          <div className="nav-links">
            <Link href="/about">About</Link><Link href="/membership">Lessons + Tutorials</Link><Link href="/prayers">Prayers</Link><Link href="/book">Book</Link>
          </div>
          <Link className="nav-button" href="/book">Book now</Link>
        </nav>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Private Zoom dance coaching</p>
            <h1>Putting meaning in <em>motion.</em></h1>
            <p className="intro">Thoughtful, one-on-one Zoom coaching that helps every dancer feel capable, grounded, and confident—wherever they are.</p>
            <div className="actions"><Link className="button" href="/book">Book a Zoom lesson <span>→</span></Link><Link className="text-link" href="/membership">Explore membership</Link></div>
          </div>
          <div className="hero-photo-stack" aria-label="Faith's dance journey">
            <div className="hero-photo hero-photo-baby"><Image src="/images/faith-baby.jpeg" alt="Faith as a young dancer" fill sizes="(max-width: 720px) 38vw, 220px" priority /></div>
            <div className="hero-photo hero-photo-pose"><Image src="/images/faith-dance-pose.jpeg" alt="Faith performing a dance pose on stage" fill sizes="(max-width: 720px) 68vw, 410px" priority /></div>
            <div className="hero-photo hero-photo-cheer"><Image src="/images/faith-cheerleading.jpg" alt="Faith cheering professionally" fill sizes="(max-width: 720px) 35vw, 210px" priority /></div>
            <div className="hero-photo hero-photo-gcu"><Image src="/images/faith-gcu.jpg" alt="Faith dancing for Grand Canyon University" fill sizes="(max-width: 720px) 40vw, 230px" priority /></div>
          </div>
        </div>
      </section>

      <section className="home-booking-banner" aria-label="September Zoom lesson announcement">
        <div>
          <p className="eyebrow">Private Zoom lessons</p>
          <h2>Dance with Faith<br /><em>September 3, 6 &amp; 7.</em></h2>
          <p>Book a private Zoom lesson and receive your Zoom link by email after payment.</p>
        </div>
        <Link className="button" href="/book">Book now <span>→</span></Link>
      </section>

      <section className="about section" id="about">
        <p className="eyebrow">Meet Faith</p>
        <div className="about-grid">
          <div className="about-photo"><Image src="/images/faith-about.jpg" alt="Faith smiling outdoors" fill sizes="(max-width: 720px) 100vw, 42vw" /></div>
          <div className="about-copy"><h2>Technique with <em>heart</em>, and room to <em>be yourself.</em></h2><p>Faith is more than an accomplished dancer—she&apos;s a passionate coach who believes in <strong>working hard, dreaming big, and helping young dancers discover just how capable they are.</strong></p><p>A former <strong>Division I dancer, UDA National Jazz Champion, and professional NBA dancer</strong>, Faith pairs elite-level dance experience with her education in <strong>Elementary and Special Education</strong>, giving her a unique ability to connect with young dancers and understand that every child learns differently.</p><p>With her Christian faith at the foundation of who she is, Faith&apos;s coaching goes beyond great technique. She&apos;s passionate about building <strong>strong, confident, and resilient dancers—mind, body, and soul—both onstage and beyond it.</strong></p><Link className="button about-button" href="/about">Meet Faith <span>→</span></Link></div>
        </div>
      </section>

      <section className="dance-focus section">
        <p className="eyebrow">A foundation in dance</p>
        <div className="focus-list"><span><strong>Professional NBA Dancer</strong><small>Minnesota Timberwolves</small></span><span><strong>D1 DANCER</strong><small>Grand Canyon University</small></span><span><strong>UDA National Jazz Champion</strong><small>National championship dance team</small></span><span><strong>Competitive Dancer</strong><small>Laura Cote School of Dance</small></span></div>
      </section>

      <section className="lessons section" id="lessons">
        <p className="eyebrow">Ways to train</p><h2>Small steps.<br /><em>Lasting confidence.</em></h2>
        <div className="service-grid">{services.map(([number, title, copy]) => <article className="service-card" key={number}><p>{number}</p><h3>{title}</h3><span>{copy}</span><a href="#contact">View details <b>→</b></a></article>)}</div>
        <aside className="home-membership-card">
          <div className="home-membership-copy"><p className="eyebrow">Membership coming soon</p><h3>More coaching,<br />right at <em>home.</em></h3><p>A supportive online membership for dancers who want personalized guidance between their private Zoom lessons.</p><Link href="/membership" className="text-link">Explore lessons + tutorials <span>→</span></Link></div>
          <div className="home-membership-includes"><p>Faith.In.Dance. membership</p><strong>Everything<br />included.</strong><ul><li>First access to foundational video lessons</li><li>New skill breakdowns as they are released</li><li>Practice prompts for between Zoom sessions</li><li>Member-only coaching updates</li></ul><Link className="button" href="/membership">Coming soon <span>→</span></Link></div>
          <Link className="button" href="/membership">Explore lessons + tutorials <span>→</span></Link>
        </aside>
      </section>

      <section className="contact section" id="contact">
        <div className="contact-clarifier"><p className="eyebrow">Have questions?</p><h2>Reach out.<br /><em>Let&apos;s talk.</em></h2><p>Not sure what kind of coaching would best support your dancer? Send Faith a note and she&apos;ll help you figure out the right next step.</p></div>
        <div><p className="eyebrow">Let&apos;s dance</p><h2>Ready to take<br />the <em>next step?</em></h2><p>Tell Faith a little about your dancer and the support you&apos;re looking for. She&apos;ll be in touch with next steps.</p></div>
        <InquiryForm />
      </section>
      <footer><a className="brand" href="#top">Faith.In.Dance.</a><span>Dance with confidence.</span><span>© 2026 Faith.In.Dance.</span></footer>
    </main>
  );
}
