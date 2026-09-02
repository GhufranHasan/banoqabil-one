'use client';

import { useMemo, useState } from 'react';
import {
  Armchair,
  ArrowDownToLine,
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  GraduationCap,
  TicketCheck,
  UsersRound,
  X,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { AppShell, PageSearch } from '@/components/app-shell';
import { FilterSelect, PageHeader, Panel, StatCard } from '@/components/dashboard-ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/toast';

const rows = [
  { campus: 'Gulshan Campus', region: 'Karachi', course: 'Web Development', timing: 'Morning', gender: 'Male', capacity: 60, enrolled: 48, held: 3, available: 9 },
  { campus: 'Gulshan Campus', region: 'Karachi', course: 'Graphic Design', timing: 'Evening', gender: 'Female', capacity: 30, enrolled: 22, held: 2, available: 6 },
  { campus: 'Lahore Township', region: 'Lahore', course: 'Digital Marketing', timing: 'Morning', gender: 'Mixed', capacity: 60, enrolled: 41, held: 4, available: 15 },
  { campus: 'Lahore Township', region: 'Lahore', course: 'Web Development', timing: 'Evening', gender: 'Male', capacity: 60, enrolled: 53, held: 2, available: 5 },
  { campus: 'Nazimabad Girls Campus', region: 'Karachi', course: 'Graphic Design', timing: 'Morning', gender: 'Female', capacity: 30, enrolled: 24, held: 1, available: 5 },
  { campus: 'Nazimabad Girls Campus', region: 'Karachi', course: 'Digital Marketing', timing: 'Evening', gender: 'Female', capacity: 30, enrolled: 18, held: 1, available: 11 },
  { campus: 'Iqbal Town Campus', region: 'Lahore', course: 'Cyber Security', timing: 'Weekend', gender: 'Mixed', capacity: 30, enrolled: 30, held: 0, available: 0 },
  { campus: 'Faisalabad Campus', region: 'Faisalabad', course: 'Web Development', timing: 'Morning', gender: 'Male', capacity: 60, enrolled: 33, held: 3, available: 24 },
];
const courseData = [{ name: 'Digital Marketing', seats: 612 }, { name: 'Web Development', seats: 498 }, { name: 'Graphic Design', seats: 312 }, { name: 'Cyber Security', seats: 210 }, { name: 'UI/UX Design', seats: 148 }];
const campusData = [{ campus: 'Gulshan', capacity: 1020, enrolled: 854, available: 166 }, { campus: 'Lahore', capacity: 960, enrolled: 784, available: 176 }, { campus: 'Nazimabad', capacity: 720, enrolled: 564, available: 156 }, { campus: 'Iqbal Town', capacity: 600, enrolled: 600, available: 0 }, { campus: 'Faisalabad', capacity: 600, enrolled: 366, available: 234 }];
const courseConfig = { seats: { label: 'Available seats', color: '#08a879' } } satisfies ChartConfig;
const campusConfig = { capacity: { label: 'Capacity', color: '#1768eb' }, enrolled: { label: 'Enrolled', color: '#08a879' }, available: { label: 'Available', color: '#f59e0b' } } satisfies ChartConfig;

export default function SeatAvailabilityPage() {
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [detail, setDetail] = useState<(typeof rows)[number] | null>(null);
  const [loadingRow, setLoadingRow] = useState('');
  const filtered = useMemo(() => rows.filter((row) => `${row.campus} ${row.region} ${row.course} ${row.timing}`.toLowerCase().includes(search.toLowerCase())), [search]);

  function exportReport() {
    const data = [['Campus','Region','Course','Timing','Gender','Capacity','Enrolled','Held','Available'], ...filtered.map((row) => Object.values(row))].map((row) => row.join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([data], { type: 'text/csv' }));
    const link = document.createElement('a'); link.href = url; link.download = 'network-seat-availability.csv'; link.click(); URL.revokeObjectURL(url);
    setMessage('Dummy seat report exported.');
  }

  async function viewDetail(row: (typeof rows)[number]) {
    const key = `${row.campus}-${row.course}-${row.timing}`;
    setLoadingRow(key);
    const request = new Promise<typeof row>((resolve) => setTimeout(() => resolve(row), 1100));
    const result = await toast.promise(request, {
      loading: { title: 'Fetching seat data', description: 'The demo API is responding slowly. Please wait…', type: 'loading' },
      success: { title: 'Seat data loaded', description: `${row.course} details are ready.`, type: 'success' },
      error: { title: 'Unable to load seats', description: 'Please retry the request.', type: 'error' },
    });
    setDetail(result);
    setLoadingRow('');
  }

  return (
    <AppShell>
      <PageHeader title="Network Seat Availability" description="Live seat availability across campuses, courses, timings, and gender categories." actions={<><Button variant="outline" className="bg-white">May 18 – May 24, 2025</Button><Button variant="outline" className="bg-white" onClick={exportReport}><ArrowDownToLine />Export Report</Button></>} />
      {message && <div className="mb-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700"><span className="flex items-center gap-2"><CheckCircle2 className="size-4" />{message}</span><button onClick={() => setMessage('')}><X className="size-4" /></button></div>}

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_250px]">
        <div className="min-w-0">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Capacity" value="8,640" change="" icon={UsersRound} tone="green" />
            <StatCard label="Active Enrollments" value="5,382" change="7.8%" icon={GraduationCap} tone="blue" />
            <StatCard label="Held Seats" value="784" change="5.4%" icon={TicketCheck} tone="amber" />
            <StatCard label="Available Seats" value="2,474" change="10.2%" icon={Armchair} tone="lime" />
          </div>

          <section className="mt-4 rounded-xl border border-slate-200 bg-white p-3 shadow-[0_4px_18px_rgb(15_23_42/3%)]">
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[repeat(6,minmax(100px,1fr))_minmax(180px,1.6fr)]"><FilterSelect label="Region" options={['All Regions','Karachi','Lahore','Faisalabad']} /><FilterSelect label="Campus" options={['All Campuses','Gulshan Campus','Lahore Township']} /><FilterSelect label="Course" options={['All Courses','Web Development','Graphic Design']} /><FilterSelect label="Timing" options={['All Timings','Morning','Evening','Weekend']} /><FilterSelect label="Gender" options={['All Genders','Male','Female','Mixed']} /><FilterSelect label="Status" options={['All Status','Available','Full']} /><label className="block"><span className="mb-1 block text-[9px] font-semibold text-transparent">Search</span><PageSearch value={search} onChange={setSearch} placeholder="Search campus or course…" /></label></div>
            <div className="mt-3 flex gap-2"><Button variant="outline" size="sm"><Building2 />Campus View</Button><Button size="sm" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"><UsersRound />Network View</Button></div>
          </section>

          <Panel title="Seat Availability Grid" action={<span className="text-[8px] text-slate-400">Last updated: Today, 10:25 AM</span>} className="mt-4">
            <Table><TableHeader><TableRow className="bg-slate-50"><TableHead className="px-3 text-[8px]">Campus</TableHead><TableHead className="text-[8px]">Region</TableHead><TableHead className="text-[8px]">Course</TableHead><TableHead className="text-[8px]">Timing</TableHead><TableHead className="text-[8px]">Gender</TableHead><TableHead className="text-[8px]">Capacity</TableHead><TableHead className="text-[8px]">Enrolled</TableHead><TableHead className="text-[8px]">Held</TableHead><TableHead className="text-[8px]">Available</TableHead><TableHead className="text-[8px]">Fill Rate</TableHead><TableHead className="text-[8px]">Action</TableHead></TableRow></TableHeader><TableBody>{filtered.map((row) => { const rate = Math.round((row.enrolled / row.capacity) * 100); const rowKey = `${row.campus}-${row.course}-${row.timing}`; return <TableRow key={rowKey}><TableCell className="px-3 py-2.5 text-[9px] font-medium text-[#17345f]">{row.campus}</TableCell><TableCell className="py-2.5 text-[8px] text-slate-500">{row.region}</TableCell><TableCell className="py-2.5 text-[8px] text-slate-600">{row.course}</TableCell><TableCell className="py-2.5 text-[8px] text-slate-500">{row.timing}</TableCell><TableCell className="py-2.5"><Badge className={row.gender === 'Female' ? 'bg-pink-50 text-pink-600' : row.gender === 'Male' ? 'bg-blue-50 text-blue-600' : 'bg-violet-50 text-violet-600'}>{row.gender}</Badge></TableCell><TableCell className="py-2.5 text-[9px]">{row.capacity}</TableCell><TableCell className="py-2.5 text-[9px]">{row.enrolled}</TableCell><TableCell className="py-2.5 text-[9px]">{row.held}</TableCell><TableCell className={`py-2.5 text-[9px] font-bold ${row.available === 0 ? 'text-red-500' : 'text-emerald-600'}`}>{row.available}</TableCell><TableCell className="py-2.5"><div className="flex items-center gap-2"><span className={`text-[8px] font-semibold ${rate === 100 ? 'text-red-500' : rate < 70 ? 'text-amber-500' : 'text-slate-500'}`}>{rate}%</span><Progress value={rate} className="w-12 gap-0 [&_[data-slot=progress-indicator]]:bg-emerald-500" /></div></TableCell><TableCell className="py-2.5"><Button onClick={() => viewDetail(row)} disabled={loadingRow === rowKey} variant="outline" size="xs" className="border-emerald-300 text-emerald-700">{loadingRow === rowKey ? 'Loading…' : 'View'}</Button></TableCell></TableRow>; })}</TableBody></Table>
            <div className="flex items-center justify-between border-t border-slate-100 p-3 text-[8px] text-slate-400"><span>Showing 1 to {filtered.length} of 24 entries</span><span>‹ · 1 · 2 · 3 · ›</span></div>
          </Panel>

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <Panel title="Available Seats by Course" action={<button className="text-[9px] font-medium text-blue-600">View full report</button>}><ChartContainer config={courseConfig} className="h-[235px] w-full aspect-auto p-3"><BarChart accessibilityLayer data={courseData} margin={{ top: 10, right: 8, left: -18, bottom: 5 }}><CartesianGrid vertical={false} /><XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={8} interval={0} /><YAxis tickLine={false} axisLine={false} fontSize={8} /><ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey="seats" fill="var(--color-seats)" radius={[4,4,0,0]} /></BarChart></ChartContainer></Panel>
            <Panel title="Campus Capacity Comparison" action={<button className="text-[9px] font-medium text-blue-600">View full report</button>}><ChartContainer config={campusConfig} className="h-[235px] w-full aspect-auto p-3"><BarChart accessibilityLayer layout="vertical" data={campusData} margin={{ top: 5, right: 12, left: 15, bottom: 5 }}><CartesianGrid horizontal={false} /><XAxis type="number" tickLine={false} axisLine={false} fontSize={8} /><YAxis dataKey="campus" type="category" tickLine={false} axisLine={false} fontSize={8} width={62} /><ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey="capacity" fill="var(--color-capacity)" radius={3} /><Bar dataKey="enrolled" fill="var(--color-enrolled)" radius={3} /><Bar dataKey="available" fill="var(--color-available)" radius={3} /></BarChart></ChartContainer></Panel>
          </div>
        </div>

        <aside className="space-y-4">
          <Panel title="BanoQabil AI" action={<Bot className="size-4 text-emerald-600" />}><div className="p-3"><p className="rounded-lg bg-gradient-to-br from-blue-50 to-lime-50 p-3 text-xs font-semibold leading-5 text-[#17345f]">34 seats can be recovered or reallocated this week.</p><Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => setMessage('AI insights loaded from dummy data.')}><SparklesIcon />View AI Insights <ArrowRight /></Button></div></Panel>
          <Panel title="Top Available Courses" action={<button className="text-[8px] text-blue-600">View all</button>}><div className="space-y-3 p-3">{courseData.map((course,index) => <div key={course.name} className="flex items-center gap-2 text-[9px]"><span className={`grid size-7 place-items-center rounded-full ${['bg-blue-50 text-blue-600','bg-indigo-50 text-indigo-600','bg-lime-50 text-lime-600','bg-red-50 text-red-500','bg-amber-50 text-amber-600'][index]}`}><GraduationCap className="size-3.5" /></span><span className="flex-1 text-slate-600">{course.name}</span><b className="text-emerald-600">{course.seats} seats</b></div>)}</div></Panel>
          <Panel title="Fully Occupied Batches" action={<button className="text-[8px] text-blue-600">View all</button>}><div className="space-y-3 p-3">{[['Cyber Security (Weekend)','Iqbal Town Campus'],['Web Development (Evening)','Lahore Township'],['Graphic Design (Morning)','Faisalabad Campus']].map(([batch,campus]) => <div key={batch} className="flex items-start gap-2 text-[9px]"><span className="grid size-7 place-items-center rounded-full bg-blue-50 text-blue-600"><GraduationCap className="size-3.5" /></span><div className="flex-1"><p className="text-slate-600">{batch}</p><p className="text-[8px] text-slate-400">{campus}</p></div><b className="text-red-500">100%</b></div>)}</div></Panel>
          <Panel title="Seats at Risk of Waste" action={<button className="text-[8px] text-blue-600">View all</button>}><div className="space-y-3 p-3">{[['Nazimabad Girls Campus','Digital Marketing (Evening)','11 seats'],['Gulshan Campus','Web Development (Morning)','9 seats'],['Faisalabad Campus','Graphic Design (Evening)','8 seats']].map(([campus,course,seats]) => <div key={campus} className="flex items-start gap-2 text-[9px]"><span className="grid size-7 place-items-center rounded-full bg-amber-50 text-amber-600"><TicketCheck className="size-3.5" /></span><div className="flex-1"><p className="text-slate-600">{campus}</p><p className="text-[8px] text-slate-400">{course}</p></div><b className="text-amber-500">{seats}</b></div>)}</div></Panel>
        </aside>
      </div>

      <Dialog open={Boolean(detail)} onOpenChange={(open) => !open && setDetail(null)}><DialogContent><DialogHeader><DialogTitle>{detail?.course}</DialogTitle><DialogDescription>Dummy seat details for {detail?.campus}.</DialogDescription></DialogHeader>{detail && <div className="grid grid-cols-2 gap-3 text-sm">{Object.entries(detail).map(([key,value]) => <div key={key} className="rounded-lg bg-slate-50 p-3"><p className="text-[9px] uppercase text-slate-400">{key}</p><p className="mt-1 font-semibold text-[#17345f]">{value}</p></div>)}</div>}</DialogContent></Dialog>
    </AppShell>
  );
}

function SparklesIcon() { return <Bot className="size-4" />; }
