'use client';

import { useMemo, useState } from 'react';
import {
  ArrowDownToLine,
  ArrowLeftRight,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Filter,
  Layers3,
  MapPin,
  RefreshCw,
  UsersRound,
} from 'lucide-react';

import { AppShell, PageSearch } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

const seats = [
  { campus: 'Gulshan', course: 'Web Development', timing: 'Morning', gender: 'Male', capacity: 60, enrolled: 54, held: 2, available: 4, status: 'Limited' },
  { campus: 'Gulshan', course: 'Graphic Design', timing: 'Evening', gender: 'Female', capacity: 30, enrolled: 21, held: 1, available: 8, status: 'Available' },
  { campus: 'North Nazimabad', course: 'Cyber Security', timing: 'Weekend', gender: 'Male', capacity: 30, enrolled: 30, held: 0, available: 0, status: 'Full' },
  { campus: 'Bahadurabad', course: 'Digital Marketing', timing: 'Afternoon', gender: 'Female', capacity: 45, enrolled: 37, held: 3, available: 5, status: 'Available' },
  { campus: 'Korangi', course: 'Web Development', timing: 'Evening', gender: 'Male', capacity: 60, enrolled: 42, held: 4, available: 14, status: 'Available' },
  { campus: 'Malir', course: 'Amazon FBA', timing: 'Morning', gender: 'Female', capacity: 30, enrolled: 27, held: 1, available: 2, status: 'Limited' },
  { campus: 'Orangi', course: 'Graphic Design', timing: 'Weekend', gender: 'Male', capacity: 45, enrolled: 34, held: 2, available: 9, status: 'Available' },
  { campus: 'North Nazimabad', course: 'Web Development', timing: 'Afternoon', gender: 'Female', capacity: 60, enrolled: 58, held: 2, available: 0, status: 'Full' },
  { campus: 'Gulshan', course: 'Freelancing', timing: 'Weekend', gender: 'Female', capacity: 40, enrolled: 31, held: 2, available: 7, status: 'Available' },
  { campus: 'Korangi', course: 'Cyber Security', timing: 'Morning', gender: 'Male', capacity: 30, enrolled: 25, held: 2, available: 3, status: 'Limited' },
] as const;

const campuses = ['All campuses', 'Gulshan', 'North Nazimabad', 'Bahadurabad', 'Korangi'] as const;

export default function SeatAvailabilityPage() {
  const [search, setSearch] = useState('');
  const [campus, setCampus] = useState<(typeof campuses)[number]>('All campuses');
  const [status, setStatus] = useState('All');
  const [exported, setExported] = useState(false);

  const filtered = useMemo(() => {
    return seats.filter((row) => {
      const matchesCampus = campus === 'All campuses' || row.campus === campus;
      const matchesStatus = status === 'All' || row.status === status;
      const haystack = `${row.campus} ${row.course} ${row.timing} ${row.gender}`.toLowerCase();
      return matchesCampus && matchesStatus && haystack.includes(search.toLowerCase());
    });
  }, [campus, search, status]);

  const totals = filtered.reduce((sum, item) => ({ capacity: sum.capacity + item.capacity, enrolled: sum.enrolled + item.enrolled, held: sum.held + item.held, available: sum.available + item.available }), { capacity: 0, enrolled: 0, held: 0, available: 0 });

  function exportCsv() {
    const header = ['Campus', 'Course', 'Timing', 'Gender', 'Capacity', 'Enrolled', 'Held', 'Available', 'Status'];
    const content = [header, ...filtered.map((row) => Object.values(row))].map((row) => row.join(',')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([content], { type: 'text/csv' }));
    link.download = 'bano-qabil-seat-availability.csv';
    link.click();
    URL.revokeObjectURL(link.href);
    setExported(true);
    window.setTimeout(() => setExported(false), 2400);
  }

  return (
    <AppShell title="Network Seat Availability" eyebrow="Capacity management">
      <section className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400"><span>Capacity</span><ChevronRight className="size-3" /><span className="text-[#099977]">Network availability</span></div>
          <h1 className="mt-2 text-2xl font-bold tracking-[-.03em] text-[#061d49] sm:text-3xl">Find the right seat, instantly</h1>
          <p className="mt-2 text-sm text-slate-500">Live availability across campuses, courses, timings and sessions.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-10 rounded-xl bg-white"><RefreshCw /> Refresh</Button>
          <Button onClick={exportCsv} className="h-10 rounded-xl bg-[#0a3a78] px-4 text-white hover:bg-[#082f64]">{exported ? <CheckCircle2 /> : <ArrowDownToLine />}{exported ? 'Exported' : 'Export CSV'}</Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total capacity', value: totals.capacity, sub: `${filtered.length} active batches`, icon: Layers3, tone: 'navy' },
          { label: 'Enrolled seats', value: totals.enrolled, sub: `${totals.capacity ? Math.round((totals.enrolled / totals.capacity) * 100) : 0}% utilised`, icon: UsersRound, tone: 'teal' },
          { label: 'Seats on hold', value: totals.held, sub: 'Pending confirmation', icon: CircleDot, tone: 'orange' },
          { label: 'Available now', value: totals.available, sub: 'Ready to allocate', icon: CheckCircle2, tone: 'lime' },
        ].map(({ label, value, sub, icon: Icon, tone }) => {
          const tones = { navy: 'bg-[#e8f0fa] text-[#0a3a78]', teal: 'bg-[#e3f7f1] text-[#07866a]', orange: 'bg-orange-50 text-orange-500', lime: 'bg-[#edf7df] text-[#669728]' };
          return <article key={label} className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgb(15_23_42/4%)]"><span className={`grid size-12 shrink-0 place-items-center rounded-xl ${tones[tone as keyof typeof tones]}`}><Icon className="size-5" /></span><div><p className="text-xs font-medium text-slate-400">{label}</p><p className="mt-0.5 text-2xl font-bold tracking-[-.03em] text-[#061d49]">{value}</p><p className="mt-0.5 text-[11px] text-slate-400">{sub}</p></div></article>;
        })}
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgb(15_23_42/4%)]">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row">
              <PageSearch value={search} onChange={setSearch} placeholder="Search campus, course or timing…" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-400"><Filter className="size-4" /></span>
                {campuses.map((item) => <button key={item} onClick={() => setCampus(item)} className={cn('h-10 rounded-xl border px-3 text-xs font-semibold transition', campus === item ? 'border-[#10ad87] bg-[#eaf8f4] text-[#07866a]' : 'border-slate-200 text-slate-500 hover:bg-slate-50')}>{item}</button>)}
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
              {['All', 'Available', 'Limited', 'Full'].map((item) => <button key={item} onClick={() => setStatus(item)} className={cn('rounded-lg px-3 py-1.5 text-xs font-semibold transition', status === item ? 'bg-white text-[#0a3a78] shadow-sm' : 'text-slate-400 hover:text-slate-600')}>{item}</button>)}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-400">Showing <b className="font-semibold text-slate-600">{filtered.length}</b> of {seats.length} seat groups</p>
            <p className="flex items-center gap-1.5 text-xs text-slate-400"><span className="size-2 rounded-full bg-[#10ad87]" />Updated just now</p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
              {['Campus', 'Course', 'Timing', 'Gender', 'Capacity', 'Enrolled', 'Held', 'Available', 'Status', ''].map((head) => <TableHead key={head || 'action'} className="h-11 px-5 text-[10px] font-bold uppercase tracking-[.08em] text-slate-400">{head}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={`${row.campus}-${row.course}-${row.timing}`} className="group border-slate-100">
                <TableCell className="px-5 py-4"><div className="flex items-center gap-2.5"><span className="grid size-8 place-items-center rounded-lg bg-[#edf3fb] text-[#0a3a78]"><MapPin className="size-3.5" /></span><span className="font-semibold text-[#0b2347]">{row.campus}</span></div></TableCell>
                <TableCell className="px-5 py-4 font-medium text-slate-600">{row.course}</TableCell>
                <TableCell className="px-5 py-4 text-slate-500">{row.timing}</TableCell>
                <TableCell className="px-5 py-4 text-slate-500">{row.gender}</TableCell>
                <TableCell className="px-5 py-4 font-semibold text-slate-700">{row.capacity}</TableCell>
                <TableCell className="px-5 py-4 text-slate-500">{row.enrolled}</TableCell>
                <TableCell className="px-5 py-4 text-slate-500">{row.held}</TableCell>
                <TableCell className="px-5 py-4"><span className={cn('font-bold', row.available === 0 ? 'text-red-500' : row.available <= 4 ? 'text-orange-500' : 'text-[#07866a]')}>{row.available}</span></TableCell>
                <TableCell className="px-5 py-4"><Badge variant="secondary" className={cn('border-0', row.status === 'Available' && 'bg-[#e3f7f1] text-[#07866a]', row.status === 'Limited' && 'bg-orange-50 text-orange-600', row.status === 'Full' && 'bg-red-50 text-red-600')}><span className="size-1.5 rounded-full bg-current" />{row.status}</Badge></TableCell>
                <TableCell className="px-5 py-4"><button className="grid size-8 place-items-center rounded-lg text-slate-300 transition group-hover:bg-[#edf7f4] group-hover:text-[#07866a]" aria-label={`Open ${row.course} at ${row.campus}`}><ChevronRight className="size-4" /></button></TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <TableRow><TableCell colSpan={10} className="h-40 text-center text-sm text-slate-400"><Building2 className="mx-auto mb-3 size-8 text-slate-300" />No seat groups match these filters.</TableCell></TableRow>}
          </TableBody>
        </Table>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">Page 1 of 1</p>
          <div className="flex items-center gap-1"><Button variant="outline" size="icon-sm" disabled aria-label="Previous page"><ChevronLeft /></Button><Button variant="outline" size="sm" className="border-[#10ad87] bg-[#eaf8f4] text-[#07866a]">1</Button><Button variant="outline" size="icon-sm" disabled aria-label="Next page"><ChevronRight /></Button></div>
        </div>
      </section>

      <section className="mt-5 flex flex-col gap-4 rounded-2xl border border-[#bfeadd] bg-[#eaf8f4] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[#07866a]"><ArrowLeftRight className="size-4.5" /></span><div><h2 className="text-sm font-bold text-[#075a49]">Need to move a learner?</h2><p className="mt-1 text-xs leading-5 text-[#35796b]">Use live capacity to compare eligible campuses and timings before creating a transfer request.</p></div></div>
        <Button className="h-10 shrink-0 rounded-xl bg-[#07866a] px-4 text-white hover:bg-[#066f59]">Compare transfer options</Button>
      </section>
    </AppShell>
  );
}
