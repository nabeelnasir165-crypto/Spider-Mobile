// Supabase Edge Function: create a Stripe Checkout Session for a Spider
// Mobiles order, return the hosted-checkout URL. The client redirects to
// that URL; Stripe sends the customer back to /order/:id on success.
//
// Activate by setting STRIPE_SECRET_KEY in the project's Edge Function
// secrets (Supabase Dashboard → Project Settings → Functions → Secrets).
// Deploy with:
//   supabase functions deploy create-checkout-session --no-verify-jwt
//
// Request body (JSON):
//   {
//     order_ref:      string,
//     customer_email: string,
//     items: [{ name, qty, price }],
//     delivery_fee:   number,
//     success_origin: string,   // window.location.origin
//   }
// Response: { url: string }

// deno-lint-ignore-file no-explicit-any
import Stripe from 'https://esm.sh/stripe@14?target=deno';

const STRIPE_SECRET = Deno.env.get('STRIPE_SECRET_KEY');
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST')    return new Response('Method not allowed', { status: 405, headers: CORS });
  if (!STRIPE_SECRET) {
    return new Response(
      JSON.stringify({ error: 'STRIPE_SECRET_KEY not configured. The checkout is in demo mode.' }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } },
    );
  }

  let payload: any;
  try { payload = await req.json(); }
  catch { return new Response('Bad JSON', { status: 400, headers: CORS }); }

  const { order_ref, customer_email, items = [], delivery_fee = 0, success_origin } = payload;
  if (!order_ref || !success_origin || !Array.isArray(items) || items.length === 0) {
    return new Response('Missing required fields', { status: 400, headers: CORS });
  }

  const stripe = new Stripe(STRIPE_SECRET, { apiVersion: '2024-06-20' });

  // Stripe wants line items in minor units (pence). Round to nearest penny.
  const lineItems = items.map((it: any) => ({
    quantity: it.qty || 1,
    price_data: {
      currency: 'gbp',
      unit_amount: Math.round((Number(it.price) || 0) * 100),
      product_data: { name: it.name, images: it.image ? [it.image] : [] },
    },
  }));

  if (delivery_fee > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: 'gbp',
        unit_amount: Math.round(delivery_fee * 100),
        product_data: { name: 'Delivery' },
      },
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email,
      line_items: lineItems,
      success_url: `${success_origin}/order/${order_ref}?stripe_status=paid`,
      cancel_url:  `${success_origin}/checkout?stripe_status=cancelled`,
      metadata: { order_ref },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[stripe] session create failed:', err.message);
    return new Response(
      JSON.stringify({ error: err.message || 'Stripe session creation failed' }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } },
    );
  }
});
