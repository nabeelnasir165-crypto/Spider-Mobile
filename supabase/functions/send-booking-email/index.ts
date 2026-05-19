// Supabase Edge Function: send-booking-email
// ----------------------------------------------------------------------------
// Sends a branded booking-confirmation email via the SMTP credentials you've
// stored as Supabase secrets. Designed to be safe to fail — if SMTP is not yet
// configured, the booking is still saved (the front-end calls this with
// .invoke() and catches errors).
// ----------------------------------------------------------------------------
//
// Required Supabase secrets (set via: `supabase secrets set KEY=value`):
//   SMTP_HOST       e.g. smtp.gmail.com  / smtp.zoho.eu / mail.spidermobiles.co.uk
//   SMTP_PORT       e.g. 587 (STARTTLS) or 465 (SSL)
//   SMTP_USERNAME   e.g. hello@spidermobiles.co.uk
//   SMTP_PASSWORD   the SMTP password / app password
//   SMTP_FROM       "Spider Mobiles Derby <hello@spidermobiles.co.uk>"
//   SMTP_TLS        "true" for port 465, "false" for 587 (default false)
//
// Deploy with:   supabase functions deploy send-booking-email
// ----------------------------------------------------------------------------

// @ts-ignore Deno provides this at runtime
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
// @ts-ignore
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Payload {
  booking_ref: string;
  customer_email: string;
  customer_name: string;
  device: string;
  issue: string;
  requested_date: string;
  quote_min?: number;
  quote_max?: number;
  eta?: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const p = (await req.json()) as Payload;

    const host = Deno.env.get('SMTP_HOST');
    const port = Number(Deno.env.get('SMTP_PORT') || 587);
    const username = Deno.env.get('SMTP_USERNAME');
    const password = Deno.env.get('SMTP_PASSWORD');
    const from = Deno.env.get('SMTP_FROM') || username || '';
    const tls = (Deno.env.get('SMTP_TLS') || 'false').toLowerCase() === 'true';

    if (!host || !username || !password) {
      return new Response(
        JSON.stringify({ ok: false, error: 'SMTP secrets not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const client = new SMTPClient({
      connection: { hostname: host, port, tls, auth: { username, password } },
    });

    const requested = new Date(p.requested_date).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' });
    const price = p.quote_min && p.quote_max ? `£${p.quote_min} – £${p.quote_max}` : 'To be quoted on arrival';

    await client.send({
      from,
      to: p.customer_email,
      subject: `Booking confirmed · ${p.booking_ref} · Spider Mobiles Derby`,
      content: 'auto',
      html: renderHtml(p, requested, price),
    });

    await client.close();
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function renderHtml(p: Payload, requested: string, price: string) {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f7f8fa;font-family:Inter,Helvetica,Arial,sans-serif;color:#13161c;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f8fa;">
      <tr><td align="center" style="padding:32px 16px;">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(15,23,42,.06);">
          <tr><td style="padding:32px 32px 24px;background:linear-gradient(135deg,#0a0c11 0%,#066698 65%,#0EA5E9 100%);color:#fff;">
            <p style="margin:0;font-size:11px;letter-spacing:.18em;text-transform:uppercase;opacity:.7;">Spider Mobiles · Derby</p>
            <h1 style="margin:8px 0 0;font-size:28px;font-weight:700;letter-spacing:-.02em;">Booking confirmed</h1>
            <p style="margin:14px 0 0;font-size:14px;opacity:.8;">Hi ${escape(p.customer_name)}, we've booked your repair.</p>
          </td></tr>

          <tr><td style="padding:28px 32px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;line-height:1.5;">
              <tr><td style="padding:10px 0;border-bottom:1px solid #eef0f4;color:#6b7385;">Booking ref</td>
                  <td style="padding:10px 0;border-bottom:1px solid #eef0f4;text-align:right;font-weight:700;">${escape(p.booking_ref)}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #eef0f4;color:#6b7385;">Device</td>
                  <td style="padding:10px 0;border-bottom:1px solid #eef0f4;text-align:right;">${escape(p.device)}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #eef0f4;color:#6b7385;">Service</td>
                  <td style="padding:10px 0;border-bottom:1px solid #eef0f4;text-align:right;">${escape(p.issue)}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #eef0f4;color:#6b7385;">Requested</td>
                  <td style="padding:10px 0;border-bottom:1px solid #eef0f4;text-align:right;">${escape(requested)}</td></tr>
              <tr><td style="padding:10px 0;color:#6b7385;">Estimated price</td>
                  <td style="padding:10px 0;text-align:right;font-weight:700;color:#0EA5E9;">${escape(price)}</td></tr>
            </table>

            <div style="margin-top:24px;padding:14px 16px;background:#ecfaff;border:1px solid #cef3ff;border-radius:12px;color:#0b557b;font-size:13px;">
              <strong>What happens next?</strong><br>
              Bring your device to our Derby store (24 St Peter's Street, DE1) at the time above.
              Most fixes are completed in 30–60 minutes while you wait.
            </div>

            <p style="margin:24px 0 0;font-size:14px;color:#4a5160;line-height:1.6;">
              Need to change anything? Just reply to this email or call us on <strong>01332 000 000</strong>.<br>
              Track your repair anytime at <a href="https://spidermobiles.co.uk/track?ref=${encodeURIComponent(p.booking_ref)}" style="color:#0EA5E9;text-decoration:none;font-weight:600;">spidermobiles.co.uk/track</a>.
            </p>
          </td></tr>

          <tr><td style="padding:20px 32px;background:#f7f8fa;border-top:1px solid #eef0f4;font-size:12px;color:#8e96a8;text-align:center;">
            12-month warranty · No-fix, no-fee · Certified technicians<br>
            <span style="font-size:11px;">© ${new Date().getFullYear()} Spider Mobiles Derby</span>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function escape(s: string) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]!));
}
