'use client';

import { CalendarClock, CheckCircle2, CircleAlert, UsersRound } from 'lucide-react';
import { OperationalScreen, type OperationalConfig } from '@/components/operational-screen';

const config: OperationalConfig = {
  title: 'Student Follow-up Worklist', description: 'Prioritize and resolve learner attendance, fee and document issues', primaryAction: 'Create Follow-up',
  metrics: [
    { label: 'Open Follow-ups', value: '142', change: '6.3%', icon: UsersRound, tone: 'blue' },
    { label: 'High Priority', value: '28', change: '4.8%', icon: CircleAlert, tone: 'amber' },
    { label: 'Due Today', value: '17', change: '8.2%', icon: CalendarClock, tone: 'violet' },
    { label: 'Closed This Week', value: '86', change: '15.7%', icon: CheckCircle2, tone: 'green' },
  ],
  panelTitle: 'Follow-up Queue', panelSubtitle: 'Sorted by urgency and learner risk', columns: ['Student', 'Issue', 'Owner', 'Due'], filterLabels: ['Priority', 'Issue', 'Owner'],
  rows: [
    { id: 'f1', cells: ['Hassan Ali · STU-01234', 'Fee not paid', 'Sara Nawaz', 'Today, 3:00 PM'], status: 'High', score: 92 },
    { id: 'f2', cells: ['Ayesha Khan · STU-00564', 'Attendance below target', 'Ali Mehmood', 'Today, 5:00 PM'], status: 'High', score: 88 },
    { id: 'f3', cells: ['Muhammad Bilal · STU-00845', 'Document pending', 'Maham Shahid', 'Tomorrow'], status: 'Medium', score: 71 },
    { id: 'f4', cells: ['Zainab Fatima · STU-00912', 'Inactive for 7 days', 'Sara Nawaz', 'Tomorrow'], status: 'Review', score: 79 },
    { id: 'f5', cells: ['Laiba Noor · STU-01108', 'Contact not reachable', 'Ali Mehmood', 'May 26'], status: 'Pending', score: 62 },
  ],
  insights: [
    { title: 'Best contact window', text: 'Evening calls have a 34% higher response rate for this queue.' },
    { title: 'Common issue', text: 'Fee reminders account for 38% of current high-priority cases.' },
    { title: 'Suggested bulk action', text: 'Send a WhatsApp reminder to 19 learners with pending documents.' },
  ],
};
export default function FollowUpsPage() { return <OperationalScreen config={config} />; }
