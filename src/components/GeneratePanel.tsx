import { useState } from "react";
import {
  Check,
  ChevronDown,
  Globe2,
  Briefcase,
  Sparkles,
  Zap,
  Loader2,
  RotateCcw,
  Ban,
  MapPin,
  Search,
  LocateFixed,
  Shuffle,
} from "lucide-react";
import { BUSINESS_TYPES, COUNTRIES, LOCATIONS } from "@/lib/countries";
import { haptic } from "@/lib/haptics";

export type LocationMode = "specific" | "random";

export type GenerateConfig = {
  mode: LocationMode;
  country: string;
  location: string;
  businessType: string;
};

export const DEFAULT_CONFIG: GenerateConfig = {
  mode: "specific",
  country: "India",
  location: LOCATIONS["IN"]![0]!,
  businessType: BUSINESS_TYPES[0]!,
};

export function GeneratePanel({
  config,
  setConfig,
  onGenerate,
  loading,
}: {
  config: GenerateConfig;
  setConfig: (c: GenerateConfig) => void;
  onGenerate: () => void;
  loading: boolean;
}) {
  const [countryOpen, setCountryOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");

  const country = COUNTRIES.find((c) => c.name === config.country) ?? COUNTRIES[0]!;
  const locations = LOCATIONS[country.code] ?? [];
  const q = locationQuery.trim().toLowerCase();
  const filtered = q ? locations.filter((l) => l.toLowerCase().includes(q)) : locations;

  const closeAll = () => {
    setCountryOpen(false);
    setLocationOpen(false);
    setTypeOpen(false);
  };

  return (
    <section className="card-soft p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            Generate Leads <Sparkles className="size-5 text-primary" />
          </h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Pick country, location and business type — we fetch every business we find without a
            website.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            haptic.tap();
            closeAll();
            setConfig(DEFAULT_CONFIG);
          }}
          className="press flex shrink-0 items-center gap-1.5 rounded-full bg-primary/12 px-3 py-2 text-xs font-bold text-primary"
        >
          <RotateCcw className="size-3.5" /> Reset
        </button>
      </div>

      {/* Country */}
      <div className="mt-5 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Country</p>
        <button
          type="button"
          onClick={() => {
            haptic.tap();
            const next = !countryOpen;
            closeAll();
            setCountryOpen(next);
          }}
          className="press flex w-full items-center gap-3 rounded-xl border border-border bg-secondary/60 px-4 py-3.5"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-primary/12">
            <Globe2 className="size-4.5 text-primary" />
          </span>
          <span className="flex-1 text-left text-[15px] font-semibold">
            <span className="mr-2 text-lg leading-none">{country.flag}</span>
            {country.name}
          </span>
          <ChevronDown
            className={`size-5 text-muted-foreground transition-transform ${countryOpen ? "rotate-180" : ""}`}
          />
        </button>
        {countryOpen && (
          <div className="max-h-72 space-y-1 overflow-y-auto rounded-xl border border-border bg-card p-2 shadow-[var(--shadow-soft)]">
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  haptic.select();
                  setConfig({
                    ...config,
                    country: c.name,
                    location: (LOCATIONS[c.code] ?? [])[0] ?? "",
                  });
                  setCountryOpen(false);
                }}
                className={`press flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[14px] font-medium ${
                  c.name === config.country ? "bg-primary/12 text-primary" : "hover:bg-secondary"
                }`}
              >
                <span className="text-lg leading-none">{c.flag}</span>
                <span className="flex-1">{c.name}</span>
                {c.name === config.country && <Check className="size-4" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Location mode */}
      <div className="mt-4 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Search Area
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {(
            [
              {
                id: "specific" as const,
                label: "Specific City",
                hint: "Pick a state or city",
                Icon: LocateFixed,
              },
              {
                id: "random" as const,
                label: "Random Cities",
                hint: "Surprise me nationwide",
                Icon: Shuffle,
              },
            ]
          ).map(({ id, label, hint, Icon }) => {
            const on = config.mode === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  haptic.select();
                  closeAll();
                  setConfig({ ...config, mode: id });
                }}
                className={`press relative overflow-hidden rounded-2xl border p-3.5 text-left transition-all duration-300 ${
                  on
                    ? "border-primary/50 bg-primary/10 ring-1 ring-primary/25"
                    : "border-border bg-secondary/50 hover:bg-secondary"
                }`}
              >
                <span
                  className={`grid size-8 place-items-center rounded-lg transition-colors ${
                    on ? "bg-primary/18 text-primary" : "bg-background text-muted-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                </span>
                <span className="mt-2.5 block text-[13.5px] font-bold">{label}</span>
                <span className="block text-[11px] text-muted-foreground">{hint}</span>
                {on && <Check className="absolute right-3 top-3 size-4 text-primary" />}
              </button>
            );
          })}
        </div>
        {config.mode === "random" && (
          <p className="text-[12px] leading-snug text-muted-foreground">
            We&apos;ll pull leads from different cities across the country each time you generate.
          </p>
        )}
      </div>

      {/* Location */}
      <div className={`mt-4 space-y-2 ${config.mode === "random" ? "hidden" : ""}`}>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          State / City
        </p>
        <button
          type="button"
          onClick={() => {
            haptic.tap();
            const next = !locationOpen;
            closeAll();
            setLocationOpen(next);
          }}
          className="press flex w-full items-center gap-3 rounded-xl border border-border bg-secondary/60 px-4 py-3.5"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-primary/12">
            <MapPin className="size-4.5 text-primary" />
          </span>
          <span className="flex-1 text-left text-[15px] font-semibold">
            {config.location || "Choose a location"}
          </span>
          <ChevronDown
            className={`size-5 text-muted-foreground transition-transform ${locationOpen ? "rotate-180" : ""}`}
          />
        </button>
        {locationOpen && (
          <div className="rounded-xl border border-border bg-card p-2 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-2 rounded-lg bg-secondary/60 px-3 focus-within:ring-2 focus-within:ring-primary/40">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Search or type any state / city"
                aria-label="Search state or city"
                className="w-full bg-transparent py-2.5 text-[14px] font-medium outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="mt-1 max-h-64 space-y-1 overflow-y-auto">
              {locationQuery.trim() &&
                !filtered.some((l) => l.toLowerCase() === locationQuery.trim().toLowerCase()) && (
                  <button
                    type="button"
                    onClick={() => {
                      haptic.select();
                      setConfig({ ...config, location: locationQuery.trim() });
                      setLocationQuery("");
                      setLocationOpen(false);
                    }}
                    className="press flex w-full items-center gap-2 rounded-lg bg-primary/10 px-3 py-3 text-left text-[14px] font-semibold text-primary"
                  >
                    <MapPin className="size-4" /> Use &ldquo;{locationQuery.trim()}&rdquo;
                  </button>
                )}
              {filtered.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    haptic.select();
                    setConfig({ ...config, location: l });
                    setLocationQuery("");
                    setLocationOpen(false);
                  }}
                  className={`press flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[14px] font-medium ${
                    l === config.location ? "bg-primary/12 text-primary" : "hover:bg-secondary"
                  }`}
                >
                  <span className="flex-1">{l}</span>
                  {l === config.location && <Check className="size-4" />}
                </button>
              ))}
              {filtered.length === 0 && !locationQuery.trim() && (
                <p className="px-3 py-3 text-[13px] text-muted-foreground">
                  Type a state or city name above.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Business type */}
      <div className="mt-4 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Business Type
        </p>
        <button
          type="button"
          onClick={() => {
            haptic.tap();
            const next = !typeOpen;
            closeAll();
            setTypeOpen(next);
          }}
          className="press flex w-full items-center gap-3 rounded-xl border border-border bg-secondary/60 px-4 py-3.5"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-primary/12">
            <Briefcase className="size-4.5 text-primary" />
          </span>
          <span className="flex-1 text-left text-[15px] font-semibold">{config.businessType}</span>
          <ChevronDown
            className={`size-5 text-muted-foreground transition-transform ${typeOpen ? "rotate-180" : ""}`}
          />
        </button>
        {typeOpen && (
          <div className="max-h-72 space-y-1 overflow-y-auto rounded-xl border border-border bg-card p-2 shadow-[var(--shadow-soft)]">
            {BUSINESS_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  haptic.select();
                  setConfig({ ...config, businessType: t });
                  setTypeOpen(false);
                }}
                className={`press flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[14px] font-medium ${
                  t === config.businessType ? "bg-primary/12 text-primary" : "hover:bg-secondary"
                }`}
              >
                <span className="flex-1">{t}</span>
                {t === config.businessType && <Check className="size-4" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-primary/25 bg-primary/8 px-4 py-3.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/15">
          <Ban className="size-4.5 text-primary" />
        </span>
        <p className="text-[13px] font-medium leading-snug text-foreground/90">
          Every run targets businesses with <span className="font-bold">no website</span>. You get
          exactly as many leads as the automation finds — no manual count needed.
        </p>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={() => {
          haptic.tap();
          closeAll();
          onGenerate();
        }}
        className="btn-glow mt-5 flex w-full items-center justify-center gap-3 rounded-full py-4.5 text-[16px] font-extrabold disabled:opacity-70"
      >
        {loading ? <Loader2 className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
        {loading ? "Finding leads…" : "Generate Leads"}
        {!loading && (
          <span className="grid size-8 place-items-center rounded-full bg-foreground/15">
            <Zap className="size-4" />
          </span>
        )}
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        {loading
          ? "This can take 30–60 seconds. Keep this screen open."
          : "AI scans Google Maps and returns every business without a website"}
      </p>
    </section>
  );
}
