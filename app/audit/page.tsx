'use client';

import { FileClock, Fingerprint, ShieldCheck, UserCheck } from 'lucide-react';
import { OperationalScreen, type OperationalConfig } from '@/components/operational-screen';

const config: OperationalConfig = {
  title: 'Audit & Activity Log', description: 'Trace sensitive actions across users, campuses and workflows', role: 'Super Admin', primaryAction: 'Export Audit Log',
  metrics: [
    { label: 'Events Today', value: '2,418', change: '7.2%', icon: FileClock, tone: 'blue' },
    { label: 'Admin Actions', value: '86', change: '4.0%', icon: ShieldCheck, tone: 'violet' },
    { label: 'Verified Events', value: '99.8%', change: '1.1%', icon: Fingerprint, tone: 'green' },
    { label: 'Review Flags', value: '12', change: '2.4%', icon: UserCheck, tone: 'amber' },
  ],
  panelTitle: 'System Activity', panelSubtitle: 'Immutable demo log of important user and workflow changes', columns: ['Actor', 'Action', 'Resource', 'Timestamp'], filterLabels: ['Event Type', 'Role', 'Campus'],
  rows: [
    { id: 'u1', cells: ['Ahmad Saeed · Super Admin', 'Approved allocation run', 'ALLOC-2025-0518', 'Today, 11:42 AM'], status: 'Complete', score: 100 },
    { id: 'u2', cells: ['Maham Shahid · Coordinator', 'Updated student status', 'STU-00987', 'Today, 11:26 AM'], status: 'Complete', score: 100 },
    { id: 'u3', cells: ['System · AI Mapper', 'Flagged invalid records', 'IMP-1048', 'Today, 10:54 AM'], status: 'Review', score: 86 },
    { id: 'u4', cells: ['Sara Nawaz · Teacher', 'Submitted attendance', 'WD-11 / Session 18', 'Today, 10:12 AM'], status: 'Complete', score: 100 },
    { id: 'u5', cells: ['Farah Malik · Regional Manager', 'Changed campus capacity', 'LHR-ITC-02', 'Yesterday, 5:48 PM'], status: 'Pending', score: 92 },
  ],
  insights: [
    { title: 'Security posture', text: 'No critical access anomalies were detected in the last 24 hours.' },
    { title: 'Review pattern', text: '8 of 12 flags came from bulk import corrections.' },
    { title: 'Retention', text: 'Audit data is displayed with a simulated seven-year retention policy.' },
  ],
};
export default function AuditPage() { return <OperationalScreen config={config} />; }
