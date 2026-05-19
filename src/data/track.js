// Mock repair lookup
const mockTickets = {
  'SM-2451': {
    id: 'SM-2451',
    device: 'iPhone 14 Pro · Deep Purple',
    issue: 'Screen replacement (OEM)',
    customer: 'O. Pearson',
    eta: 'Ready by 4:30 PM today',
    stage: 3,
  },
  'SM-2469': {
    id: 'SM-2469',
    device: 'Galaxy S23 Ultra',
    issue: 'Battery replacement',
    customer: 'D. Reed',
    eta: 'Ready tomorrow 11:00 AM',
    stage: 2,
  },
  '07700900111': {
    id: 'SM-2484',
    device: 'iPhone 13',
    issue: 'Charging port repair',
    customer: 'H. Marsh',
    eta: 'Awaiting customer approval',
    stage: 1,
  },
};

export const stages = [
  { key: 'received', label: 'Device Received', desc: 'Booked in and diagnostics scheduled.' },
  { key: 'diagnosed', label: 'Diagnosed & Quoted', desc: 'Repair confirmed, parts allocated.' },
  { key: 'in-repair', label: 'In Repair', desc: 'Certified technician working on your device.' },
  { key: 'qc', label: 'Quality Check', desc: '15-point QC + waterproof reseal test.' },
  { key: 'ready', label: 'Ready for Collection', desc: 'Tested, sanitised and ready to pick up.' },
];

export const lookupTicket = (ref) => {
  const key = String(ref || '').trim().toUpperCase();
  return mockTickets[key] || mockTickets[ref] || null;
};
