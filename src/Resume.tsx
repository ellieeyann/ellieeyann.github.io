/**
 * Resume.tsx — single-column, print-first resume route.
 *
 * Drop at src/pages/Resume.tsx and add a route for /resume.
 * Print with Cmd/Ctrl+P → Save as PDF → Margins: Default → Background graphics: OFF.
 *
 * Fonts: licensed TWK Lausanne .woff2 files go in /public/fonts/.
 *
 * Set at 9.0pt / 1.38 with 0.5in margins — fills ~95.5% of a Letter page.
 * Verified by headless Chromium render with the real typeface; the resulting
 * PDF extracts cleanly in pdfplumber, pypdf, and both pdftotext modes.
 *
 * Font note: convert the .otf files to .woff2 by changing the container flavor
 * only (fontTools: font.flavor = "woff2"). Do NOT convert the PostScript
 * outlines to TrueType — a cu2qu conversion was tested and made poppler's text
 * extraction dramatically worse (3/20 keywords vs 20/20).
 *
 * Deliberately NO letter-spacing anywhere. Chrome's print engine writes
 * per-glyph positioning for tracked text, which is what made the Figma export
 * unreadable to pypdf. Hierarchy comes from size, weight, and space instead.
 */

import { useEffect } from "react";

export default function Resume() {
  useEffect(() => {
    document.documentElement.classList.add("rz-active");
    return () => document.documentElement.classList.remove("rz-active");
  }, []);

  const handlePrint = async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    window.print();
  };

  return (
    <>
      <style>{css}</style>

      <button className="rz-print-btn rz-noprint" onClick={handlePrint}>
        Download PDF
      </button>

      <main className="rz">
        <header className="rz-header">
          <h1 className="rz-name">Ellie Jun Yan</h1>
          <p className="rz-contact">
            <a href="mailto:ellieyann0413@gmail.com">ellieyann0413@gmail.com</a>
            <Sep />
            <a href="https://ellieeyann.github.io">ellieeyann.github.io</a>
            <Sep />
            <a href="https://linkedin.com/in/ellieeyann">linkedin.com/in/ellieeyann</a>
          </p>
        </header>

        <Section label="Design Experience">
          <Role
            org="Target"
            role="Product Designer"
            meta="Jun 2024 – Present · Minneapolis, MN"
            bullets={[
              "Spearheaded end-to-end web and mobile design and product launch for Digital Task Assignments, a 0→1 system bringing structured task management to 400k+ employees across 2,000 Target stores",
              "Accelerated iteration and interactive prototyping with AI, reducing discovery-to-delivery cycles from weeks to days",
              "Led generative and evaluative research with 50+ users across 10+ nationwide stores that drove roadmap and rollout decisions",
              "Rallied 10+ teams across engineering, product, and business around a shared long-term vision, establishing design as a trusted strategic leader",
              "Shipped customizable avatars for inclusivity and delight, modernized the label and signage printing tool, and designed a creator-economy concept to expand Target's reach with younger shoppers",
            ]}
          />
          <Role
            org="Google"
            role="Product Design Extern"
            meta="Jan 2024 – Mar 2024 · New York, NY"
            bullets={[
              "Drove design and product direction for Culture Walk, a Google Maps concept surfacing neighborhood cultural history along walking routes",
              "Developed high-fidelity prototypes for 3 interconnected flows: route discovery, AR wayfinding, and community-contributed archives",
              "Grounded design exploration in 4 ethnographic interviews, 49 survey responses, and competitive analysis of geolocative discovery products",
              "Presented final concept and product rationale to design leadership",
            ]}
          />
          <Role
            org="Cornell Tech"
            role="HRI Research Intern"
            meta="May 2023 – Mar 2024 · New York, NY"
            bullets={[
              "Designed data labeling, analysis, and experiments for 1000+ in-the-wild interactions between humans and garbage collection robots to identify behavioral patterns and socialization",
              "Built digital twins of 3 NYC locales to observe driver-pedestrian interactions in a controlled VR environment, informing the design of safe and culturally-aware autonomous vehicles",
              "Research presented at CHI 2024, Columbia Undergraduate CS and Data Science Fair, and Barnard Summer Research Institute",
            ]}
          />
        </Section>

        <Section label="Skills">
          <p className="rz-skills">
            Interaction design · Rapid prototyping · User research · Design systems ·
            Storytelling · Product management · Figma · Claude Code
          </p>
        </Section>

        <Section label="Recognition">
          <Item
            name="AmazonNext Design Challenge"
            meta="Dec 2024 – Feb 2025"
            description="1st place of 500 submissions"
          />
          <Item
            name="Upsilon Pi Epsilon"
            meta="2022 – 2024"
            description="Computer Science Honors"
          />
        </Section>

        <Section label="Community">
          <Item
            name="Guggenheim Museum × Barnard"
            meta="Sep 2024"
            description={"Led 60-person workshop and critique of Jenny Holzer's \u201CThe Light Line\u201D"}
          />
          <Item
            name="Vagelos Computing Fellow"
            meta="Aug 2023 – Dec 2024"
            description="Peer academic leader supporting computational thinking, web development, and data privacy"
          />
          <Item
            name="Women in Computer Science"
            meta="Nov 2022 – Dec 2024"
            description="Secured $44k in sponsorship funding for Columbia's annual diversity hackathon"
          />
        </Section>

        <Section label="Education">
          <Degree
            school="Barnard College, Columbia University"
            dates="Aug 2021 – Dec 2024"
            degree="B.A. Computer Science, Minor Psychology"
            gpa="GPA 3.9/4.0"
          />
        </Section>
      </main>
    </>
  );
}

/* ---------- pieces ---------- */

const Sep = () => (
  <span className="rz-sep" aria-hidden="true">
    ·
  </span>
);

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="rz-section">
      <h2 className="rz-label">{label}</h2>
      {children}
    </section>
  );
}

/** Multi-bullet role: header row + bullet list. */
function Role({
  org,
  role,
  meta,
  bullets,
}: {
  org: string;
  role: string;
  meta: string;
  bullets: string[];
}) {
  return (
    <div className="rz-block">
      <div className="rz-row">
        <h3 className="rz-name-line">
          {org}
          <span className="rz-em"> — </span>
          <span className="rz-role-inline">{role}</span>
        </h3>
        <span className="rz-meta">{meta}</span>
      </div>
      <ul className="rz-bullets">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Recognition / Community entry. The description is a single-item .rz-bullets
 * list — the same element and class as a Design Experience bullet, so weight,
 * leading, indent, and measure match by construction rather than by duplicated
 * values. The disc marker is suppressed via .rz-block--tight, since these are
 * one-liners rather than lists.
 */
function Item({
  name,
  meta,
  description,
}: {
  name: string;
  meta: string;
  description: string;
}) {
  return (
    <div className="rz-block rz-block--tight">
      <div className="rz-row">
        <h3 className="rz-name-line">{name}</h3>
        <span className="rz-meta">{meta}</span>
      </div>
      <ul className="rz-bullets">
        <li>{description}</li>
      </ul>
    </div>
  );
}

/**
 * Education. Two flex rows rather than a bullet, because the second line needs
 * its own right-aligned value (GPA) — a bulleted row can't carry one.
 */
function Degree({
  school,
  dates,
  degree,
  gpa,
}: {
  school: string;
  dates: string;
  degree: string;
  gpa: string;
}) {
  return (
    <div className="rz-block rz-block--tight">
      <div className="rz-row">
        <h3 className="rz-name-line">{school}</h3>
        <span className="rz-meta">{dates}</span>
      </div>
      <div className="rz-row rz-row--second">
        <p className="rz-secondary">{degree}</p>
        <span className="rz-meta">{gpa}</span>
      </div>
    </div>
  );
}

/* ---------- styles ---------- */

const css = `
/* TWK Lausanne — licensed .woff2 files in /public/fonts/.
   Rename to match your download; Weltkern's numeric weights vary by package. */
@font-face {
  font-family: 'TWK Lausanne';
  src: url('/fonts/TWKLausanne-400.woff2') format('woff2');
  font-weight: 400; font-style: normal; font-display: block;
}
@font-face {
  font-family: 'TWK Lausanne';
  src: url('/fonts/TWKLausanne-500.woff2') format('woff2');
  font-weight: 500; font-style: normal; font-display: block;
}
@font-face {
  font-family: 'TWK Lausanne';
  src: url('/fonts/TWKLausanne-600.woff2') format('woff2');
  font-weight: 600; font-style: normal; font-display: block;
}
/* Variable cut instead? Delete the three above and use:
@font-face {
  font-family: 'TWK Lausanne';
  src: url('/fonts/TWKLausanne-Variable.woff2') format('woff2-variations');
  font-weight: 100 950; font-style: normal; font-display: block;
} */

.rz {
  /* --- the only two knobs that affect pagination --- */
  --rz-fs: 15px;               /* screen */
  --rz-lead: 1.52;

  --rz-ink: #17171a;
  --rz-mid: #55555c;
  --rz-soft: #7d7d85;
  --rz-hair: #e2e2df;

  font-family: 'TWK Lausanne', 'Helvetica Neue', Inter, system-ui, sans-serif;
  font-size: var(--rz-fs);
  line-height: var(--rz-lead);
  font-weight: 400;
  letter-spacing: 0;           /* never track this document — see file header */
  color: var(--rz-ink);
  font-variant-numeric: tabular-nums;
  -webkit-font-smoothing: antialiased;
  max-width: 44rem;
  margin: 0 auto;
  padding: 5rem 1.75rem 7rem;
}

.rz h1, .rz h2, .rz h3, .rz p, .rz ul { margin: 0; }
.rz a { color: inherit; text-decoration: none; border-bottom: 1px solid var(--rz-hair); }
.rz a:hover { border-bottom-color: var(--rz-ink); }
.rz a:focus-visible { outline: 2px solid var(--rz-ink); outline-offset: 2px; }

/* header */
.rz-header { padding-bottom: 0.5em; text-align: center; }
.rz-name { font-size: 1.75em; font-weight: 600; line-height: 1.15; }
.rz-contact { font-size: 1em; color: var(--rz-ink); margin-top: 0.85em; line-height: 1.7; }
.rz-sep { color: var(--rz-soft); padding: 0 0.45em; }

/* section headers — black, larger, no rule */
.rz-section { margin-top: 1.62em; }
.rz-label {
  font-size: 1.2em;
  font-weight: 600;
  color: var(--rz-ink);
  margin-bottom: 0.6em;
  word-spacing: 0.04em;         /* see note by .rz-name-line */
}

/* every entry, in every section, is a .rz-block */
.rz-block { margin-bottom: 0.95em; break-inside: avoid; }
.rz-block--tight { margin-bottom: 0.5em; }
.rz-block:last-child { margin-bottom: 0; }

/* name line + right-aligned value */
.rz-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1.5em;
}
.rz-row--second { margin-top: 0.06em; }
/* The 0.04em word-spacing is invisible but load-bearing: without it poppler's
   -raw mode collapses spaces in 600-weight runs ("BarnardCollege"). */
.rz-name-line { font-size: 1em; font-weight: 600; line-height: 1.35; word-spacing: 0.04em; }
.rz-role-inline { font-weight: 400; }
.rz-em { color: var(--rz-soft); font-weight: 400; }
.rz-secondary { font-size: 1em; font-weight: 400; }

/* dates, locations, GPA — same size, weight, and color as body text */
.rz-meta {
  font-size: 1em;
  font-weight: 400;
  color: var(--rz-ink);
  white-space: nowrap;
  flex-shrink: 0;
}

/* ONE bullet definition, shared by Design Experience, Recognition, Community.
   Changing anything here changes all three together — that's the point. */
.rz-bullets { list-style: disc; padding-left: 1.05em; margin-top: 0.42em; }
.rz-bullets li { margin-bottom: 0.3em; padding-left: 0.1em; }
.rz-bullets li:last-child { margin-bottom: 0; }
.rz-bullets li::marker { color: var(--rz-ink); font-size: 0.85em; }

/* Recognition / Community are single-line descriptions — no marker, no indent,
   flush left with the entry name above. */
.rz-block--tight .rz-bullets { list-style: none; padding-left: 0; }

.rz-skills { font-size: 1em; }

/* screen-only button */
.rz-print-btn {
  position: fixed;
  top: 1.5rem; right: 1.5rem;
  z-index: 50;
  font-family: 'TWK Lausanne', 'Helvetica Neue', Inter, system-ui, sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  color: #17171a;
  background: #fff;
  border: 1px solid #d8d8d4;
  border-radius: 2px;
  padding: 0.5rem 0.9rem;
  cursor: pointer;
}
.rz-print-btn:hover { border-color: #17171a; }

/* hide site chrome while the resume route is mounted */
@media print {
  .rz-active nav,
  .rz-active header:not(.rz-header),
  .rz-active footer,
  .rz-noprint { display: none !important; }
}

@media print {
  @page { size: letter; margin: 0.5in; }

  html, body { background: #fff !important; margin: 0; padding: 0; }

  /* Measured with real TWK Lausanne at 0.5in margins:
       9.4pt / 1.42 → 107.5%  (two pages)
       9.2pt / 1.40 →  99.1%
       9.0pt / 1.38 →  95.5%  ← current
       8.9pt / 1.37 →  93.8%
     Lausanne runs wider than the Helvetica-metric fallback, so anything
     rendered without the real font will mislead you. Re-measure after edits. */
  .rz {
    --rz-fs: 9.0pt;
    --rz-lead: 1.38;
    max-width: none;
    margin: 0;
    padding: 0;
    color: #000;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .rz a { border-bottom: none; }
}

@media (max-width: 640px) {
  .rz { padding: 3.5rem 1.25rem 5rem; }
  .rz-row { flex-direction: column; gap: 0.15em; }
  .rz-row--second { margin-top: 0.3em; }
  .rz-meta { white-space: normal; }
}

@media (prefers-reduced-motion: reduce) {
  .rz *, .rz-print-btn { transition: none !important; animation: none !important; }
}
`;
