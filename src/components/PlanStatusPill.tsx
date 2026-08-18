import { useEffect, useRef, useState } from "react";
import { CreditCard, Gauge, Moon, Sparkles } from "lucide-react";
import { haptic } from "@/lib/haptics";
import type { useBilling } from "@/lib/billing";

type Billing = ReturnType<typeof useBilling>;

export function PlanStatusPill({
  billing,
  onManage,
}: {
  billing: Billing;
  onManage: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { plan, used, limit, remaining, exhausted, renewal, loading } = billing;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  if (loading) {
    return <span className="h-8 w-28 animate-pulse rounded-full bg-secondary" />;
  }

  const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          haptic.tap();
          setOpen((o) => !o);
        }}
        className={`press flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold transition-colors ${
          !plan
            ? "border-border bg-secondary/70 text-muted-foreground"
            : exhausted
              ? "border-border bg-secondary text-muted-foreground"
              : "border-primary/25 bg-primary/12 text-primary"
        }`}
      >
        <Gauge className="size-3.5" />
        {plan ? `${plan.name} · ${used}/${limit} today` : "No plan"}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-64 origin-top-right animate-in fade-in zoom-in-95 rounded-2xl border border-border bg-popover p-4 shadow-[var(--shadow-soft)] duration-200">
          {plan ? (
            <>
              <p className="text-[15px] font-extrabold">{plan.name} Plan</p>
              <p className="text-xs text-muted-foreground">₹{plan.price}/month</p>

              {exhausted ? (
                <p className="mt-3 flex items-start gap-2 rounded-xl bg-secondary px-3 py-2.5 text-[12px] font-medium text-muted-foreground">
                  <Moon className="mt-0.5 size-4 shrink-0" />
                  Today&apos;s credits are used up — resets at midnight.
                </p>
              ) : (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-muted-foreground">{used} used today</span>
                    <span className="text-primary">{remaining} left</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}

              {renewal && (
                <p className="mt-3 text-[11px] text-muted-foreground">
                  Renews in {renewal.days} day{renewal.days === 1 ? "" : "s"} ·{" "}
                  {renewal.date.toLocaleDateString()}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="flex items-center gap-2 text-[15px] font-extrabold">
                <Sparkles className="size-4 text-primary" /> No active plan
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Subscribe to unlock daily fresh leads.
              </p>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              haptic.tap();
              setOpen(false);
              onManage();
            }}
            className="press mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary/12 py-2.5 text-xs font-bold text-primary"
          >
            <CreditCard className="size-3.5" /> Manage Plan
          </button>
        </div>
      )}
    </div>
  );
}
