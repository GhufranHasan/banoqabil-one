'use client';

import { CalendarCheck, CheckCircle2, Clock3, TrendingUp } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { PageHeader, Panel, StatCard } from '@/components/dashboard-ui';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const sessions = [
  ['May 24, 2025', 'CSS Grid & Flexbox', 'Present', '08:54 AM'], ['May 22, 2025', 'Responsive Layouts', 'Present', '08:58 AM'],
  ['May 20, 2025', 'CSS Animations', 'Late', '09:14 AM'], ['May 17, 2025', 'Git Collaboration', 'Present', '08:51 AM'],
  ['May 15, 2025', 'JavaScript Arrays', 'Absent', '-'], ['May 13, 2025', 'JavaScript Objects', 'Present', '08:56 AM'],
];

export default function StudentAttendancePage() {
  return <AppShell role="Student" userName="Ayesha Khan"><PageHeader title="My Attendance" description="Read-only attendance history for your enrolled course" />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Overall Attendance" value="92%" change="2.5%" icon={CalendarCheck} tone="green" note="Minimum required: 80%" /><StatCard label="Present Sessions" value="23" change="4.1%" icon={CheckCircle2} tone="blue" note="Out of 25 sessions" /><StatCard label="Late Arrivals" value="2" change="1.0%" icon={Clock3} tone="amber" note="Counted as attended" /><StatCard label="Refund Eligibility" value="Eligible" change="12%" icon={TrendingUp} tone="lime" note="Attendance requirement met" /></div>
    <Panel title="Attendance History" subtitle="Web Development · WD-11 Morning · Student view only" className="mt-4"><Table><TableHeader><TableRow><TableHead className="px-4">Session Date</TableHead><TableHead>Topic</TableHead><TableHead>Status</TableHead><TableHead>Check-in</TableHead><TableHead>Attendance Rate</TableHead></TableRow></TableHeader><TableBody>{sessions.map(([date,topic,status,time], index) => <TableRow key={date}><TableCell className="px-4 font-medium text-[#17345f]">{date}</TableCell><TableCell>{topic}</TableCell><TableCell><Badge className={status === 'Present' ? 'bg-emerald-50 text-emerald-700' : status === 'Late' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'}>{status}</Badge></TableCell><TableCell>{time}</TableCell><TableCell><div className="flex w-36 items-center gap-2"><Progress value={92 - index} /><span className="text-xs font-semibold">{92 - index}%</span></div></TableCell></TableRow>)}</TableBody></Table></Panel>
  </AppShell>;
}
