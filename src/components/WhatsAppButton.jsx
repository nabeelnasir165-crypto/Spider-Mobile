import React from 'react';

// Replace with the real WhatsApp Business mobile number when ready.
// Format: country code + number, no spaces, no leading + (wa.me convention).
const WA_NUMBER = '447700900000';
const WA_MESSAGE = encodeURIComponent("Hi Spider Mobiles, I'd like to ask about a repair.");

export default function WhatsAppButton({ className = '' }) {
  const href = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`fixed right-5 bottom-5 z-40 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5b] text-white shadow-soft-lg grid place-items-center transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-3 ${className}`}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.05 4.91A9.92 9.92 0 0 0 12.02 2C6.5 2 2.02 6.48 2.02 12c0 1.76.46 3.45 1.33 4.95L2 22l5.16-1.35A9.96 9.96 0 0 0 12.02 22h.01c5.52 0 10-4.48 10-10 0-2.67-1.04-5.18-2.98-7.09zM12.03 20.13h-.01a8.16 8.16 0 0 1-4.16-1.14l-.3-.18-3.06.8.82-2.98-.19-.31a8.16 8.16 0 1 1 14.88-4.32 8.16 8.16 0 0 1-8.18 8.13zm4.47-6.11c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.13-.16.25-.63.79-.77.95-.14.16-.28.18-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.28.37-.42.12-.14.16-.24.25-.4.08-.16.04-.31-.02-.43-.06-.12-.55-1.33-.75-1.82-.2-.48-.4-.42-.55-.43h-.47c-.16 0-.43.06-.66.31-.23.25-.86.84-.86 2.04 0 1.2.88 2.36 1 2.52.12.16 1.74 2.66 4.21 3.73.59.25 1.05.41 1.41.52.59.19 1.12.16 1.55.1.47-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z"/>
      </svg>
    </a>
  );
}
