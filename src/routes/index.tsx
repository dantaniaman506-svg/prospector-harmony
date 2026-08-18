import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Target,
  ShieldCheck,
  Zap,
  Download,
  Search,
  Sparkles,
  Send,
  Check,
  Play,
  Menu,
  X,
  Quote,
  MapPin,
  Building2,
  Scissors,
  Dumbbell,
  Stethoscope,
  Hammer,
  ChevronDown,
} from "lucide-react";
import { BrandWord } from "@/components/Brand";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TechBackground } from "@/components/TechBackground";
import { Reveal } from "@/components/Reveal";
import { DashboardMock } from "@/components/landing/DashboardMock";
import { PLANS } from "@/lib/plans";
import { readSession } from "@/lib/session";
import { haptic } from "@/lib/haptics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AirLeads AI — Find Businesses Without a Website" },
      {
        name: "description",
        content:
          "AirLeads AI finds local businesses that need a website, verifies their phone and email, and exports ready-to-call leads in seconds.",
      },
      { property: "og:title", content: "AirLeads AI — Find Businesses Without a Website" },
      {
        property: "og:description",
        content:
          "Discover local businesses with no website, get verified contact details, and automate outreach from one dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const NAV_LINKS = [
  ["Features", "#features"],
  ["How It Works", "#how-it-works"],
  ["Use Cases", "#use-cases"],
  ["Pricing", "#pricing"],
  ["Testimonials", "#testimonials"],
  ["FAQ", "#faq"],
] as const;

const FEATURES = [
  {
    Icon: Target,
    title: "No-website detection",
    text: "The engine scans local listings and keeps only the businesses that have no website or an outdated one.",
  },
  {
    Icon: ShieldCheck,
    title: "Verified contacts",
    text: "Owner name, working phone number, email and social profiles — checked before they reach your list.",
  },
  {
    Icon: MapPin,
    title: "Any city, any niche",
    text: "Pick a country and city, or let random discovery mode surface untouched markets for you.",
  },
  {
    Icon: Zap,
    title: "Runs in under a minute",
    text: "One tap starts the automation. Fresh leads land on your dashboard while you finish your coffee.",
  },
  {
    Icon: Download,
    title: "Instant CSV export",
    text: "Export any run to CSV and drop it straight into your CRM, dialer or cold email tool.",
  },
  {
    Icon: Send,
    title: "Outreach ready",
    text: "Call, WhatsApp or email a lead in one tap, and track it as open, contacted or closed.",
  },
];

const STEPS = [
  {
    Icon: Search,
    title: "Choose your market",
    text: "Select country, city and business type — or let the engine pick a random untapped city.",
  },
  {
    Icon: Sparkles,
    title: "AI finds the gaps",
    text: "The automation scans listings, filters out anyone who already has a website, and verifies contacts.",
  },
  {
    Icon: Send,
    title: "Close more deals",
    text: "Work the list from your dashboard, mark status, export to CSV and follow up without losing anyone.",
  },
];

const USE_CASES = [
  { Icon: Building2, title: "Web agencies", text: "Sell websites to businesses that visibly need one." },
  { Icon: Scissors, title: "Salons & spas", text: "Local service niches with almost zero online presence." },
  { Icon: Stethoscope, title: "Clinics & dental", text: "High-ticket local clients who book by phone only." },
  { Icon: Dumbbell, title: "Gyms & studios", text: "Fast-growing niche that still runs on Instagram DMs." },
  { Icon: Hammer, title: "Trades & repair", text: "Plumbers, electricians and builders with no web page." },
  { Icon: Target, title: "Freelancers", text: "Build a daily pipeline without cold scraping by hand." },
];

const TESTIMONIALS = [
  {
    quote:
      "I stopped scraping Maps by hand. Two runs a day and my calling list is full of businesses that actually need a site.",
    name: "Rohit Sharma",
    role: "Web design freelancer, Pune",
  },
  {
    quote:
      "The no-website filter is the whole product. Every lead is a real conversation instead of a cold guess.",
    name: "Ayesha Khan",
    role: "Founder, Nova Studio",
  },
  {
    quote:
      "We closed four retainers in the first month. Verified phone numbers made the difference for our callers.",
    name: "Daniel Mensah",
    role: "Agency owner, Dubai",
  },
];

const FAQS = [
  {
    q: "How does AirLeads know a business has no website?",
    a: "Every listing is checked for a live website field and a reachable page. Businesses with a working site are dropped before the list ever reaches you.",
  },
  {
    q: "Which countries and cities are supported?",
    a: "You can target any supported country and pick a state or city inside it. Random discovery mode picks an untapped city for you automatically.",
  },
  {
    q: "How many leads do I get per day?",
    a: "It depends on your plan. Daily credits reset at midnight, and your dashboard always shows how many you have left.",
  },
  {
    q: "Can I export the leads?",
    a: "Yes — any run can be exported to CSV with name, category, phone, email, address, rating and the Google Maps link.",
  },
  {
    q: "Do I need to create an account?",
    a: "No sign-up flow. AirLeads is invite-only: you log in with the credentials issued for your account.",
  },
];

const LOGOS = ["taskflo", "GrowthSpark", "PitchPilot", "LeadBoost", "SalesRobot"];

function Landing() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(readSession());
  }, []);

  const cta = authed ? "Open Dashboard" : "Get Started Free";

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <TechBackground />

      {/* ---------- Nav ---------- */}
      <header className="sticky top-0 z-40 glass-panel border-x-0 border-t-0">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3 lg:px-8">
          <Link to="/" className="press shrink-0">
            <BrandWord />
          </Link>

          <nav className="mx-auto hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-full px-3.5 py-2 text-[13px] font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <ThemeToggle />
            <Link
              to="/login"
              className="press hidden rounded-full px-4 py-2 text-[13px] font-bold text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              Log in
            </Link>
            <Link
              to={authed ? "/app" : "/login"}
              onClick={() => haptic.tap()}
              className="btn-glow hidden items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold sm:flex"
            >
              {cta} <ArrowRight className="size-4" />
            </Link>
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setMenu((m) => !m)}
              className="press grid size-9 place-items-center rounded-full border border-border bg-secondary/70 lg:hidden"
            >
              {menu ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
            </button>
          </div>
        </div>

        {menu && (
          <div className="animate-in fade-in slide-in-from-top-2 border-t border-border px-5 pb-5 pt-2 duration-200 lg:hidden">
            <nav className="grid gap-1">
              {NAV_LINKS.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenu(false)}
                  className="rounded-xl px-3 py-3 text-sm font-semibold text-muted-foreground"
                >
                  {label}
                </a>
              ))}
            </nav>
            <Link
              to={authed ? "/app" : "/login"}
              className="btn-glow mt-2 flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold"
            >
              {cta} <ArrowRight className="size-4" />
            </Link>
          </div>
        )}
      </header>

      {/* ---------- Hero ---------- */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-8 pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:px-8 lg:pt-24">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-2 text-[12px] font-bold text-primary">
              <Sparkles className="size-3.5" /> AI-Powered Lead Generation
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 text-[40px] font-extrabold leading-[1.03] tracking-tight sm:text-6xl lg:text-[68px]">
              Find Businesses.
              <br />
              Close <span className="text-gradient">More Deals.</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-lg">
              AirLeads AI helps you discover local businesses that need a website, get verified
              contact details, and automate your outreach — all in one powerful platform.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to={authed ? "/app" : "/login"}
                onClick={() => haptic.tap()}
                className="btn-glow flex items-center justify-center gap-2 rounded-2xl px-7 py-4 text-[15px] font-bold"
              >
                Start Generating Leads <ArrowRight className="size-5" />
              </Link>
              <a
                href="#how-it-works"
                className="press flex items-center justify-center gap-2.5 rounded-2xl border border-border bg-card px-6 py-4 text-[15px] font-bold shadow-[var(--shadow-soft)]"
              >
                <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Play className="size-3.5 fill-current" />
                </span>
                Watch Demo
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              {[
                [Target, "Find leads with", "no website"],
                [ShieldCheck, "Verified emails", "and phones"],
                [Zap, "Automated", "and fast"],
                [Download, "Export leads", "instantly"],
              ].map(([Icon, a, b]) => {
                const I = Icon as typeof Target;
                return (
                  <li key={a as string} className="flex items-start gap-2.5">
                    <I className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span className="text-[12.5px] leading-snug text-muted-foreground">
                      {a as string}
                      <br />
                      <span className="font-bold text-foreground">{b as string}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={120} className="lg:pl-4">
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[40px] bg-primary/10 blur-3xl" />
            <DashboardMock />
          </div>
        </Reveal>
      </section>

      {/* ---------- Logos ---------- */}
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <Reveal>
          <p className="text-center text-[13px] font-semibold text-muted-foreground">
            Trusted by marketers, agencies &amp; sales teams
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-16">
            {LOGOS.map((l) => (
              <span
                key={l}
                className="font-display text-lg font-extrabold text-muted-foreground/70 transition-colors hover:text-foreground sm:text-2xl"
              >
                {l}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ---------- Features ---------- */}
      <Section
        id="features"
        eyebrow="Features"
        title="Everything you need to fill your pipeline"
        text="A focused toolkit built for one job: finding local businesses that still need a website, and getting you in front of them first."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 70}>
              <div className="card-soft group h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]">
                <span className="grid size-11 place-items-center rounded-2xl bg-primary/12 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="size-5 text-primary" />
                </span>
                <p className="mt-4 text-[17px] font-extrabold">{title}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------- How it works ---------- */}
      <Section
        id="how-it-works"
        eyebrow="How It Works"
        title="Three steps from idea to closed deal"
        text="No setup, no scraping scripts, no spreadsheets. Log in and run the automation."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {STEPS.map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 110}>
              <div className="card-soft relative h-full overflow-hidden p-7">
                <span className="absolute right-5 top-4 font-display text-6xl font-extrabold text-primary/10">
                  {i + 1}
                </span>
                <span className="grid size-12 place-items-center rounded-2xl bg-primary/12">
                  <Icon className="size-5.5 text-primary" />
                </span>
                <p className="mt-5 text-[18px] font-extrabold">{title}</p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------- Use cases ---------- */}
      <Section
        id="use-cases"
        eyebrow="Use Cases"
        title="Built for the people who sell websites"
        text="Agencies, freelancers and sales teams use AirLeads to open conversations in local markets every single day."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 60}>
              <div className="glass-panel flex h-full items-start gap-4 rounded-3xl p-5 transition-transform duration-300 hover:-translate-y-1">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/12">
                  <Icon className="size-4.5 text-primary" />
                </span>
                <span>
                  <span className="block text-[15px] font-extrabold">{title}</span>
                  <span className="mt-1 block text-[13px] text-muted-foreground">{text}</span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------- Pricing ---------- */}
      <Section
        id="pricing"
        eyebrow="Pricing"
        title="Simple plans, daily fresh leads"
        text="Every plan gives you daily lead credits that reset at midnight. Upgrade or change anytime from your dashboard."
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <div
                className={`relative flex h-full flex-col rounded-3xl p-7 transition-transform duration-300 hover:-translate-y-1.5 ${
                  p.popular
                    ? "border-2 border-primary bg-card shadow-[var(--shadow-glow)]"
                    : "card-soft"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-primary-foreground">
                    Most popular
                  </span>
                )}
                <p className="text-[15px] font-extrabold">{p.name}</p>
                <p className="mt-2 flex items-end gap-1">
                  <span className="font-display text-4xl font-extrabold">₹{p.price}</span>
                  <span className="pb-1 text-[13px] text-muted-foreground">/month</span>
                </p>
                <p className="mt-2 text-[13px] font-bold text-primary">
                  {p.credits} fresh leads every day
                </p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5 text-[13.5px]">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{perk}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    haptic.tap();
                    navigate({ to: authed ? "/app" : "/login" });
                  }}
                  className={`mt-6 rounded-2xl py-3.5 text-[14px] font-bold ${
                    p.popular ? "btn-glow" : "press border border-border bg-secondary"
                  }`}
                >
                  Choose {p.name}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------- Testimonials ---------- */}
      <Section
        id="testimonials"
        eyebrow="Testimonials"
        title="Teams closing deals with AirLeads"
        text="Real operators using the same automation you get on day one."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <figure className="card-soft flex h-full flex-col p-6">
                <Quote className="size-6 text-primary/40" />
                <blockquote className="mt-3 flex-1 text-[14px] leading-relaxed">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-primary/12 text-[13px] font-extrabold text-primary">
                    {t.name.slice(0, 1)}
                  </span>
                  <span>
                    <span className="block text-[13.5px] font-extrabold">{t.name}</span>
                    <span className="block text-[12px] text-muted-foreground">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------- FAQ ---------- */}
      <Section
        id="faq"
        eyebrow="FAQ"
        title="Questions, answered"
        text="Still unsure? Everything you need to know before your first run."
      >
        <div className="mx-auto max-w-3xl space-y-3">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <details className="card-soft group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-[14.5px] font-bold">
                  {f.q}
                  <ChevronDown className="size-4.5 shrink-0 text-primary transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] border border-border bg-card px-6 py-14 text-center shadow-[var(--shadow-soft)] sm:px-14">
            <div className="absolute -left-20 -top-24 size-72 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-extrabold sm:text-4xl">
                Your next client doesn&apos;t have a website yet.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[14.5px] text-muted-foreground">
                Log in and run the automation — verified leads in under a minute.
              </p>
              <Link
                to={authed ? "/app" : "/login"}
                onClick={() => haptic.tap()}
                className="btn-glow mt-8 inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-[15px] font-bold"
              >
                {cta} <ArrowRight className="size-5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-border px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 sm:flex-row sm:justify-between">
          <BrandWord />
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {NAV_LINKS.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-[12.5px] font-semibold text-muted-foreground hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>
          <p className="text-[12px] text-muted-foreground">
            © {new Date().getFullYear()} AirLeads AI
          </p>
        </div>
      </footer>
    </div>
  );
}

function Section({
  id,
  eyebrow,
  title,
  text,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 lg:px-8 lg:py-24">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </span>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-muted-foreground">{text}</p>
        </div>
      </Reveal>
      <div className="mt-12">{children}</div>
    </section>
  );
}
