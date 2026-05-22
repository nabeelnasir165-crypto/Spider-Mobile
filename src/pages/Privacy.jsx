import React from 'react';
import PageHeader from '../components/PageHeader';

const sections = [
  {
    h: '1. Who we are',
    p: 'Spider Mobiles Derby ("we", "us") operates this website at spidermobiles.co.uk and our retail store at 835 Osmaston Road, Derby. For any privacy questions, email hello@spidermobiles.co.uk.',
  },
  {
    h: '2. Information we collect',
    p: 'When you book a repair or buy a product we collect your name, contact details and device information. When you browse the site we collect anonymous analytics (page visits, device type) only if you accept cookies.',
  },
  {
    h: '3. How we use your data',
    p: 'We use it to deliver the service you asked for (your repair, your order, your warranty), to contact you about it, and to improve the site. We never sell your data and we never read the contents of your device.',
  },
  {
    h: '4. Cookies',
    p: 'Essential cookies keep the site running. Optional analytics cookies (Google Analytics) help us understand which pages are useful. You can decline these via the cookie banner.',
  },
  {
    h: '5. Data retention',
    p: 'Repair records are kept for 12 months to honour your warranty. Order records are kept for 6 years for tax compliance. Anything else is deleted when no longer needed.',
  },
  {
    h: '6. Your rights',
    p: 'Under UK GDPR you can ask us for a copy of your data, to correct it, or to delete it. Email hello@spidermobiles.co.uk and we&rsquo;ll respond within 30 days.',
  },
  {
    h: '7. Third parties',
    p: 'We use a small set of trusted providers — payment processing (Stripe), email (Resend), analytics (Google) and hosting. They process data on our behalf under strict agreements.',
  },
  {
    h: '8. Changes',
    p: 'We may update this policy. Material changes will be announced on this page; the date below shows the last update.',
  },
];

export default function Privacy() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="Last updated: May 2026. The short version: we collect the minimum we need to fix your phone or process your order, we never sell your data, and we never look inside your device."
      />
      <section className="pb-24 bg-white">
        <div className="container-page max-w-3xl">
          <div className="prose-content space-y-8">
            {sections.map((s) => (
              <div key={s.h}>
                <h2 className="text-xl font-semibold text-ink-950 mb-3">{s.h}</h2>
                <p className="text-ink-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: s.p }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
