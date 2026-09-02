'use client';

import { ArrowLeftRight, CheckCircle2, Clock3, MapPinned } from 'lucide-react';
import { OperationalScreen, type OperationalConfig } from '@/components/operational-screen';

const config: OperationalConfig = {
  title: 'Transfer Requests & Options', description: 'Request a different campus, timing or batch and compare available options', role: 'Student', userName: 'Ayesha Khan', primaryAction: 'New Transfer Request',
  metrics: [
    { label: 'Available Options', value: '6', change: '12.5%', icon: MapPinned, tone: 'green' },
    { label: 'Open Request', value: '1', change: '2.0%', icon: ArrowLeftRight, tone: 'blue' },
    { label: 'Average Review', value: '2 days', change: '8.0%', icon: Clock3, tone: 'amber' },
    { label: 'Transfer Fit', value: '94%', change: '6.2%', icon: CheckCircle2, tone: 'violet' },
  ],
  panelTitle: 'Recommended Transfer Options', panelSubtitle: 'Options preserve your Web Development learning progress', columns: ['Campus / Batch', 'Timing', 'Distance', 'Available Seats'], filterLabels: ['Campus', 'Timing', 'Distance'],
  rows: [
    { id: 'x1', cells: ['Johar Town · WD-13', 'Morning · 9:00 AM', '3.2 km', '8 seats'], status: 'Approved', score: 94 },
    { id: 'x2', cells: ['Model Town · WD-08', 'Evening · 5:30 PM', '5.8 km', '12 seats'], status: 'Available', score: 89 },
    { id: 'x3', cells: ['Township · WD-17', 'Morning · 9:30 AM', '7.1 km', '5 seats'], status: 'Available', score: 84 },
    { id: 'x4', cells: ['Wapda Town · WD-05', 'Weekend · 10:00 AM', '9.4 km', '14 seats'], status: 'Review', score: 78 },
    { id: 'x5', cells: ['Iqbal Town · WD-12', 'Evening · 6:00 PM', '1.6 km', 'Waitlist'], status: 'Pending', score: 91 },
  ],
  insights: [
    { title: 'Best match', text: 'Johar Town keeps the same curriculum week and shortens your commute.' },
    { title: 'Progress protection', text: 'All listed options recognize your completed modules.' },
    { title: 'Request status', text: 'Your current timing-change request is awaiting coordinator review.' },
  ],
};
export default function TransfersPage() { return <OperationalScreen config={config} />; }
