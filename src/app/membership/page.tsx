import Link from "next/link";

const tutorialPreviews = [
  ["01", "Foundation", "Cartwheel.", "Build a confident, clean cartwheel from the ground up."],
  ["02", "Technique", "Leaps.", "Create more height, extension, and ease through every leap."],
  ["03", "Control", "Turns.", "Find your center and make every turn feel more secure."],
];

export default function MembershipPage() {
  return <main className="membership-tutorial-page">
    <nav className="member-nav"><Link className="brand" href="/">Faith.In.Dance.</Link><div><Link href="/about">About</Link><Link href="/membership">Lessons + Tutorials</Link><Link href="/prayers">Prayers</Link><Link href="/book">Book</Link></div><Link className="nav-button" href="/book">Book now</Link></nav>

    <section className="tutorial-hero"><p className="eyebrow">Practice with purpose</p><h1>Foundational skill<br /><em>tutorials.</em></h1><p>Simple, supportive breakdowns to help dancers feel more prepared for their next Zoom lesson and more confident when they practice at home.</p></section>

    <section className="membership-access"><div className="access-intro"><p className="eyebrow">Choose your access</p><h2>A little<br />support, or <em>so<br />much more.</em></h2></div><div className="access-card"><div className="access-tabs"><span>Free video guide</span><strong>Member coaching</strong></div><div className="access-card-body"><div><p className="eyebrow">Membership coming soon</p><h3>More coaching,<br />right at <em>home.</em></h3><p>A supportive online membership for dancers who want personalized guidance between their private Zoom lessons.</p><Link href="#join" className="text-link">Get early access <span>→</span></Link></div><div className="access-highlight"><p>Faith.In.Dance. membership</p><strong>Everything<br />included.</strong><ul><li>First access to foundational video lessons</li><li>New skill breakdowns as they are released</li><li>Practice prompts for between Zoom sessions</li><li>Member-only coaching updates</li></ul><Link className="button" href="#join">Join the list <span>→</span></Link></div></div></div></section>

    <section className="tutorial-list" aria-label="Tutorial preview curriculum">{tutorialPreviews.map(([number, category, title, copy], index) => <article className={index % 2 ? "tutorial-row is-reversed" : "tutorial-row"} key={title}><div className="tutorial-video"><span>Lesson preview</span><b>▶</b></div><div className="tutorial-copy"><p className="eyebrow">{number} · {category}</p><h2>{title}</h2><p>{copy}</p><span className="tutorial-status">Lesson coming soon <b>→</b></span></div></article>)}</section>

    <section className="tutorial-cta" id="join"><div><p className="eyebrow">Make it yours</p><h2>What would you<br /><em>love to work<br />on?</em></h2><p>Choose what you need most. Faith will use the early-interest list to shape the first tutorials and Zoom coaching support.</p></div><div className="interest-card"><p>Your lesson <span>0 selected</span></p><button type="button">Learn this skill <b>+</b></button><button type="button">Clean this skill <b>+</b></button><button type="button">Build more skills <b>+</b></button><a className="button" href="mailto:hello@faithdance.com?subject=Faith.In.Dance.%20Membership">Join the early list <span>→</span></a></div></section>
    <footer><Link className="brand" href="/">Faith.In.Dance.</Link><span>Dance with confidence.</span><span>© 2026 Faith.In.Dance.</span></footer>
  </main>;
}
