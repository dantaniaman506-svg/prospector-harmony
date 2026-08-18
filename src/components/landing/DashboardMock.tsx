import { Home, Search, History, Bookmark, Settings } from "lucide-react";
import { BrandMark } from "@/components/Brand";
import { Sparkline } from "@/components/Sparkline";

const NAV = [
  { label: "Dashboard", Icon: Home, active: true },
  { label: "Find Leads", Icon: Search },
  { label: "History", Icon: History },
  { label: "Saved", Icon: Bookmark },
  { label: "Settings", Icon: Settings },
];

const STATS = [
  { label: "Leads Found", value: "1,284", series: [2, 5, 9, 14, 18, 26] },
  { label: "Verified Leads", value: "1,102", series: [1, 4, 8, 11, 17, 22] },
  { label: "Emails Found", value: "846", series: [0, 3, 6, 9, 12, 17] },
  { label: "Closed Rate", value: "44.4%", series: [3, 6, 8, 12, 15, 21] },
];

const RECENT = [
  { title: "Restaurant / Cafe · Dubai", meta: "No Website · 17:08", count: 9 },
  { title: "Restaurant / Cafe · Bengaluru", meta: "No Website · 17:06", count: 14 },
  { title: "Clinic & Dental · Delhi", meta: "No Website · 17:03", count: 11 },
];

const LOCATIONS = [
  ["New Delhi", "1,043"],
  ["Bengaluru", "467"],
  ["Dubai", "251"],
  ["Pune", "126"],
  ["Mumbai", "78"],
];

/** Decorative product preview used on the landing page. */
export function DashboardMock() {
  return (
    <div
      aria-hidden
      className="card-soft overflow-hidden rounded-[26px] bg-card/80 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="flex items-center gap-2">
          <BrandMark className="size-5 text-primary" />
          <span className="font-display text-[13px] font-extrabold">
            AirLeads <span className="text-primary">AI</span>
          </span>
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold">
          <span className="size-1.5 rounded-full bg-emerald-500" /> Automation{" "}
          <span className="text-primary">live</span>
        </span>
      </div>

      <div className="flex">
        <div className="hidden w-[150px] shrink-0 flex-col gap-1 border-r border-border p-3 sm:flex">
          {NAV.map(({ label, Icon, active }) => (
            <span
              key={label}
              className={`flex items-center gap-2 rounded-xl px-2.5 py-2 text-[11px] font-bold ${
                active ? "bg-primary/12 text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="size-3.5" /> {label}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1 p-3.5">
          <p className="font-display text-[15px] font-extrabold">Dashboard</p>
          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-surface p-2.5">
                <p className="text-[9px] font-semibold text-muted-foreground">{s.label}</p>
                <p className="text-[15px] font-extrabold leading-tight">{s.value}</p>
                <Sparkline data={s.series} className="mt-1 h-5 w-full text-primary" />
              </div>
            ))}
          </div>

          <div className="mt-2.5 grid gap-2.5 lg:grid-cols-[1.35fr_1fr]">
            <div className="rounded-xl border border-border bg-surface p-3">
              <p className="text-[11px] font-extrabold">Recent Leads</p>
              <div className="mt-2 space-y-2">
                {RECENT.map((r) => (
                  <div key={r.title} className="flex items-center gap-2">
                    <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-primary/12">
                      <BrandMark className="size-3 text-primary" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[10px] font-bold">{r.title}</span>
                      <span className="block truncate text-[9px] text-muted-foreground">
                        {r.meta}
                      </span>
                    </span>
                    <span className="rounded-full bg-primary/12 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                      {r.count}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-2.5 text-[10px] font-bold text-primary">View all →</p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-3">
              <p className="text-[11px] font-extrabold">Top Locations</p>
              <div className="mt-1.5 divide-y divide-border">
                {LOCATIONS.map(([city, n]) => (
                  <div key={city} className="flex items-center justify-between py-1.5">
                    <span className="text-[10px] font-semibold">{city}</span>
                    <span className="text-[10px] text-muted-foreground">{n}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
