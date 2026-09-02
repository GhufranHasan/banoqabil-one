'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Building2,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Layers3,
  MoreVertical,
  Send,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import { AppShell } from '@/components/app-shell';
import { PageHeader, Panel, StatCard } from '@/components/dashboard-ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const fillRate = [
  { week: 'Mar 30', rate: 62 }, { week: 'Apr 6', rate: 78 }, { week: 'Apr 13', rate: 66 }, { week: 'Apr 20', rate: 73 },
  { week: 'Apr 27', rate: 67 }, { week: 'May 4', rate: 60 }, { week: 'May 11', rate: 58 }, { week: 'May 18', rate: 68 },
];
const chartConfig = { rate: { label: 'Average fill rate', color: '#1268ea' } } satisfies ChartConfig;
const followups = [
  ['Hassan Ali', 'Fee not paid', 'High', 'Today'], ['Ayesha Khan', 'Attendance low', 'High', 'Today'], ['Muhammad Bilal', 'Document pending', 'Medium', 'Tomorrow'], ['Zainab Fatima', 'Inactive (7+ days)', 'Medium', 'Tomorrow'], ['Safeer Ahmed', 'Batch change req.', 'Low', 'May 26'], ['Laiba Noor', 'Contact not reachable', 'Low', 'May 26'],
];
const trainers = [
  ['AM', 'Ali Mehmood', '8 Batches', 82], ['SN', 'Sara Nawaz', '6 Batches', 68], ['IR', 'Imran Raza', '7 Batches', 64], ['KB', 'Kiran Batool', '5 Batches', 52], ['FA', 'Faisal Ahmed', '4 Batches', 40],
];

export default function CoordinatorDashboard() {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('Here’s what I found for your campus.');

  function ask(text = prompt) {
    if (!text.trim()) return;
    setAnswer('Demo response: 142 at-risk students need attention, and 34 seats can be recovered from 3 batches.');
    setPrompt('');
  }

  return (
    <AppShell>
      <PageHeader title="Coordinator Dashboard" description="Centralized campus operations overview" />

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_250px]">
        <div className="min-w-0">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Registered Students" value="1,248" change="12.5%" icon={UsersRound} tone="green" />
            <StatCard label="Active Batches" value="86" change="8.1%" icon={Layers3} tone="blue" />
            <StatCard label="At-Risk Students" value="142" change="6.3%" icon={AlertTriangle} tone="amber" />
            <StatCard label="Seats Recovered" value="217" change="15.7%" icon={GraduationCap} tone="lime" />
          </div>

          <div className="mt-4">
            <Panel title="Follow-up Queue" action={<Link href="/follow-ups" className="text-[10px] font-semibold text-blue-600">View All</Link>}>
              <Table>
                <TableHeader><TableRow><TableHead className="px-4 text-[10px]">Student</TableHead><TableHead className="text-[10px]">Issue</TableHead><TableHead className="text-[10px]">Priority</TableHead><TableHead className="text-[10px]">Due</TableHead><TableHead /></TableRow></TableHeader>
                <TableBody>{followups.map(([name, issue, priority, due]) => <TableRow key={name}><TableCell className="px-4 py-2.5 text-[10px] font-medium text-[#16325d]">{name}</TableCell><TableCell className="py-2.5 text-[9px] text-slate-500">{issue}</TableCell><TableCell className="py-2.5"><Badge variant="secondary" className={priority === 'High' ? 'bg-red-50 text-red-600' : priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}>{priority}</Badge></TableCell><TableCell className="py-2.5 text-[9px] text-slate-500">{due}</TableCell><TableCell><MoreVertical className="size-3.5 text-slate-400" /></TableCell></TableRow>)}</TableBody>
              </Table>
            </Panel>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <Panel title="Batch Fill Rate Trend" action={<Button variant="outline" size="sm">Last 8 Weeks</Button>}>
              <ChartContainer config={chartConfig} className="h-[230px] w-full aspect-auto p-3">
                <LineChart accessibilityLayer data={fillRate} margin={{ top: 16, right: 14, left: -20, bottom: 5 }}><CartesianGrid vertical={false} strokeDasharray="4 4" /><XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={9} /><YAxis domain={[0,100]} tickLine={false} axisLine={false} fontSize={9} /><ChartTooltip content={<ChartTooltipContent />} /><Line type="monotone" dataKey="rate" stroke="var(--color-rate)" strokeWidth={2.5} dot={{ r: 3, fill: 'white', strokeWidth: 2 }} /></LineChart>
              </ChartContainer>
            </Panel>
            <Panel title="Trainer Workload" action={<Link href="/trainers" className="text-[10px] font-semibold text-blue-600">View All</Link>}>
              <div className="space-y-3 p-4">{trainers.map(([initials,name,batches,value], index) => <div key={String(name)} className="grid grid-cols-[32px_1fr_74px_34px] items-center gap-2 text-[10px]"><span className={`grid size-8 place-items-center rounded-full ${['bg-emerald-50 text-emerald-700','bg-blue-50 text-blue-700','bg-red-50 text-red-600','bg-lime-50 text-lime-700','bg-cyan-50 text-cyan-700'][index]}`}>{initials}</span><span className="font-medium text-[#17345f]">{name}</span><Progress value={Number(value)} className="gap-0 [&_[data-slot=progress-indicator]]:bg-gradient-to-r [&_[data-slot=progress-indicator]]:from-emerald-500 [&_[data-slot=progress-indicator]]:to-blue-700" /><b className="text-[#17345f]">{value}%</b><span /><span className="col-span-3 -mt-2 text-[8px] text-slate-400">{batches}</span></div>)}</div>
            </Panel>
          </div>
        </div>

        <aside className="rounded-xl border border-slate-200 bg-white shadow-[0_4px_18px_rgb(15_23_42/3%)]">
          <div className="flex items-center justify-between border-b border-slate-100 p-4"><div className="flex items-center gap-2 text-xs font-bold text-[#0a1e4b]"><Bot className="size-5 text-emerald-600" />BanoQabil AI <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[8px] text-blue-600">BETA</span></div></div>
          <div className="p-4"><h2 className="text-sm font-bold text-[#0a1e4b]">Hello Ahmad! 👋</h2><p className="mt-1 text-[10px] text-slate-500">{answer}</p><div className="mt-4 space-y-3">{[
            [UsersRound, 'At-Risk Students', '142 students need attention.', '/follow-ups', 'View list'],
            [Layers3, 'Seats Opportunity', 'You can fill 34 more seats in 3 batches.', '/seat-availability', 'View details'],
            [CalendarDays, 'Follow-ups Due', 'You have 4 high priority follow-ups due today.', '/seat-recovery', 'Open queue'],
          ].map(([Icon,title,text,href,label]) => { const CardIcon = Icon as typeof UsersRound; return <div key={String(title)} className="rounded-xl border border-slate-200 p-3"><div className="flex gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CardIcon className="size-4" /></span><div><p className="text-[11px] font-semibold text-[#17345f]">{String(title)}</p><p className="mt-1 text-[9px] leading-4 text-slate-500">{String(text)}</p><Link href={String(href)} className="mt-2 flex items-center gap-1 text-[9px] font-medium text-blue-600">{String(label)} <ArrowRight className="size-3" /></Link></div></div></div>; })}</div></div>
          <form onSubmit={(event) => { event.preventDefault(); ask(); }} className="mt-auto border-t border-slate-100 p-4"><div className="relative"><Input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask anything…" className="h-14 pr-10 text-xs" /><button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0a1e4b]" aria-label="Send prompt"><Send className="size-5" /></button></div><div className="mt-3 flex flex-wrap gap-1.5">{['Show at-risk students','Top low fill-rate batches','Weekly admissions trend'].map((text) => <button type="button" key={text} onClick={() => ask(text)} className="rounded border border-slate-200 px-2 py-1 text-[8px] text-slate-500 hover:bg-slate-50">{text}</button>)}</div><p className="mt-4 flex items-center gap-1 text-[8px] text-slate-400"><CheckCircle2 className="size-3" />AI responses use dummy demo data.</p></form>
        </aside>
      </div>
    </AppShell>
  );
}
