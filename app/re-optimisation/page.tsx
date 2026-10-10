'use client';

import { BrainCircuit, CircleAlert, RefreshCw, Sparkles } from 'lucide-react';
import { OperationalScreen, type OperationalConfig } from '@/components/operational-screen';

const config: OperationalConfig = {
  title: 'Batch Re-optimisation', description: 'Consolidate low-fill batches and improve campus capacity utilization', role: 'Admin', primaryAction: 'Run Optimisation',
  metrics: [
    { label: 'Candidate Batches', value: '48', change: '8.4%', icon: RefreshCw, tone: 'blue' },
    { label: 'Recoverable Seats', value: '312', change: '15.1%', icon: Sparkles, tone: 'green' },
    { label: 'Learners Impacted', value: '184', change: '4.2%', icon: CircleAlert, tone: 'amber' },
    { label: 'Projected Utilization', value: '89%', change: '7.6%', icon: BrainCircuit, tone: 'violet' },
  ],
  panelTitle: 'Optimisation Proposals', panelSubtitle: 'Suggested moves preserve course, gender and timing preferences', columns: ['Source Batch', 'Recommendation', 'Destination', 'Impact'], filterLabels: ['Region', 'Course', 'Risk'],
  rows: [
    { id: 'r1', cells: ['WD-14 Morning · 11/30', 'Merge', 'WD-11 Morning', '11 learners · +18% fill'], status: 'Approved', score: 96 },
    { id: 'r2', cells: ['GD-12 Evening · 9/30', 'Merge', 'GD-09 Evening', '9 learners · +14% fill'], status: 'Review', score: 88 },
    { id: 'r3', cells: ['DM-15 Weekend · 8/30', 'Move timing', 'DM-10 Evening', '8 learners · +12% fill'], status: 'Pending', score: 81 },
    { id: 'r4', cells: ['UX-08 Morning · 13/30', 'Consolidate', 'UX-06 Morning', '13 learners · +21% fill'], status: 'Review', score: 84 },
    { id: 'r5', cells: ['CS-07 Weekend · 15/30', 'Keep open', 'No move', 'Waitlist forecast +12'], status: 'Healthy', score: 92 },
  ],
  insights: [
    { title: 'Best scenario', text: 'Approving the top 3 proposals recovers 84 seats with no campus change.' },
    { title: 'Learner protection', text: 'All proposals keep commute changes under 20 minutes.' },
    { title: 'Timing constraint', text: '14 learners cannot move because their alternative timing is unavailable.' },
  ],
};
export default function ReoptimisationPage() { return <OperationalScreen config={config} />; }
