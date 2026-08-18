import { createRazorpayOrder, verifyRazorpayPayment } from "./payments.functions";
import type { PlanId } from "./plans";

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  order_id: string;
  amount?: number;
  currency?: string;
  name: string;
  description: string;
  theme?: { color?: string };
  prefill?: { name?: string; email?: string; contact?: string };
  handler: (r: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
};

type RazorpayCtor = new (o: RazorpayOptions) => { open: () => void };

const SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

function loadScript(): Promise<RazorpayCtor> {
  const win = window as unknown as { Razorpay?: RazorpayCtor };
  if (win.Razorpay) return Promise.resolve(win.Razorpay);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT}"]`);
    const el = existing ?? document.createElement("script");
    el.src = SCRIPT;
    el.async = true;
    el.addEventListener("load", () =>
      win.Razorpay ? resolve(win.Razorpay) : reject(new Error("Checkout unavailable")),
    );
    el.addEventListener("error", () => reject(new Error("Could not load Razorpay Checkout")));
    if (!existing) document.body.appendChild(el);
  });
}

/**
 * Full subscription purchase. Order creation, amount and signature verification
 * all happen server-side — the browser only ever sees the publishable Key ID.
 */
export async function payForPlan(
  planId: PlanId,
  hooks: { onVerifying: () => void; onDismiss: () => void },
): Promise<{ ok: true } | { ok: false; message: string }> {
  let order: Awaited<ReturnType<typeof createRazorpayOrder>>;
  try {
    order = await createRazorpayOrder({ data: { planId } });
  } catch {
    return { ok: false, message: "Couldn't start the payment. Please try again." };
  }
  if (!order.ok) return { ok: false, message: order.message };

  let Razorpay: RazorpayCtor;
  try {
    Razorpay = await loadScript();
  } catch {
    return { ok: false, message: "Razorpay Checkout could not load. Check your connection." };
  }

  return new Promise((resolve) => {
    const rzp = new Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: "AirLeads AI",
      description: `${order.planName} plan subscription`,
      theme: { color: "#f97316" },
      prefill: {},
      modal: {
        ondismiss: () => {
          hooks.onDismiss();
          resolve({ ok: false, message: "Payment cancelled before it finished." });
        },
      },
      handler: (r) => {
        hooks.onVerifying();
        void (async () => {
          try {
            const res = await verifyRazorpayPayment({ data: { planId, ...r } });
            if (!res.ok) {
              resolve({ ok: false, message: res.message });
              return;
            }
            resolve({ ok: true });
          } catch {
            resolve({
              ok: false,
              message: "Payment went through but verification failed. Contact support.",
            });
          }
        })();
      },
    });
    rzp.open();
  });
}
