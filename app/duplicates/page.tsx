'use client';

import { CopyCheck, Fingerprint, ShieldAlert, UsersRound } from 'lucide-react';
import { OperationalScreen, type OperationalConfig } from '@/components/operational-screen';

const config: OperationalConfig = {
  title: 'Duplicate Resolution', description: 'Compare and safely merge possible duplicate learner profiles', role: 'Super Admin', primaryAction: 'Merge Selected',
  metrics: [
    { label: 'Potential Duplicates', value: '84', change: '6.2%', icon: UsersRound, tone: 'blue' },
    { label: 'High Confidence', value: '31', change: '9.1%', icon: Fingerprint, tone: 'amber' },
    { label: 'Resolved This Week', value: '126', change: '18.4%', icon: CopyCheck, tone: 'green' },
    { label: 'Protected Records', value: '12', change: '1.8%', icon: ShieldAlert, tone: 'violet' },
  ],
  panelTitle: 'Possible Duplicate Pairs', panelSubtitle: 'Match confidence is based on CNIC, phone, email and name similarity', columns: ['Primary Profile', 'Possible Duplicate', 'Matching Fields', 'Last Activity'], filterLabels: ['Confidence', 'Campus', 'Source'],
  rows: [
    { id: 'd1', cells: ['Hassan Ali · STU-01234', 'Hasan Ali · STU-10482', 'CNIC · Phone · 96% name', 'May 22'], status: 'Review', score: 98 },
    { id: 'd2', cells: ['Ayesha Khan · STU-00564', 'Ayesha A. Khan · STU-09318', 'Phone · Email · 92% name', 'May 20'], status: 'Review', score: 94 },
    { id: 'd3', cells: ['M. Bilal · STU-00845', 'Muhammad Bilal · STU-08847', 'CNIC · 88% name', 'May 18'], status: 'Pending', score: 91 },
    { id: 'd4', cells: ['Zainab Fatima · STU-00912', 'Z. Fatima · STU-08221', 'Phone · 84% name', 'May 17'], status: 'Review', score: 86 },
    { id: 'd5', cells: ['Noor Malik · STU-00677', 'Noor M. · STU-06172', 'Email · 79% name', 'May 12'], status: 'Pending', score: 78 },
  ],
  insights: [
    { title: 'Safe merge', text: '31 pairs match on verified CNIC and can be reviewed first.' },
    { title: 'Enrollment protection', text: '12 pairs include active enrollments in both profiles and require manual review.' },
    { title: 'Recommended primary', text: 'Keep the profile with the latest verified contact and attendance history.' },
  ],
};
export default function DuplicatesPage() { return <OperationalScreen config={config} />; }
