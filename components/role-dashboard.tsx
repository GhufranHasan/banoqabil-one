'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight, BellRing, BookOpenCheck, CalendarCheck, CheckCircle2, CircleAlert, Clock3, GraduationCap, Layers3, MapPinned, School, ShieldCheck, TrendingUp, UsersRound } from 'lucide-react';

import { AppShell, type AppRole } from '@/components/app-shell';
import { PageHeader, Panel, StatCard } from '@/components/dashboard-ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/toast';
import { downloadBanoQabilReport } from '@/lib/pdf-report';

type Metric = { label: string; value: string; change: string; icon: LucideIcon; tone: 'green' | 'blue' | 'amber' | 'lime' | 'violet'; note?: string };
type Activity = { name: string; detail: string; status: string; meta: string };

export type RoleDashboardConfig = {
  role: AppRole;
  userName: string;
  title: string;
  description: string;
  greeting: string;
  metrics: Metric[];
  primaryTitle: string;
  primarySubtitle: string;
  activities: Activity[];
  progressTitle: string;
  progress: { label: string; value: number; meta: string }[];
  quickLinks: { label: string; description: string; href: string; icon: LucideIcon }[];
  notice: string;
};

const statusTone: Record<string, string> = {
  'On track': 'bg-emerald-50 text-emerald-700',
  Complete: 'bg-emerald-50 text-emerald-700',
  Healthy: 'bg-emerald-50 text-emerald-700',
  Upcoming: 'bg-blue-50 text-blue-700',
  Pending: 'bg-amber-50 text-amber-700',
  Review: 'bg-amber-50 text-amber-700',
  'At risk': 'bg-red-50 text-red-600',
};

export function RoleDashboard({ config }: { config: RoleDashboardConfig }) {
  const [notice, setNotice] = useState(config.notice);
  const [completed, setCompleted] = useState<string[]>([]);

  function markComplete(name: string) {
    setCompleted((current) => current.includes(name) ? current : [...current, name]);
    setNotice(`${name} was marked complete in this frontend demo.`);
  }

  function generateReport() {
    downloadBanoQabilReport({ title: config.title, subtitle: config.description, preparedBy: `${config.userName} - ${config.role}`, sections: [
      ...config.metrics.map((metric) => ({ label: metric.label, value: metric.value })),
      ...config.progress.map((item) => ({ label: item.label, value: `${item.value}% - ${item.meta}` })),
    ] });
    setNotice('A BanoQabil One PDF report was generated and downloaded.');
    toast.add({ title: 'Report ready', description: 'The branded PDF report was downloaded.', type: 'success' });
  }

  return (
    <AppShell role={config.role} userName={config.userName}>
      <PageHeader
        title={config.title}
        description={config.description}
        actions={<><Button variant="outline" className="bg-white"><CalendarCheck />This week</Button><Button onClick={generateReport} className="bg-gradient-to-r from-[#08aa87] to-[#083b85] text-white"><TrendingUp />Generate report</Button></>}
      />

      <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-xs text-emerald-800">
        <span className="flex items-center gap-2"><BellRing className="size-4" />{notice}</span>
        <button onClick={() => setNotice('You are all caught up.')} className="font-semibold text-emerald-700 hover:underline">Dismiss</button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {config.metrics.map((metric) => <StatCard key={metric.label} {...metric} />)}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,.8fr)]">
        <Panel title={config.primaryTitle} subtitle={config.primarySubtitle} action={<Button variant="outline" size="sm">View all</Button>}>
          <Table>
            <TableHeader><TableRow><TableHead className="px-4">Item</TableHead><TableHead>Details</TableHead><TableHead>Status</TableHead><TableHead>Next step</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
            <TableBody>{config.activities.map((item) => {
              const isDone = completed.includes(item.name);
              return <TableRow key={item.name}><TableCell className="px-4 py-3"><p className="text-xs font-semibold text-[#14325f]">{item.name}</p><p className="mt-1 text-[9px] text-slate-400">{item.meta}</p></TableCell><TableCell className="text-[10px] text-slate-500">{item.detail}</TableCell><TableCell><Badge className={isDone ? statusTone.Complete : statusTone[item.status] ?? 'bg-slate-100 text-slate-600'}>{isDone ? 'Complete' : item.status}</Badge></TableCell><TableCell className="text-[10px] text-slate-500">{isDone ? 'No action needed' : item.meta}</TableCell><TableCell className="text-right"><Button onClick={() => markComplete(item.name)} variant="outline" size="sm" disabled={isDone}>{isDone ? <CheckCircle2 /> : <ArrowRight />}{isDone ? 'Done' : 'Open'}</Button></TableCell></TableRow>;
            })}</TableBody>
          </Table>
        </Panel>

        <Panel title={config.progressTitle} subtitle="Live dummy data for this demo">
          <div className="space-y-5 p-5">{config.progress.map((item) => <div key={item.label}><div className="mb-2 flex items-center justify-between text-xs"><span className="font-medium text-[#17345f]">{item.label}</span><b className="text-[#0b1f4d]">{item.value}%</b></div><Progress value={item.value} className="[&_[data-slot=progress-indicator]]:bg-gradient-to-r [&_[data-slot=progress-indicator]]:from-emerald-500 [&_[data-slot=progress-indicator]]:to-blue-700" /><p className="mt-1.5 text-[9px] text-slate-400">{item.meta}</p></div>)}</div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {config.quickLinks.map(({ label, description, href, icon: Icon }) => <Link key={label} href={href} className="group rounded-xl border border-slate-200 bg-white p-4 shadow-[0_4px_18px_rgb(15_23_42/3%)] transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"><span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><Icon className="size-5" /></span><p className="mt-4 text-sm font-bold text-[#0b1f4d]">{label}</p><p className="mt-1 text-[10px] leading-4 text-slate-500">{description}</p><span className="mt-4 flex items-center gap-1 text-[10px] font-semibold text-blue-600">Open <ArrowRight className="size-3 transition group-hover:translate-x-1" /></span></Link>)}
      </div>
    </AppShell>
  );
}

export const dashboardIcons = { UsersRound, GraduationCap, BookOpenCheck, CalendarCheck, Clock3, CircleAlert, Layers3, School, ShieldCheck, MapPinned };
