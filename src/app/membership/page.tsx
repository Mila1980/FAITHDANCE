import Link from "next/link";

const lessonTracks = [
  ["Technique Foundations", "Build cleaner movement, stronger basics, and a training rhythm that makes sense.", "6 lessons"],
  ["Tricks & Skills", "Break down progressions, smart drills, and the confidence to keep showing up.", "8 lessons"],
  ["Performance Prep", "Use practice plans, mindset tools, and polished details before the big moment.", "5 lessons"],
  ["Stretch & Strength", "Support your movement with dancer-focused flexibility and strength sessions.", "7 lessons"],
];

export default function MembershipPage() {
  return <main className="member-page">
    <nav className="member-nav"><Link className="brand" href="/">faith<span>.</span></Link><div><Link href="/">Home</Link><a href="#lesson-menu">Lesson menu</a><a href="#join">Join</a></div><Link className="nav-button" href="#join">Become a member</Link></nav>
    <section className="member-hero"><div><p className="eyebrow">Faith Dance Membership</p><h1>Train with<br /><em>purpose.</em></h1><p className="member-intro">A supportive online space for dancers who want more structure, stronger skills, and a coach in their corner between lessons.</p><a className="button" href="#join">See what&apos;s inside <span>→</span></a></div><div className="member-hero-card"><p>Member studio</p><strong>your next<br />stronger step</strong><span>Technique · confidence · performance</span></div></section>
    <section className="member-benefits"><p className="eyebrow">More than a lesson library</p><div><h2>What members<br /><em>get to come back to.</em></h2><ul><li><b>New guided lessons</b><span>Clear video-based training built around the skills dancers ask for most.</span></li><li><b>Practice plans</b><span>Simple weekly structure so progress does not depend on guessing what to do next.</span></li><li><b>Performance support</b><span>Practical preparation for auditions, competitions, teams, and confidence under pressure.</span></li></ul></div></section>
    <section className="lesson-menu" id="lesson-menu"><p className="eyebrow">Lesson menu</p><h2>Choose your<br /><em>next focus.</em></h2><p className="menu-intro">Each track gives dancers a clear place to begin. Final lesson videos and member progress will be connected once Faith&apos;s program is ready to launch.</p><div className="track-grid">{lessonTracks.map(([title, copy, count], index) => <article key={title}><span>0{index + 1}</span><p>{count}</p><h3>{title}</h3><div>{copy}</div><button type="button">View track <b>→</b></button></article>)}</div></section>
    <section className="member-coach"><div className="coach-photo"><span>Faith&apos;s membership photo</span></div><div><p className="eyebrow">Coaching that continues</p><h2>Less pressure.<br /><em>More progress.</em></h2><p>The membership is not about doing everything at once. It is about knowing what to practice, returning to the basics when needed, and building confidence one count at a time.</p></div></section>
    <section className="member-join" id="join"><p className="eyebrow">Join the list</p><h2>Be first when<br /><em>the studio opens.</em></h2><p>Membership access, pricing, and the first lesson tracks are being finalized.</p><a className="button" href="mailto:hello@faithdance.com?subject=Faith%20Dance%20Membership">I&apos;m interested <span>→</span></a><small>This will be connected to Faith&apos;s real email before launch.</small></section>
    <footer><Link className="brand" href="/">faith<span>.</span></Link><span>Dance with confidence.</span><span>© 2026 Faith Dance</span></footer>
  </main>;
}
