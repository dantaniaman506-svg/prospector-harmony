export type PlanId = "starter" | "pro" | "legend";

export type Plan = {
  id: PlanId;
  name: string;
  price: number;
  credits: number;
  popular?: boolean;
  perks: string[];
};

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 499,
    credits: 15,
    perks: [
      "No-website businesses only",
      "Name, phone, email & socials",
      "Google Maps link on every lead",
      "Credits reset every midnight",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 799,
    credits: 22,
    popular: true,
    perks: [
      "No-website businesses only",
      "Name, phone, email & socials",
      "Random-city discovery mode",
      "CSV export of every run",
    ],
  },
  {
    id: "legend",
    name: "Legend",
    price: 1299,
    credits: 35,
    perks: [
      "Highest daily lead volume",
      "Name, phone, email & socials",
      "Random-city discovery mode",
      "Priority automation queue",
    ],
  },
];

export function getPlan(id: PlanId | null): Plan | null {
  return PLANS.find((p) => p.id === id) ?? null;
}

