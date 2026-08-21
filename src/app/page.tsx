import Link from "next/link";
import Image from "next/image";

const services = [
  ["01", "Private lessons", "One-on-one coaching for dancers who want focused support, confident basics, and a clear next step."],
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
            <a href="#about">About</a><a href="#lessons">Lessons</a><a href="#gallery">Gallery</a><Link href="/membership">Membership</Link>
          </div>
          <a className="nav-button" href="#contact">Inquire</a>
        </nav>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Private dance coaching</p>
            <h1>Find your <em>freedom</em> in motion.</h1>
            <p className="intro">Thoughtful, one-on-one dance coaching that helps every dancer feel capable, grounded, and confident.</p>
            <div className="actions"><a className="button" href="#contact">Book a lesson <span>→</span></a><Link className="text-link" href="/membership">Explore membership</Link></div>
          </div>
          <div className="hero-photo-stack" aria-label="Faith's dance journey">
            <div className="hero-photo hero-photo-baby"><Image src="/images/faith-baby.jpeg" alt="Faith as a young dancer" fill sizes="(max-width: 720px) 38vw, 220px" priority /></div>
            <div className="hero-photo hero-photo-pose"><Image src="/images/faith-dance-pose.jpeg" alt="Faith performing a dance pose on stage" fill sizes="(max-width: 720px) 68vw, 410px" priority /></div>
            <div className="hero-photo hero-photo-cheer"><Image src="/images/faith-cheerleading.jpg" alt="Faith cheering professionally" fill sizes="(max-width: 720px) 35vw, 210px" priority /></div>
          </div>
        </div>
      </section>

      <section className="about section" id="about">
        <p className="eyebrow">Meet Faith</p>
        <div className="about-grid">
          <h2>Technique with <em>heart</em>, and room to <em>be yourself.</em></h2>
          <div><p>Faith has spent her life immersed in dance—training, performing, and helping dancers grow with confidence. Her teaching brings together technical detail, genuine encouragement, and a love for the person behind the performance.</p><p>Whether your dancer is learning their first trick, preparing for a new season, or finding confidence in their movement, Faith creates a space where they can grow.</p><a className="text-link" href="#lessons">Explore lessons <span>→</span></a></div>
        </div>
      </section>

      <section className="dance-focus section">
        <p className="eyebrow">A foundation in dance</p>
        <div className="focus-list"><span>Competitive dance studio child</span><span>Collegiate dancer<br />Grand Canyon University</span><span>National championship dance team member</span><span>Professional NFL cheerleader</span></div>
      </section>

      <section className="lessons section" id="lessons">
        <p className="eyebrow">Ways to train</p><h2>Small steps.<br /><em>Lasting confidence.</em></h2>
        <div className="service-grid">{services.map(([number, title, copy]) => <article className="service-card" key={number}><p>{number}</p><h3>{title}</h3><span>{copy}</span><a href="#contact">View details <b>→</b></a></article>)}</div>
      </section>

      <section className="gallery section" id="gallery">
        <div className="gallery-copy"><p className="eyebrow">In the studio</p><h2>Joy in<br /><em>every count.</em></h2><p>A glimpse into Faith&apos;s world: real movement, performance, and dancers finding their power.</p></div>
        <div className="gallery-grid"><div className="portrait one"><span>Studio photo</span></div><div className="portrait two"><span>Performance photo</span></div><div className="portrait three"><span>Team photo</span></div></div>
      </section>

      <section className="contact section" id="contact">
        <div><p className="eyebrow">Let&apos;s dance</p><h2>Ready to take<br />the <em>next step?</em></h2><p>Tell Faith a little about your dancer and the support you&apos;re looking for. She&apos;ll be in touch with next steps.</p></div>
        <form className="inquiry-form"><label>Parent / dancer name<input placeholder="Your name" /></label><label>Email<input type="email" placeholder="you@example.com" /></label><label>What would you like help with?<select defaultValue=""><option value="" disabled>Select a lesson focus</option><option>Private lessons</option><option>Tricks & technique</option><option>Performance prep</option></select></label><button type="button" className="button">Join the lesson list <span>→</span></button><small>A real booking form will be connected here.</small></form>
      </section>
      <footer><a className="brand" href="#top">Faith.In.Dance.</a><span>Dance with confidence.</span><span>© 2026 Faith.In.Dance.</span></footer>
    </main>
  );
}
