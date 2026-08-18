import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  ShieldCheck,
  MailCheck,
  Target,
  Sparkles,
  LogOut,
  Trash2,
  Inbox,
  Search,
  Download,
  Table2,
  LayoutGrid,
  Vibrate,
} from "lucide-react";
import { toast } from "sonner";
import { BottomTabs, type TabId } from "@/components/BottomTabs";
import { GeneratePanel, DEFAULT_CONFIG, type GenerateConfig } from "@/components/GeneratePanel";
import { LeadCard, type LeadStatus } from "@/components/LeadCard";
import { LoginScreen } from "@/components/LoginScreen";
import { Sparkline } from "@/components/Sparkline";
import { LeadsTable } from "@/components/LeadsTable";
import { TechBackground } from "@/components/TechBackground";
import { PlanStatusPill } from "@/components/PlanStatusPill";
import { PlansScreen } from "@/components/PlansScreen";
import { ThemeToggle } from "@/components/ThemeToggle";
import { generateLeads, type Lead } from "@/lib/airleads.functions";
import { useBilling } from "@/lib/billing";
import { useTheme } from "@/lib/theme";
import { haptic, hapticsEnabled, setHapticsEnabled } from "@/lib/haptics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AirLeads AI — Find businesses without a website" },
      {
        name: "description",
        content:
          "AirLeads AI Automation dashboard: generate verified business leads that have no website or an outdated one, with contact details in seconds.",
      },
      { property: "og:title", content: "AirLeads AI — Find businesses without a website" },
      {
        property: "og:description",
        content: "Generate verified leads with owner name, phone, email and socials in one tap.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});

type Run = {
  id: string;
  at: string;
  count: number;
  country: string;
  businessType: string;
  filter: string;
};

function App() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthed(window.localStorage.getItem("airleads-session") === "persist");
  }, []);

  if (authed === null) return <div className="min-h-dvh bg-background" />;
  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;
  return <Dashboard onSignOut={() => setAuthed(false)} />;
}

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const run = useServerFn(generateLeads);
  const billing = useBilling();
  const { theme } = useTheme();
  const [tab, setTab] = useState<TabId>("dashboard");
  const [config, setConfig] = useState<GenerateConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statuses, setStatuses] = useState<Record<string, LeadStatus>>({});
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"table" | "cards">("table");
  const [buzz, setBuzz] = useState(true);

  useEffect(() => {
    setBuzz(hapticsEnabled());
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("airleads-state");
      if (raw) {
        const s = JSON.parse(raw) as {
          leads?: Lead[];
          statuses?: Record<string, LeadStatus>;
          savedIds?: string[];
          runs?: Run[];
        };
        setLeads(s.leads ?? []);
        setStatuses(s.statuses ?? {});
        setSavedIds(s.savedIds ?? []);
        setRuns(s.runs ?? []);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "airleads-state",
      JSON.stringify({ leads, statuses, savedIds, runs }),
    );
  }, [leads, statuses, savedIds, runs]);

  const stats = useMemo(() => {
    const withPhone = leads.filter((l) => l.phone).length;
    const withEmail = leads.filter((l) => l.email).length;
    const closed = Object.values(statuses).filter((s) => s === "closed").length;
    const rate = leads.length ? Math.round((closed / leads.length) * 1000) / 10 : 0;
    const total = leads.length;

    // Growth curve built from real run history (oldest -> newest), 0 = flat line.
    const chronological = [...runs].reverse();
    const growth = (scale: number) => {
      if (chronological.length === 0) return [0, 0, 0, 0, 0, 0];
      let acc = 0;
      const pts = chronological.map((r) => {
        acc += r.count * scale;
        return Math.round(acc);
      });
      return [0, ...pts];
    };
    const ratio = total ? 1 : 0;

    return [
      { label: "Leads Found", value: total, Icon: Users, series: growth(1) },
      {
        label: "Verified Leads",
        value: withPhone,
        Icon: ShieldCheck,
        series: growth(total ? (withPhone / total) * ratio : 0),
      },
      {
        label: "Emails Found",
        value: withEmail,
        Icon: MailCheck,
        series: growth(total ? (withEmail / total) * ratio : 0),
      },
      {
        label: "Closed Rate",
        value: `${rate}%`,
        Icon: Target,
        series: growth(total ? (closed / total) * ratio : 0),
      },
    ];
  }, [leads, runs, statuses]);

  async function handleGenerate() {
    const random = config.mode === "random";

    if (!random && !config.location.trim()) {
      haptic.error();
      toast.error("Choose a state or city first", {
        description: "The automation needs a location to search in.",
      });
      return;
    }

    // ---- Credit checks (plan required, daily limit enforced) ----
    if (!billing.plan) {
      haptic.error();
      toast.error("No active plan", {
        description: "Subscribe to a plan to start generating leads.",
        action: { label: "See plans", onClick: () => setTab("plans") },
      });
      setTab("plans");
      return;
    }
    if (billing.remaining <= 0) {
      haptic.error();
      toast.error("Today's lead credits are used up", {
        description: `Your ${billing.plan.name} plan gives ${billing.limit} leads a day. Credits reset at midnight.`,
        action: { label: "Upgrade", onClick: () => setTab("plans") },
      });
      return;
    }

    const allowance = billing.remaining;
    const area = random ? `random city in ${config.country}` : `${config.location}, ${config.country}`;

    setLoading(true);
    const toastId = toast.loading("Finding businesses without a website…", {
      description: `${config.businessType} · ${area}. This can take 30–60 seconds.`,
    });

    let res: Awaited<ReturnType<typeof run>>;
    try {
      res = await run({
        data: {
          country: config.country,
          location: random ? "" : config.location.trim(),
          businessType: config.businessType,
          mode: config.mode,
        },
      });
    } catch {
      setLoading(false);
      haptic.error();
      toast.error("Couldn't reach the lead engine", {
        id: toastId,
        description: "Check your internet connection and try again.",
      });
      return;
    }
    setLoading(false);

    if (!res.ok || res.leads.length === 0) {
      haptic.error();
      toast.error("No leads generated", {
        id: toastId,
        description: res.message || "Try another city or business type.",
      });
      return;
    }

    // Never hand over more leads than the plan still allows today.
    const delivered = res.leads.slice(0, allowance);
    const trimmed = res.leads.length - delivered.length;
    const where = res.ok && res.location ? res.location : config.location;

    haptic.success();
    setLeads(delivered);
    billing.consumeCredit(delivered.length);
    setTab("leads");
    toast.success(`${delivered.length} leads found`, {
      id: toastId,
      description: trimmed
        ? `${config.businessType} in ${where} — ${trimmed} more were held back because today's credits ran out.`
        : `${config.businessType} in ${where} — all without a website.`,
    });
    setRuns((r) =>
      [
        {
          id: `run-${Date.now()}`,
          at: new Date().toISOString(),
          count: delivered.length,
          country: `${where}, ${config.country}`,
          businessType: config.businessType,
          filter: random ? "Random · No Website" : "No Website",
        },
        ...r,
      ].slice(0, 30),
    );
  }

  const savedLeads = leads.filter((l) => savedIds.includes(l.id));

  const visibleLeads = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((l) =>
      [l.businessName, l.phone, l.email, l.address, l.category, l.city, l.country]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [leads, query]);

  function exportCsv(rows: Lead[]) {
    if (!rows.length) return;
    haptic.tap();
    const cols = [
      "businessName",
      "category",
      "phone",
      "email",
      "address",
      "city",
      "country",
      "rating",
      "reviewsCount",
      "googleMapsUrl",
    ] as const;
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join(
      "\n",
    );
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `airleads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  }

  return (
    <div className="relative min-h-dvh pb-32">
      <TechBackground />
      <header className="sticky top-0 z-30 glass-panel border-x-0 border-t-0 px-5 py-3">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <span className="font-display text-lg font-extrabold tracking-tight">
            AirLeads <span className="text-primary">AI</span>
          </span>
          <span className="rounded-full bg-primary/12 px-3 py-1.5 text-[11px] font-bold text-primary">
            Automation live
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 pt-5">
        {tab === "dashboard" && (
          <>
            <div>
              <h1 className="text-[26px] font-extrabold leading-tight">
                Welcome back <span className="text-gradient">👋</span>
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Let&apos;s find businesses that still need a website.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {stats.map(({ label, value, Icon, series }) => (
                <div key={label} className="card-soft overflow-hidden p-4">
                  <span className="grid size-9 place-items-center rounded-xl bg-primary/12">
                    <Icon className="size-4.5 text-primary" />
                  </span>
                  <p className="mt-3 text-xs font-semibold text-muted-foreground">{label}</p>
                  <p className="text-[22px] font-extrabold leading-tight">{value}</p>
                  <Sparkline data={series} className="mt-2 h-8 w-full text-primary" />
                </div>
              ))}
            </div>

            <GeneratePanel
              config={config}
              setConfig={setConfig}
              onGenerate={handleGenerate}
              loading={loading}
            />
          </>
        )}

        {tab === "leads" && (
          <>
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-[24px] font-extrabold">Your Leads</h1>
                <p className="text-sm text-muted-foreground">
                  {visibleLeads.length} of {leads.length} businesses
                </p>
              </div>
              {leads.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Export CSV"
                    onClick={() => exportCsv(visibleLeads)}
                    className="press rounded-full bg-secondary p-2.5 text-muted-foreground"
                  >
                    <Download className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Toggle view"
                    onClick={() => {
                      haptic.select();
                      setView((v) => (v === "table" ? "cards" : "table"));
                    }}
                    className="press rounded-full bg-secondary p-2.5 text-muted-foreground"
                  >
                    {view === "table" ? (
                      <LayoutGrid className="size-4" />
                    ) : (
                      <Table2 className="size-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label="Clear leads"
                    onClick={() => {
                      haptic.tap();
                      setLeads([]);
                      setStatuses({});
                      setSavedIds([]);
                      toast.success("Leads cleared");
                    }}
                    className="press rounded-full bg-secondary p-2.5 text-muted-foreground"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              )}
            </div>

            {leads.length > 0 && (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/60 px-4 focus-within:border-primary">
                <Search className="size-4 shrink-0 text-primary" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search business, owner, phone, email…"
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            )}
            {leads.length === 0 ? (
              <EmptyState
                title="No leads yet"
                text="Head to the dashboard and hit Generate Leads to fill this list."
              />
            ) : view === "table" ? (
              <LeadsTable
                leads={visibleLeads}
                statuses={statuses}
                onStatusChange={(id, s) => setStatuses((prev) => ({ ...prev, [id]: s }))}
              />
            ) : (
              <div className="space-y-3">
                {visibleLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    status={statuses[lead.id] ?? "open"}
                    saved={savedIds.includes(lead.id)}
                    onStatusChange={(s) => setStatuses((prev) => ({ ...prev, [lead.id]: s }))}
                    onToggleSave={() =>
                      setSavedIds((prev) =>
                        prev.includes(lead.id)
                          ? prev.filter((i) => i !== lead.id)
                          : [...prev, lead.id],
                      )
                    }
                  />
                ))}
              </div>
            )}
          </>
        )}

        {tab === "history" && (
          <>
            <h1 className="text-[24px] font-extrabold">History</h1>
            {runs.length === 0 ? (
              <EmptyState
                title="No runs yet"
                text="Every generation you make will be logged here."
              />
            ) : (
              <div className="space-y-3">
                {runs.map((r) => (
                  <div key={r.id} className="card-soft flex items-center gap-3 p-4">
                    <span className="grid size-10 place-items-center rounded-xl bg-primary/12">
                      <Sparkles className="size-5 text-primary" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-bold">
                        {r.businessType} · {r.country}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {r.filter} · {new Date(r.at).toLocaleString()}
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/12 px-3 py-1 text-xs font-bold text-primary">
                      {r.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "saved" && (
          <>
            <h1 className="text-[24px] font-extrabold">Saved</h1>
            {savedLeads.length === 0 ? (
              <EmptyState
                title="Nothing saved"
                text="Tap the bookmark on any lead to keep it here."
              />
            ) : (
              <div className="space-y-3">
                {savedLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    status={statuses[lead.id] ?? "open"}
                    saved
                    onStatusChange={(s) => setStatuses((prev) => ({ ...prev, [lead.id]: s }))}
                    onToggleSave={() => setSavedIds((prev) => prev.filter((i) => i !== lead.id))}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {tab === "settings" && (
          <>
            <h1 className="text-[24px] font-extrabold">Settings</h1>
            <div className="card-soft divide-y divide-border">
              <Row label="Appearance" value="Light" />
              <Row label="Default country" value={config.country} />
              <Row label="Location" value={config.location || "Not set"} />
              <Row label="Leads per run" value="All leads found" />
              <Row label="Automation" value="Connected" />
              <div className="flex items-center justify-between px-4 py-4">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <Vibrate className="size-4 text-primary" /> Vibration & haptics
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={buzz}
                  aria-label="Toggle vibration"
                  onClick={() => {
                    const next = !buzz;
                    setHapticsEnabled(next);
                    setBuzz(next);
                    if (next) haptic.success();
                  }}
                  className={`press relative h-7 w-12 rounded-full transition-colors ${buzz ? "bg-primary" : "bg-secondary"}`}
                >
                  <span
                    className={`absolute top-1 size-5 rounded-full bg-background transition-all ${buzz ? "left-6" : "left-1"}`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between px-4 py-4">
                <span className="text-sm font-semibold">Export all leads</span>
                <button
                  type="button"
                  onClick={() => exportCsv(leads)}
                  className="press flex items-center gap-1.5 rounded-full bg-secondary px-3 py-2 text-xs font-bold"
                >
                  <Download className="size-3.5" /> CSV
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                haptic.tap();
                window.localStorage.removeItem("airleads-session");
                onSignOut();
              }}
              className="press flex w-full items-center justify-center gap-2 rounded-full border-2 border-destructive/40 py-4 text-sm font-bold text-destructive"
            >
              <LogOut className="size-4" /> Log out
            </button>
          </>
        )}
      </main>

      <BottomTabs active={tab} onChange={setTab} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <span className="text-sm font-semibold">{label}</span>
      <span className="text-sm text-muted-foreground">{value}</span>
    </div>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="card-soft flex flex-col items-center gap-2 px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-primary/12">
        <Inbox className="size-6 text-primary" />
      </span>
      <p className="mt-2 text-[17px] font-bold">{title}</p>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
