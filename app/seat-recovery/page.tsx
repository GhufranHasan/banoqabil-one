'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  Send,
  Sparkles,
  TicketCheck,
  UserRoundCheck,
  UsersRound,
  Workflow,
} from 'lucide-react';

import { AppShell, PageSearch } from '@/components/app-shell';
import { FilterSelect, PageHeader, Panel, StatCard } from '@/components/dashboard-ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

const initialRecovery = [
  { initials: 'HA', name: 'Hassan Ali', id: 'STU-01234', course: 'Web Development', batch: 'WD-11 (Morning)', reason: 'Low Attendance', attendance: '62%', last: 'May 15' },
  { initials: 'MS', name: 'Maha Shahid', id: 'STU-00987', course: 'Graphic Design', batch: 'GD-09 (Evening)', reason: 'Fee Not Paid', attendance: '—', last: 'Apr 28' },
  { initials: 'AT', name: 'Ali Tayyab', id: 'STU-01102', course: 'Data Analytics', batch: 'DA-07 (Weekend)', reason: 'Irregular', attendance: '48%', last: 'May 10' },
  { initials: 'IQ', name: 'Iqra Qureshi', id: 'STU-01011', course: 'UI/UX Design', batch: 'UX-06 (Morning)', reason: 'Low Attendance', attendance: '55%', last: 'May 12' },
  { initials: 'FN', name: 'Fahad Nazir', id: 'STU-00876', course: 'Digital Marketing', batch: 'DM-10 (Evening)', reason: 'Fee Not Paid', attendance: '—', last: 'Apr 25' },
];
const initialWaitlist = [
  { rank: 1, initials: 'AK', name: 'Ayesha Khan', id: 'WT-00654', score: 94, fit: 'Excellent' },
  { rank: 2, initials: 'MR', name: 'M. Rehan', id: 'WT-00621', score: 88, fit: 'Very Good' },
  { rank: 3, initials: 'SN', name: 'Sana Naveed', id: 'WT-00695', score: 82, fit: 'Very Good' },
  { rank: 4, initials: 'ZA', name: 'Zain Ali', id: 'WT-00712', score: 76, fit: 'Good' },
  { rank: 5, initials: 'NM', name: 'Noor Malik', id: 'WT-00677', score: 72, fit: 'Good' },
];

export default function SeatRecoveryPage() {
  const [recovery, setRecovery] = useState(initialRecovery);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(initialRecovery[0].name);
  const [sentOffers, setSentOffers] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [autoMatch, setAutoMatch] = useState(false);
  const [holdDate, setHoldDate] = useState('2026-09-03');

  const visibleRecovery = useMemo(() => recovery.filter((item) => `${item.name} ${item.course} ${item.batch}`.toLowerCase().includes(search.toLowerCase())), [recovery, search]);

  function release(name: string) {
    setRecovery((current) => current.filter((item) => item.name !== name));
    setSelected(recovery.find((item) => item.name !== name)?.name ?? '');
    setMessage(`${name}’s seat was released in this demo.`);
  }

  function sendOffer(name: string) {
    setSentOffers((current) => current.includes(name) ? current : [...current, name]);
    setMessage(`Dummy offer sent to ${name}.`);
  }

  return (
    <AppShell>
      <PageHeader title="Seat Recovery + Waitlist Matching" description="Recover abandoned seats and match with the best waitlisted candidates." />
      {message && <div className="mb-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700"><span className="flex items-center gap-2"><CheckCircle2 className="size-4" />{message}</span><button onClick={() => setMessage('')}>×</button></div>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Recovery Candidates" value={String(recovery.length + 13)} change="12.5%" icon={UsersRound} tone="green" />
        <StatCard label="Seats Released" value={String(17 - recovery.length)} change="20%" icon={TicketCheck} tone="blue" />
        <StatCard label="Waitlist Entries" value="126" change="8.3%" icon={UserRoundCheck} tone="amber" />
        <StatCard label="Offers Sent" value={String(sentOffers.length + 9)} change="28.6%" icon={Send} tone="violet" />
      </div>

      <div className="mt-4 grid gap-4 2xl:grid-cols-2">
        <Panel title="Recovery Candidates (Abandoned / At-Risk)">
          <div className="flex flex-col gap-2 border-b border-slate-100 p-3 sm:flex-row"><FilterSelect options={['All Programs','Web Development','Graphic Design']} /><FilterSelect options={['All Batches','Morning','Evening']} /><FilterSelect options={['All Reasons','Low Attendance','Fee Not Paid']} /><div className="min-w-[190px] flex-[1.5]"><span className="mb-1 block text-[9px] font-semibold text-transparent">Search</span><PageSearch value={search} onChange={setSearch} placeholder="Search candidate" /></div></div>
          <Table><TableHeader><TableRow><TableHead className="px-4 text-[9px]">Student</TableHead><TableHead className="text-[9px]">Course</TableHead><TableHead className="text-[9px]">Batch</TableHead><TableHead className="text-[9px]">Reason</TableHead><TableHead className="text-[9px]">Attendance Evidence</TableHead><TableHead className="text-[9px]">Action</TableHead></TableRow></TableHeader><TableBody>{visibleRecovery.map((item, index) => <TableRow key={item.name} onClick={() => setSelected(item.name)} className={cn('cursor-pointer', selected === item.name && 'bg-emerald-50/40')}><TableCell className="px-4 py-3"><div className="flex items-center gap-2"><span className={`grid size-8 place-items-center rounded-full text-[9px] ${['bg-emerald-50 text-emerald-700','bg-blue-50 text-blue-700','bg-amber-50 text-amber-700','bg-violet-50 text-violet-700','bg-cyan-50 text-cyan-700'][index % 5]}`}>{item.initials}</span><div><p className="text-[10px] font-semibold text-[#17345f]">{item.name}</p><p className="text-[8px] text-slate-400">{item.id}</p></div></div></TableCell><TableCell className="py-3 text-[9px] text-slate-600">{item.course}</TableCell><TableCell className="py-3 text-[9px] text-slate-600">{item.batch}</TableCell><TableCell className="py-3"><Badge className={item.reason === 'Fee Not Paid' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}>{item.reason}</Badge></TableCell><TableCell className="py-3"><p className="text-[10px] font-semibold text-slate-600">{item.attendance}</p><p className="text-[8px] text-slate-400">Last: {item.last}</p></TableCell><TableCell className="py-3"><Button onClick={(event) => { event.stopPropagation(); release(item.name); }} size="sm" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100">Release Seat</Button></TableCell></TableRow>)}</TableBody></Table>
          <div className="flex items-center justify-between border-t border-slate-100 p-3 text-[9px] text-slate-400"><span>Showing {visibleRecovery.length} of 18 candidates</span><span>1 · 2 · 3 · 4 →</span></div>
        </Panel>

        <Panel title="Waitlist Match – Select a Recovery Candidate" subtitle={`Best matches for ${selected || 'the selected candidate'}`}>
          <div className="m-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-[9px] text-blue-700">Matches are ranked by fit score based on course, campus, timing, gender and interview.</div>
          <Table><TableHeader><TableRow><TableHead className="px-4 text-[9px]">Rank</TableHead><TableHead className="text-[9px]">Candidate</TableHead><TableHead className="text-[9px]">Fit Score</TableHead><TableHead className="text-[9px]">Compatibility</TableHead><TableHead className="text-[9px]">Action</TableHead></TableRow></TableHeader><TableBody>{initialWaitlist.map((item, index) => <TableRow key={item.name}><TableCell className="px-4 py-3"><span className={cn('grid size-6 place-items-center rounded-md text-[9px] font-bold', index === 0 ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-500')}>{item.rank}</span></TableCell><TableCell className="py-3"><div className="flex items-center gap-2"><span className={`grid size-8 place-items-center rounded-full text-[9px] ${index % 2 ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>{item.initials}</span><div><p className="text-[10px] font-semibold text-[#17345f]">{item.name}</p><p className="text-[8px] text-slate-400">{item.id}</p></div></div></TableCell><TableCell className="py-3"><p className="text-sm font-bold text-[#0a1e4b]">{item.score}%</p><p className="text-[8px] text-emerald-600">{item.fit}</p></TableCell><TableCell className="py-3"><div className="flex max-w-[190px] flex-wrap gap-1">{['Course','Campus','Timing','Gender','Interview'].map((tag, tagIndex) => <Badge key={tag} className={tagIndex < 3 ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}>{tag}</Badge>)}</div></TableCell><TableCell className="py-3"><Button size="sm" onClick={() => sendOffer(item.name)} className={sentOffers.includes(item.name) ? 'bg-slate-100 text-slate-500' : 'bg-emerald-600 text-white hover:bg-emerald-700'}>{sentOffers.includes(item.name) ? 'Sent' : 'Offer'}</Button></TableCell></TableRow>)}</TableBody></Table>
          <div className="border-t border-slate-100 p-3 text-center"><button className="text-[10px] font-medium text-blue-600">View full waitlist →</button></div>
        </Panel>
      </div>

      <section className="mt-4 grid overflow-hidden rounded-xl border border-blue-200 bg-white lg:grid-cols-[170px_1fr_1.1fr_1.1fr]">
        <div className="flex items-center gap-3 bg-blue-50/70 p-4"><CalendarDays className="size-6 text-blue-600" /><div><p className="text-[11px] font-bold text-[#17345f]">Seat Release</p><p className="text-[10px] text-[#17345f]">& Hold Options</p></div></div>
        <div className="border-t border-slate-100 p-4 lg:border-l lg:border-t-0"><p className="text-[10px] font-bold text-[#17345f]">Release Seat Now</p><p className="mt-1 text-[9px] text-slate-400">Seat will be available immediately for matching.</p><Button onClick={() => selected && release(selected)} size="sm" className="mt-3 bg-emerald-600 text-white"><TicketCheck />Release Seat</Button></div>
        <div className="border-t border-slate-100 p-4 lg:border-l lg:border-t-0"><p className="text-[10px] font-bold text-[#17345f]">Hold Until</p><p className="mt-1 text-[9px] text-slate-400">Temporarily hold the seat before offering.</p><div className="mt-3 flex gap-2"><Input type="date" value={holdDate} onChange={(event) => setHoldDate(event.target.value)} className="h-9 text-xs" /><Button onClick={() => setMessage(`Seat held until ${holdDate}.`)} size="sm" className="bg-blue-600 text-white"><LockKeyhole />Hold Seat</Button></div></div>
        <div className="border-t border-slate-100 p-4 lg:border-l lg:border-t-0"><p className="text-[10px] font-bold text-[#17345f]">Auto Match & Offer</p><p className="mt-1 text-[9px] text-slate-400">Automatically match and send offers to top candidates.</p><Button onClick={() => { setAutoMatch((value) => !value); setMessage(autoMatch ? 'Auto match disabled.' : 'Auto match enabled for this demo.'); }} size="sm" variant={autoMatch ? 'default' : 'outline'} className={cn('mt-3', autoMatch && 'bg-gradient-to-r from-[#08af8b] to-[#07558a] text-white')}><Sparkles />{autoMatch ? 'Auto Match On' : 'Enable Auto Match'}</Button></div>
      </section>
      <div className="mt-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-[9px] text-emerald-700"><span className="flex items-center gap-2"><CheckCircle2 className="size-4" />All seat recovery actions are logged in this demo.</span><button className="font-semibold">View Activity Log <ArrowRight className="inline size-3" /></button></div>
    </AppShell>
  );
}
