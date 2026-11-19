import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About | AquaSonics",
  description:
    "AquaSonics is an interactive map and sound-ray simulator showing how sound travels through the ocean around Hawaii, built by team PlaceHolder.",
};

/* ------------------------------------------------------------------ */
/* Content (edit here)                                                 */
/* ------------------------------------------------------------------ */

const stats = [
  { value: "7,003", label: "ocean profiles" },
  { value: "2010+", label: "observations" },
  { value: "8", label: "depth levels, 0–2,000 m" },
  { value: "18–24°N", label: "161–154°W" },
];

const depths = [0, 50, 100, 200, 500, 1000, 1500, 2000];

const instruments = [
  {
    code: "CTD",
    name: "Conductivity, Temperature, Depth",
    body: "Instruments that measure temperature, conductivity (used to calculate salinity) and pressure through the water column.",
  },
  {
    code: "PFL",
    name: "Profiling Floats",
    body: "Autonomous floats that record temperature, salinity and pressure at different depths and locations over time.",
  },
];

const audiences = [
  {
    title: "Defense & navigation",
    body: "Sonar operators who need to know how far, and along what path, a signal will carry.",
  },
  {
    title: "Marine science",
    body: "Researchers tracking how animal calls travel. Knowing how far dolphin sounds carry can hint at where pods range and live.",
  },
  {
    title: "Fishing & diving",
    body: "Anyone who works on or under the water and uses acoustic gear, or just wants to know where the loud spots are.",
  },
];

const team = [
  {
    name: "Justin Kugiyama",
    program: "Data Science, Undergrad",
    roles: ["Map interactivity"],
  },
  {
    name: "Adrienne Kaneshiro",
    program: "Computer Science, Graduate",
    roles: ["Sound speed simulator"],
  },
  {
    name: "Tyler Unger",
    program: "Data Science, Undergrad",
    roles: ["Data processing", "Map interactivity"],
  },
  {
    name: "Nicholas Thong",
    program: "Data Science, Undergrad",
    roles: ["Website design", "Database"],
  },
];

/* ------------------------------------------------------------------ */
/* Shared class strings                                                */
/* ------------------------------------------------------------------ */

const eyebrow =
  "mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-400";
const section = "border-t border-slate-200 py-16 dark:border-slate-800";
const sectionHead = "mb-10 max-w-2xl";
const h2 = "text-3xl font-semibold tracking-tight sm:text-4xl";
const sectionLede = "mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400";
const panel =
  "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900";

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 font-sans sm:px-8">
      {/* Hero */}
      <section className="grid items-center gap-12 py-16 md:grid-cols-[1.2fr_1fr] md:py-24">
        <div className="relative pt-28 md:pt-0">

          {/* Placeholders logo centered above AquaSonics */}
          <div className="pointer-events-none absolute left-0 top-0 flex w-[320px] max-w-full justify-center md:-top-32 md:w-[370px]">
            <Image
              src="/img/TransparentPlaceholderLogo.png"
              alt="Placeholders Logo"
              width={1120}
              height={485}
              className="h-auto w-[230px] brightness-0 dark:invert"
            />
           </div>
          <Link href="/">← Home</Link>
          <p className={eyebrow}>About the project</p>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            AquaSonics
            <span className="ml-3 align-middle text-base font-normal text-slate-500 dark:text-slate-400">
              (not the toothbrush)
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            An interactive heatmap of the waters around Hawaii and a sound-ray
            simulator that shows how sound bends and bounces with terrain,
            salinity, depth, temperature and pressure, packaged into one
            easy-to-use tool.
          </p>
        </div>
        <SoundProfile />
      </section>

      {/* Stats strip */}
      <section
        className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-4 dark:border-slate-800 dark:bg-slate-800"
        aria-label="Dataset at a glance"
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col gap-1 bg-white p-6 dark:bg-slate-950"
          >
            <span className="text-2xl font-semibold tabular-nums text-cyan-700 dark:text-cyan-400">
              {s.value}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {s.label}
            </span>
          </div>
        ))}
      </section>

      {/* Story */}
      <section className={`${section} mt-16`}>
        <div className={sectionHead}>
          <p className={eyebrow}>Why we built it</p>
          <h2 className={h2}>Don&apos;t be like Nick.</h2>
        </div>
        <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Once upon a time, a guy named Nick went diving near Pearl Harbor.
            Every so often he&apos;d get hit by waves of pressure, and at some
            depths it hit harder than others. He asked his buddy Tyler, who
            told him about <em>propagation paths</em> and{" "}
            <em>convergence zones</em>: the routes sound takes underwater, and
            the places where it focuses back together. After going partially
            deaf, Nick also learned why you shouldn&apos;t dive near Pearl
            Harbor when submarines are around.
          </p>
          <p>
            So he built AquaSonics. Now he can plan dive routes through safer
            areas and steer clear of the spots where sound is most intense.
          </p>
          <p className="border-l-4 border-cyan-600 pl-4 font-medium text-slate-900 dark:border-cyan-400 dark:text-slate-100">
            Be like Tyler, who knows about sound. You might keep your hearing.
          </p>
        </div>
      </section>

      {/* Audience */}
      <section className={section}>
        <div className={sectionHead}>
          <p className={eyebrow}>Who it&apos;s for</p>
          <h2 className={h2}>Anyone who listens underwater.</h2>
          <p className={sectionLede}>
            If you use sonar or any underwater acoustic device, knowing how
            fast and how far sound travels in given conditions helps you plan
            the job.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {audiences.map((a) => (
            <article key={a.title} className={panel}>
              <h3 className="mb-2 text-lg font-semibold">{a.title}</h3>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                {a.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Data */}
      <section className={section}>
        <div className={sectionHead}>
          <p className={eyebrow}>Our data</p>
          <h2 className={h2}>Straight from NOAA.</h2>
          <p className={sectionLede}>
            Observations come from the National Centers for Environmental
            Information (NCEI), NOAA geographic regions 7115 and 7215, which
            cover the ocean surrounding Hawaii.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className={panel}>
            <h3 className="mb-4 text-lg font-semibold">How we prepared it</h3>
            <dl className="divide-y divide-slate-200 dark:divide-slate-800">
              {[
                ["Region", "18°–24°N, 161°–154°W"],
                ["Time span", "2010 onward"],
                ["Depths", "Observed levels, original sampling preserved"],
                ["Result", "7,003 usable profiles"],
              ].map(([term, desc]) => (
                <div key={term} className="grid grid-cols-[7rem_1fr] gap-4 py-3">
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {term}
                  </dt>
                  <dd>{desc}</dd>
                </div>
              ))}
            </dl>
            <ul
              className="mt-4 flex flex-wrap gap-2"
              aria-label="Depth levels in meters"
            >
              {depths.map((d) => (
                <li
                  key={d}
                  className="rounded-full bg-cyan-50 px-3 py-1 font-mono text-xs text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300"
                >
                  {d.toLocaleString()} m
                </li>
              ))}
            </ul>
          </div>

          <div className={panel}>
            <h3 className="mb-4 text-lg font-semibold">
              Where the measurements come from
            </h3>
            {instruments.map((i) => (
              <div key={i.code} className="mb-5 flex gap-4">
                <span className="h-fit rounded-md bg-slate-900 px-2 py-1 font-mono text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                  {i.code}
                </span>
                <div>
                  <p className="font-medium">{i.name}</p>
                  <p className="text-slate-600 dark:text-slate-400">{i.body}</p>
                </div>
              </div>
            ))}
            <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <strong>Sound speed</strong> is then estimated from temperature,
              salinity and pressure at each depth.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className={section}>
        <div className={sectionHead}>
          <p className={eyebrow}>The team</p>
          <h2 className={h2}>We&apos;re PlaceHolder.</h2>
          <p className={sectionLede}>
            Four students who split the build, and shared the testing and
            write-up.
          </p>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <li key={m.name} className={panel}>
              <span
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-600 font-semibold text-white dark:bg-cyan-500 dark:text-slate-950"
                aria-hidden="true"
              >
                {m.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <h3 className="font-semibold">{m.name}</h3>
              <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
                {m.program}
              </p>
              <ul className="flex flex-wrap gap-2 text-xs">
                {m.roles.map((r) => (
                  <li
                    key={r}
                    className="rounded-full bg-cyan-50 px-2.5 py-1 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300"
                  >
                    {r}
                  </li>
                ))}
                <li className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  Testing &amp; write-up
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Decorative sound-speed-vs-depth graphic (illustrative only)         */
/* ------------------------------------------------------------------ */

function SoundProfile() {
  const tick = "fill-slate-400 font-mono text-[10px]";
  return (
    <figure className={`${panel} mx-auto w-full max-w-sm`}>
      <svg viewBox="0 0 320 360" role="img" aria-labelledby="sp-title">
        <title id="sp-title">
          Illustrative sound speed profile: speed drops with depth to a minimum
          near 1,000 m, then rises again.
        </title>
        {/* grid */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`h${i}`}
            x1="40"
            x2="300"
            y1={30 + i * 75}
            y2={30 + i * 75}
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeDasharray="3 4"
          />
        ))}
        {/* axes */}
        <line x1="40" y1="30" x2="300" y2="30" className="stroke-slate-400" />
        <line x1="40" y1="30" x2="40" y2="330" className="stroke-slate-400" />
        {/* profile curve */}
        <path
          d="M250 30 C 245 50, 230 70, 175 110 S 95 165, 90 180 S 120 260, 205 330"
          className="fill-none stroke-cyan-600 dark:stroke-cyan-400"
          strokeWidth={3}
          strokeLinecap="round"
        />
        {/* SOFAR minimum */}
        <circle cx="90" cy="180" r="5" className="fill-cyan-600 dark:fill-cyan-400" />
        <text x="102" y="184" className="fill-slate-700 text-xs dark:fill-slate-300">
          slowest ≈ 1,000 m
        </text>
        {/* labels */}
        <text x="300" y="20" textAnchor="end" className="fill-slate-500 text-[11px]">
          sound speed →
        </text>
        <text
          x="24"
          y="180"
          textAnchor="middle"
          transform="rotate(-90 24 180)"
          className="fill-slate-500 text-[11px]"
        >
          ← depth
        </text>
        <text x="34" y="34" textAnchor="end" className={tick}>
          0
        </text>
        <text x="34" y="334" textAnchor="end" className={tick}>
          2k
        </text>
      </svg>
      <figcaption className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
        Sound speed with depth (illustrative)
      </figcaption>
    </figure>
  );
}
