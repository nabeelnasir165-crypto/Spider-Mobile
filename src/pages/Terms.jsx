import React from 'react';
import PageHeader from '../components/PageHeader';

const sections = [
  {
    h: '1. Repair service',
    p: 'When you book a repair you authorise us to assess, open and repair your device. We use OEM-grade parts and certified technicians. Our diagnostic check is free; you only pay if you approve the quoted repair.',
  },
  {
    h: '2. No-fix, no-fee',
    p: 'If we cannot fix your device you do not pay. Unrepairable devices are returned in the same condition we received them.',
  },
  {
    h: '3. Warranty',
    p: 'All repairs and refurbished phones include a 12-month return-to-base warranty against defects in workmanship and parts. The warranty does not cover new damage caused after the repair (drops, water, unauthorised tampering).',
  },
  {
    h: '4. Refurbished phones',
    p: 'Refurbished devices are tested across 40+ points and graded honestly. Photos are representative; minor cosmetic marks consistent with the stated grade are normal. 14-day no-questions return policy.',
  },
  {
    h: '5. Accessories',
    p: 'Accessories are sold new with the manufacturer&rsquo;s warranty. Faulty items can be returned within 30 days for a refund or exchange.',
  },
  {
    h: '6. Data and privacy',
    p: 'You are responsible for backing up data before any repair where possible. We do not access or copy personal content. See our Privacy Policy for details.',
  },
  {
    h: '7. Unclaimed devices',
    p: 'Devices left more than 90 days after completion may be sold to recover storage and repair costs. We will make reasonable attempts to contact you first.',
  },
  {
    h: '8. Liability',
    p: 'Our liability is limited to the amount paid for the repair or product. We are not liable for indirect or consequential loss.',
  },
  {
    h: '9. Governing law',
    p: 'These terms are governed by the laws of England and Wales. Any disputes will be resolved in the courts of England and Wales.',
  },
];

export default function Terms() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        subtitle="Last updated: May 2026. These terms cover repairs, refurbished phone sales and accessories purchased from Spider Mobiles Derby."
      />
      <section className="pb-24 bg-white">
        <div className="container-page max-w-3xl">
          <div className="space-y-8">
            {sections.map((s) => (
              <div key={s.h}>
                <h2 className="text-xl font-semibold text-ink-950 mb-3">{s.h}</h2>
                <p className="text-ink-600 leading-relaxed">{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
