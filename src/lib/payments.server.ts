import { createHmac, timingSafeEqual } from "crypto";
import { PLANS, type PlanId } from "./plans";

/** Server-only Razorpay helpers. The key secret never leaves this module. */
function creds() {
  const keyId = process.env["RAZORPAY_KEY_ID"] ?? "";
  const keySecret = process.env["RAZORPAY_KEY_SECRET"] ?? "";
  return { keyId, keySecret, configured: !!keyId && !!keySecret };
}

export function planById(planId: string): (typeof PLANS)[number] | null {
  return PLANS.find((p) => p.id === (planId as PlanId)) ?? null;
}

export async function createOrder(planId: string) {
  const { keyId, keySecret, configured } = creds();
  const plan = planById(planId);
  if (!plan) return { ok: false as const, message: "Unknown plan selected." };
  if (!configured) {
    return {
      ok: false as const,
      message: "Payments are not configured yet. Add your Razorpay test keys to enable checkout.",
    };
  }

  // Amount is derived on the server from our own price list — never from the client.
  const amount = plan.price * 100;

  try {
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt: `airleads-${plan.id}-${Date.now()}`,
        notes: { planId: plan.id, planName: plan.name },
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      id?: string;
      amount?: number;
      currency?: string;
      error?: { description?: string };
    };
    if (!res.ok || !data.id) {
      return {
        ok: false as const,
        message:
          data.error?.description || `Razorpay refused to create the order (${res.status}).`,
      };
    }
    return {
      ok: true as const,
      orderId: data.id,
      amount: data.amount ?? amount,
      currency: data.currency ?? "INR",
      keyId,
      planName: plan.name,
    };
  } catch {
    return { ok: false as const, message: "Couldn't reach Razorpay. Please try again." };
  }
}

export function verifySignature(orderId: string, paymentId: string, signature: string) {
  const { keySecret, configured } = creds();
  if (!configured) return false;
  const expected = createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Confirms with Razorpay that the payment really is captured/authorized. */
export async function fetchPaymentStatus(paymentId: string) {
  const { keyId, keySecret } = creds();
  try {
    const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}` },
    });
    const data = (await res.json().catch(() => ({}))) as {
      status?: string;
      order_id?: string;
      amount?: number;
    };
    return res.ok ? data : null;
  } catch {
    return null;
  }
}
