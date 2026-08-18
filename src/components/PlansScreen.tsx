import { useState } from "react";
import { BadgeCheck, Check, Crown, Loader2, RefreshCw, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";
import { PLANS, type PlanId } from "@/lib/plans";
import { payForPlan } from "@/lib/razorpay";
import { haptic } from "@/lib/haptics";
import type { useBilling } from "@/lib/billing";

type Billing = ReturnType<typeof useBilling>;

export function PlansScreen({
  billing,
  onSubscribed,
}: {
  billing: Billing;
  onSubscribed: () => void;
}) {
  const [busy, setBusy] = useState<PlanId | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [failed, setFailed] = useState<{ planId: PlanId; message: string } | null>(null);

  const active = billing.plan;

  async function subscribe(planId: PlanId) {
    haptic.tap();
    setFailed(null);
    setBusy(planId);
    const res = await payForPlan(planId, {
      onVerifying: () => setVerifying(true),
      onDismiss: () => setVerifying(false),
    });
    setVerifying(false);
    setBusy(null);

    if (!res.ok) {
      haptic.error();
      setFailed({ planId, message: res.message });
      toast.error("Payment not completed", { description: res.message });
      return;
    }

    const plan = PLANS.find((p) => p.id === planId)!;
    billing.activatePlan(planId);
    haptic.success();
    toast.success(`Welcome to the ${plan.name} Plan 🎉`, {
      description: `${plan.credits} fresh leads unlocked every day.`,
    });
    billing.refresh();
    onSubscribed();
  }

  return (
    <>
      <div>
        <h1 className="text-[24px] font-extrabold">Plans &amp; Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Daily lead credits, reset every midnight. Cancel or change any time.
        </p>
      </div>

      {verifying && (
        <div className="card-soft flex items-center gap-3 p-4">
          <Loader2 className="size-5 animate-spin text-primary" />
          <p className="text-sm font-semibold">Confirming your payment…</p>
        </div>
      )}

      {failed && (
        <div className="card-soft space-y-3 border-destructive/30 p-4">
          <p className="text-sm font-bold text-destructive">Payment didn&apos;t go through</p>
          <p className="text-[13px] text-muted-foreground">{failed.message}</p>
          <button
            type="button"
            onClick={() => void subscribe(failed.planId)}
            className="press flex items-center gap-2 rounded-full bg-primary/12 px-4 py-2.5 text-xs font-bold text-primary"
          >
            <RefreshCw className="size-3.5" /> Try Again
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {PLANS.map((plan) => {
          const isActive = active?.id === plan.id;
          const label = !active
            ? "Subscribe"
            : isActive
              ? "Current Plan"
              : plan.price > active.price
                ? "Upgrade"
                : "Downgrade";
          return (
            <section
              key={plan.id}
              className={`card-soft relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-0.5 ${
                isActive ? "border-primary/50 ring-1 ring-primary/25" : ""
              }`}
            >
              {plan.popular && !isActive && (
                <span className="absolute right-4 top-4 rounded-full bg-primary/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                  Most Popular
                </span>
              )}
              {isActive && (
                <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-primary/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                  <BadgeCheck className="size-3" /> Active
                </span>
              )}

              <span className="grid size-10 place-items-center rounded-xl bg-primary/12">
                {plan.id === "legend" ? (
                  <Crown className="size-5 text-primary" />
                ) : plan.id === "pro" ? (
                  <Zap className="size-5 text-primary" />
                ) : (
                  <ShieldCheck className="size-5 text-primary" />
                )}
              </span>

              <h2 className="mt-3 text-[19px] font-extrabold">{plan.name}</h2>
              <p className="mt-0.5 text-[26px] font-extrabold leading-none">
                ₹{plan.price}
                <span className="text-[13px] font-semibold text-muted-foreground">/month</span>
              </p>
              <p className="mt-2 text-[14px] font-bold text-primary">
                {plan.credits} fresh leads every day
              </p>

              <ul className="mt-3 space-y-2">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-[13px] text-foreground/85">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    {perk}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled={isActive || busy !== null}
                onClick={() => void subscribe(plan.id)}
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-extrabold transition-all disabled:opacity-70 ${
                  isActive ? "press bg-secondary text-muted-foreground" : "btn-glow"
                }`}
              >
                {busy === plan.id && <Loader2 className="size-4 animate-spin" />}
                {busy === plan.id ? "Opening checkout…" : label}
              </button>
            </section>
          );
        })}
      </div>

      <p className="text-center text-[11px] text-muted-foreground">
        Payments are processed securely by Razorpay in test mode.
      </p>
    </>
  );
}
