'use client';

import { BrainCircuit, CheckCircle2, CircleAlert, Layers3 } from 'lucide-react';
import { OperationalScreen, type OperationalConfig } from '@/components/operational-screen';

const config: OperationalConfig = {
  title: 'Allocation Proposal Review', description: 'Review AI-assisted student-to-campus and batch placements before publishing', role: 'Super Admin', primaryAction: 'Approve Selected',
  metrics: [
    { label: 'Proposed Allocations', value: '1,086', change: '14.2%', icon: BrainCircuit, tone: 'blue' },
    { label: 'High Confidence', value: '924', change: '11.8%', icon: CheckCircle2, tone: 'green' },
    { label: 'Needs Review', value: '126', change: '3.6%', icon: CircleAlert, tone: 'amber' },
    { label: 'Unallocated', value: '36', change: '1.2%', icon: Layers3, tone: 'violet' },
  ],
  panelTitle: 'Student Allocation Proposals', panelSubtitle: 'Ranked by preference, location, eligibility and available capacity', columns: ['Student', 'Preferred Course', 'Proposed Campus', 'Batch'], filterLabels: ['Region', 'Course', 'Confidence'],
  rows: [
    { id: 'a1', cells: ['Ayesha Khan · STU-00564', 'Web Development', 'Iqbal Town Campus', 'WD-11 Morning'], status: 'Approved', score: 96 },
    { id: 'a2', cells: ['M. Rehan · STU-00621', 'Graphic Design', 'Gulshan Campus', 'GD-09 Evening'], status: 'Review', score: 82 },
    { id: 'a3', cells: ['Sana Naveed · STU-00695', 'Digital Marketing', 'Lahore Township', 'DM-10 Evening'], status: 'Pending', score: 88 },
    { id: 'a4', cells: ['Zain Ali · STU-00712', 'Cyber Security', 'Faisalabad Campus', 'CS-04 Weekend'], status: 'Review', score: 74 },
    { id: 'a5', cells: ['Noor Malik · STU-00677', 'UI/UX Design', 'Nazimabad Campus', 'UX-06 Morning'], status: 'Approved', score: 91 },
  ],
  insights: [
    { title: 'Capacity opportunity', text: 'Moving 18 proposals to evening batches improves utilization by 6%.' },
    { title: 'Preference match', text: '91% of learners received their first or second campus choice.' },
    { title: 'Conflict warning', text: '12 proposals overlap with an existing active enrollment.' },
  ],
};
export default function AllocationPage() { return <OperationalScreen config={config} />; }
