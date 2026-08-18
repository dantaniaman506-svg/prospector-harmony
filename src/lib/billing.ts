import { useCallback, useEffect, useState } from "react";
import { getPlan, type PlanId } from "./plans";

const KEY = "airleads-billing";

export type Billing = {
  planId: PlanId | null;
  /** ISO date (yyyy-mm-dd) the usage counter belongs to */
  day: string;
  usedToday: number;
  /** ISO timestamp of the last successful subscription payment */
  startedAt: string | null;
};

const EMPTY: Billing = { planId: null, day: today(), usedToday: 0, startedAt: null };

function today() {
  return new Date().toISOString().slice(0, 10);
}

function read(): Billing {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = { ...EMPTY, ...(JSON.parse(raw) as Partial<Billing>) };
    // Daily reset at midnight.
    if (parsed.day !== today()) return { ...parsed, day: today(), usedToday: 0 };
    return parsed;
  } catch {
    return EMPTY;
  }
}

export function useBilling() {
  const [billing, setBilling] = useState<Billing>(EMPTY);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setBilling(read());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback((next: Billing) => {
    window.localStorage.setItem(KEY, JSON.stringify(next));
    setBilling(next);
  }, []);

  const plan = getPlan(billing.planId);
  const limit = plan?.credits ?? 0;
  const remaining = Math.max(0, limit - billing.usedToday);

  const activatePlan = useCallback(
    (planId: PlanId) => {
      save({ planId, day: today(), usedToday: 0, startedAt: new Date().toISOString() });
    },
    [save],
  );

  const consumeCredit = useCallback(
    (n = 1) => {
      const current = read();
      save({ ...current, day: today(), usedToday: current.usedToday + n });
    },
    [save],
  );

  const renewal = (() => {
    const start = billing.startedAt ? new Date(billing.startedAt) : null;
    if (!start) return null;
    const next = new Date(start);
    next.setMonth(next.getMonth() + 1);
    const days = Math.max(0, Math.ceil((next.getTime() - Date.now()) / 86_400_000));
    return { date: next, days };
  })();

  return {
    billing,
    loading,
    plan,
    limit,
    used: billing.usedToday,
    remaining,
    exhausted: !!plan && remaining === 0,
    renewal,
    activatePlan,
    consumeCredit,
    refresh,
  };
}
