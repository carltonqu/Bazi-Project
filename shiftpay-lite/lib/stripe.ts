import Stripe from "stripe";

// Lazy singleton — only instantiated when actually called (not at build time)
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return _stripe;
}

// Named export kept for convenience
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    priceId: null as string | null,
    description: "Perfect for getting started",
    features: [
      "Up to 5 employees",
      "Basic scheduling",
      "Time tracking",
      "Email support",
    ],
  },
  PRO: {
    name: "Pro",
    price: 29,
    priceId: (process.env.STRIPE_PRO_PRICE_ID ?? null) as string | null,
    description: "For growing teams",
    features: [
      "Up to 50 employees",
      "Advanced scheduling",
      "Payroll management",
      "GPS attendance tracking",
      "Reports & analytics",
      "Priority support",
    ],
  },
  ADVANCED: {
    name: "Advanced",
    price: 79,
    priceId: (process.env.STRIPE_ADVANCED_PRICE_ID ?? null) as string | null,
    description: "Enterprise-grade workforce management",
    features: [
      "Unlimited employees",
      "All Pro features",
      "Multi-location support",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
    ],
  },
} as const;
