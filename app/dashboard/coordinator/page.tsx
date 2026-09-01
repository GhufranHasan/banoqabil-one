'use client';

import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileUp,
  GraduationCap,
  MoreHorizontal,
  Sparkles,
  UserCheck,
  UsersRound,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const stats = [
  { label: 'Active learners', value: '25,418', change: '+8.2%', note: 'vs. last month', icon: GraduationCap, color: 'navy' },
  { label: 'Active batches', value: '612', change: '+24', note: 'this intake', icon: UsersRound, color: 'teal' },
  { label: 'Seat occupancy', value: '86.4%', change: '+3.1%', note: 'network average', icon: Building2, color: 'lime' },
  { label: 'Needs follow-up', value: '384', change: '18 due', note: 'today', icon: CalendarClock, color: 'orange' },
] as const;

const occupancyData = [
  { campus: 'Gulshan', occupied: 88, available: 12 },
  { campus: 'Nazimabad', occupied: 76, available: 24 },
  { campus: 'Bahadurabad', occupied: 91, available: 9 },
  { campus: 'Korangi', occupied: 69, available: 31 },
  { campus: 'Malir', occupied: 83, available: 17 },
  { campus: 'Orangi', occupied: 72, available: 28 },
];

const chartConfig = {
  occupied: { label: 'Occupied', color: '#0b407f' },
  available: { label: 'Available', color: '#9bd34e' },
} satisfies ChartConfig;

const capacity = [
  { course: 'Web Development', used: 284, total: 320, color: '#0b407f' },
  { course: 'Graphic Design', used: 198, total: 240, color: '#10ad87' },
  { course: 'Cyber Security', used: 146, total: 180, color: '#85bd3d' },
  { course: 'Digital Marketing', used: 112, total: 150, color: '#f59e0b' },
];

const alerts = [
  { name: 'Sara Khan', detail: '3 consecutive absences', batch: 'WD-GUL-08', time: '12 min ago', tone: 'red' },
  { name: 'Allocation run #BQ-129', detail: 'Review ready for 438 learners', batch: 'Intake 05', time: '38 min ago', tone: 'teal' },
  { name: 'GD-NZM-03', detail: 'Occupancy dropped below 70%', batch: 'Graphic Design', time: '1 hr ago', tone: 'orange' },
];

export default function CoordinatorDashboard() {
  return (
    <AppShell title="Coordinator Dashboard" eyebrow="Network operations">
      <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Tuesday, 1 September 2026</p>
          <h1 className="mt-1 text-2xl font-bold tracking-[-.03em] text-[#061d49] sm:text-3xl">Good evening, Ghufran</h1>
          <p className="mt-2 text-sm text-slate-500">Here’s what needs your attention across the network today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-10 rounded-xl bg-white"><FileUp /> Import data</Button>
          <Button className="h-10 rounded-xl bg-[#0a3a78] px-4 text-white hover:bg-[#082f64]"><Sparkles className="text-[#a9dc62]" /> New allocation</Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {stats.map(({ label, value, change, note, icon: Icon, color }) => {
          const colors = {
            navy: 'bg-[#e8f0fa] text-[#0a3a78]',
            teal: 'bg-[#e3f7f1] text-[#07866a]',
            lime: 'bg-[#edf7df] text-[#5e8e20]',
            orange: 'bg-[#fff2df] text-[#d97706]',
          };
          return (
            <article key={label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgb(15_23_42/4%)]">
              <div className="flex items-start justify-between">
                <span className={`grid size-11 place-items-center rounded-xl ${colors[color]}`}><Icon className="size-5" /></span>
                <button className="grid size-8 place-items-center rounded-lg text-slate-300 hover:bg-slate-50 hover:text-slate-500" aria-label={`More options for ${label}`}><MoreHorizontal className="size-5" /></button>
              </div>
              <p className="mt-5 text-[13px] font-medium text-slate-500">{label}</p>
              <div className="mt-1 flex items-baseline gap-2"><p className="text-[28px] font-bold tracking-[-.04em] text-[#061d49]">{value}</p><span className="text-xs font-semibold text-[#099977]">{change}</span></div>
              <p className="mt-1 text-xs text-slate-400">{note}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(350px,.85fr)]">
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgb(15_23_42/4%)] sm:p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="font-bold text-[#061d49]">Campus occupancy</h2><p className="mt-1 text-xs text-slate-400">Available and occupied seats by campus</p></div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500"><span className="flex items-center gap-1.5"><i className="size-2.5 rounded-sm bg-[#0b407f]" />Occupied</span><span className="flex items-center gap-1.5"><i className="size-2.5 rounded-sm bg-[#9bd34e]" />Available</span></div>
          </div>
          <ChartContainer config={chartConfig} className="h-[270px] w-full aspect-auto">
            <BarChart accessibilityLayer data={occupancyData} margin={{ top: 8, right: 4, left: -22, bottom: 0 }} barGap={4}>
              <CartesianGrid vertical={false} strokeDasharray="4 4" />
              <XAxis dataKey="campus" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} domain={[0, 100]} />
              <ChartTooltip cursor={{ fill: '#f3f7fa' }} content={<ChartTooltipContent />} />
              <Bar dataKey="occupied" fill="var(--color-occupied)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="available" fill="var(--color-available)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </article>

        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgb(15_23_42/4%)] sm:p-6">
          <div className="flex items-start justify-between gap-3"><div><h2 className="font-bold text-[#061d49]">Seat capacity</h2><p className="mt-1 text-xs text-slate-400">Top courses in your region</p></div><Link href="/seat-availability" className="flex items-center gap-1 text-xs font-semibold text-[#07866a] hover:underline">View all <ArrowUpRight className="size-3.5" /></Link></div>
          <div className="mt-6 space-y-5">
            {capacity.map((item) => {
              const percent = Math.round((item.used / item.total) * 100);
              return (
                <div key={item.course}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs"><span className="font-semibold text-[#0b2347]">{item.course}</span><span className="text-slate-400"><b className="font-semibold text-slate-600">{item.used}</b> / {item.total}</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, backgroundColor: item.color }} /></div>
                </div>
              );
            })}
          </div>
          <Link href="/seat-availability" className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-semibold text-[#0a3a78] transition hover:border-[#10ad87]/50 hover:bg-[#f2fbf8]">Explore network seats <ArrowRight className="size-4" /></Link>
        </article>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(350px,.85fr)]">
        <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgb(15_23_42/4%)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6"><div><h2 className="font-bold text-[#061d49]">Needs attention</h2><p className="mt-1 text-xs text-slate-400">Recent alerts and operational updates</p></div><button className="text-xs font-semibold text-[#07866a] hover:underline">View worklist</button></div>
          <div className="divide-y divide-slate-100">
            {alerts.map((alert) => {
              const tones = { red: 'bg-red-50 text-red-500', teal: 'bg-[#e3f7f1] text-[#07866a]', orange: 'bg-orange-50 text-orange-500' };
              const AlertIcon = alert.tone === 'red' ? UserCheck : alert.tone === 'teal' ? ClipboardCheck : Building2;
              return <div key={alert.name} className="flex items-center gap-3 px-5 py-4 transition hover:bg-slate-50/70 sm:px-6"><span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tones[alert.tone as keyof typeof tones]}`}><AlertIcon className="size-4.5" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#0b2347]">{alert.name}</p><p className="mt-0.5 truncate text-xs text-slate-400">{alert.detail} · {alert.batch}</p></div><span className="hidden items-center gap-1 text-[11px] text-slate-400 sm:flex"><Clock3 className="size-3" />{alert.time}</span><ArrowRight className="size-4 text-slate-300" /></div>;
            })}
          </div>
        </article>

        <article className="relative overflow-hidden rounded-2xl bg-[#061d49] p-6 text-white shadow-[0_12px_34px_rgb(6_29_73/16%)]">
          <div className="absolute -right-12 -top-16 size-48 rounded-full border-[36px] border-[#10ad87]/10" />
          <span className="grid size-11 place-items-center rounded-xl bg-white/10 text-[#a9dc62]"><Sparkles className="size-5" /></span>
          <h2 className="mt-5 text-xl font-bold tracking-tight">AI daily briefing</h2>
          <p className="mt-3 text-sm leading-6 text-blue-100/65">Seat utilisation improved 3.1% this month. Review seven low-occupancy batches before the next allocation run.</p>
          <Button className="mt-6 h-10 rounded-xl bg-[#10ad87] px-4 text-white hover:bg-[#0e9676]">Open briefing <ArrowRight /></Button>
          <p className="mt-5 flex items-center gap-1.5 text-[10px] text-blue-100/40"><CheckCircle2 className="size-3.5 text-[#8cc63f]" />Generated from data in your access scope</p>
        </article>
      </section>
    </AppShell>
  );
}
