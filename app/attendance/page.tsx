'use client';

import { CalendarCheck, CheckCircle2, Clock3, UsersRound } from 'lucide-react';
import { OperationalScreen, type OperationalConfig } from '@/components/operational-screen';

const config: OperationalConfig = {
  title: 'Attendance Marking', description: 'Record and review attendance for active batches', role: 'Teacher', userName: 'Sara Nawaz', primaryAction: 'Submit Attendance',
  metrics: [
    { label: 'Enrolled Students', value: '30', change: '3.4%', icon: UsersRound, tone: 'blue' },
    { label: 'Present', value: '25', change: '6.2%', icon: CheckCircle2, tone: 'green' },
    { label: 'Late', value: '2', change: '1.1%', icon: Clock3, tone: 'amber' },
    { label: 'Session Progress', value: '18 / 24', change: '9.0%', icon: CalendarCheck, tone: 'violet' },
  ],
  panelTitle: 'WD-11 Morning · Attendance Register', panelSubtitle: 'May 24, 2025 · Lab 2 · 09:00 AM–12:00 PM', columns: ['Student', 'Student ID', 'Check-in', 'Note'], filterLabels: ['Batch', 'Session', 'Status'],
  rows: [
    { id: 't1', cells: ['Ayesha Khan', 'STU-00564', '08:54 AM', 'On time'], status: 'Present', score: 94 },
    { id: 't2', cells: ['M. Rehan', 'STU-00621', '09:03 AM', 'Manual check-in'], status: 'Present', score: 88 },
    { id: 't3', cells: ['Sana Naveed', 'STU-00695', '09:18 AM', 'Transport delay'], status: 'Late', score: 82 },
    { id: 't4', cells: ['Zain Ali', 'STU-00712', '—', 'Guardian notified'], status: 'Absent', score: 68 },
    { id: 't5', cells: ['Noor Malik', 'STU-00677', '08:58 AM', 'On time'], status: 'Present', score: 91 },
  ],
  insights: [
    { title: 'Attendance trend', text: 'This batch is 4% above the campus attendance average.' },
    { title: 'Risk flag', text: 'Zain Ali has missed 3 consecutive sessions and needs follow-up.' },
    { title: 'Submission check', text: 'Two learner records still need teacher confirmation.' },
  ],
};
export default function AttendancePage() { return <OperationalScreen config={config} />; }
