'use client';

import { CalendarRange, CircleAlert, Clock3, GraduationCap } from 'lucide-react';
import { OperationalScreen, type OperationalConfig } from '@/components/operational-screen';

const config: OperationalConfig = {
  title: 'Trainer Workload & Capacity', description: 'Balance teaching hours, batches and learner support across trainers', primaryAction: 'Propose Rebalance',
  metrics: [
    { label: 'Active Trainers', value: '82', change: '5.4%', icon: GraduationCap, tone: 'green' },
    { label: 'Weekly Hours', value: '1,846', change: '8.2%', icon: Clock3, tone: 'blue' },
    { label: 'Over Capacity', value: '7', change: '2.1%', icon: CircleAlert, tone: 'amber' },
    { label: 'Open Slots', value: '46', change: '11.7%', icon: CalendarRange, tone: 'violet' },
  ],
  panelTitle: 'Trainer Capacity', panelSubtitle: 'Current weekly load and batch assignments', columns: ['Trainer', 'Specialization', 'Batches', 'Weekly Hours'], filterLabels: ['Campus', 'Course', 'Capacity'],
  rows: [
    { id: 'w1', cells: ['Ali Mehmood', 'Web Development', '8 batches', '32 / 36 hours'], status: 'Review', score: 89 },
    { id: 'w2', cells: ['Sara Nawaz', 'Digital Marketing', '6 batches', '27 / 36 hours'], status: 'Healthy', score: 75 },
    { id: 'w3', cells: ['Imran Raza', 'Graphic Design', '7 batches', '38 / 36 hours'], status: 'At risk', score: 100 },
    { id: 'w4', cells: ['Kiran Batool', 'UI/UX Design', '5 batches', '22 / 36 hours'], status: 'Healthy', score: 61 },
    { id: 'w5', cells: ['Faisal Ahmed', 'Cyber Security', '4 batches', '18 / 36 hours'], status: 'Available', score: 50 },
  ],
  insights: [
    { title: 'Rebalance option', text: 'Move one GD-09 lab from Imran to Kiran to remove overtime.' },
    { title: 'Available capacity', text: 'Faisal can support one additional weekend Cyber Security batch.' },
    { title: 'Support hours', text: 'Learner follow-up time currently accounts for 11% of total workload.' },
  ],
};
export default function TrainerWorkloadPage() { return <OperationalScreen config={config} />; }
