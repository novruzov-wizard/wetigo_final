import { loadStripe, type Stripe } from '@stripe/stripe-js';

/**
 * Stripe integration layer.
 *
 * To go live:
 * 1. Add your publishable key to a `.env` file:
 *      VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
 * 2. Map each plan to a Stripe Price ID (created in the Stripe Dashboard) below.
 * 3. Stand up a tiny backend endpoint that creates a Checkout Session and
 *    returns its id (see `createCheckoutSession`), then this file redirects to it.
 *
 * Until those are set, `startCheckout` returns `false` and the app falls back
 * to the in-app payment screen so the flow is always demoable.
 */

const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

// plan id -> Stripe Price ID (fill these in from your Stripe Dashboard)
export const STRIPE_PRICE_IDS: Record<string, { month?: string; year?: string }> = {
  pro: { month: '', year: '' },
  business: { month: '', year: '' },
};

let stripePromise: Promise<Stripe | null> | null = null;
export function getStripe() {
  if (!PUBLISHABLE_KEY) return null;
  if (!stripePromise) stripePromise = loadStripe(PUBLISHABLE_KEY);
  return stripePromise;
}

export const stripeConfigured = Boolean(PUBLISHABLE_KEY);

/**
 * Kick off a real Stripe Checkout redirect. Returns true if it started,
 * false if Stripe isn't configured yet (caller should fall back to the
 * in-app payment page).
 */
export async function startCheckout(planId: string, cycle: 'month' | 'year'): Promise<boolean> {
  const stripe = getStripe();
  const priceId = STRIPE_PRICE_IDS[planId]?.[cycle];
  if (!stripe || !priceId) return false;

  // Your backend creates the session and returns { id }.
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, planId, cycle }),
  });
  const { id } = await res.json();
  const { error } = await stripe.redirectToCheckout({ sessionId: id });
  if (error) throw error;
  return true;
}
