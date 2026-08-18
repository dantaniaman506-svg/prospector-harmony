import { createServerFn } from "@tanstack/react-start";

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .inputValidator((data: { planId: string }) => data)
  .handler(async ({ data }) => {
    const { createOrder } = await import("./payments.server");
    return createOrder(String(data?.planId ?? ""));
  });

export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      planId: string;
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { verifySignature, fetchPaymentStatus, planById } = await import("./payments.server");

    const orderId = String(data?.razorpay_order_id ?? "");
    const paymentId = String(data?.razorpay_payment_id ?? "");
    const signature = String(data?.razorpay_signature ?? "");
    const plan = planById(String(data?.planId ?? ""));

    if (!plan || !orderId || !paymentId || !signature) {
      return { ok: false as const, message: "Payment details were incomplete." };
    }

    if (!verifySignature(orderId, paymentId, signature)) {
      return { ok: false as const, message: "Payment signature could not be verified." };
    }

    const payment = await fetchPaymentStatus(paymentId);
    if (!payment) {
      return { ok: false as const, message: "Couldn't confirm this payment with Razorpay." };
    }
    if (payment.order_id !== orderId) {
      return { ok: false as const, message: "This payment does not belong to your order." };
    }
    if (!["captured", "authorized"].includes(String(payment.status))) {
      return { ok: false as const, message: `Payment status is "${payment.status}".` };
    }
    if (Number(payment.amount) !== plan.price * 100) {
      return { ok: false as const, message: "Paid amount did not match the plan price." };
    }

    return { ok: true as const, planId: plan.id, message: "" };
  });
