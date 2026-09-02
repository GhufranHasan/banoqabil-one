'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Activity, ArrowRight, FilePlus2, Layers3, UserRoundCheck, UsersRound } from 'lucide-react';

import { AppShell, PageSearch, type AppRole } from '@/components/app-shell';
import { PageHeader, Panel, StatCard } from '@/components/dashboard-ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/toast';
import { downloadBanoQabilReport } from '@/lib/pdf-report';

const sectionCopy: Record<string, { title: string; description: string; item: string }> = {
  students: { title: 'Students', description: 'Manage learner profiles, status, enrollment and engagement.', item: 'student' },
  batches: { title: 'Batches', description: 'Monitor active batches, schedules and fill rates.', item: 'batch' },
  trainers: { title: 'Trainers', description: 'Review trainer allocation, workload and availability.', item: 'trainer' },
  'follow-ups': { title: 'Follow-up Worklist', description: 'Prioritize and resolve learner follow-up cases.', item: 'case' },
  admissions: { title: 'Admissions', description: 'Track applications, reviews and intake progress.', item: 'application' },
  reports: { title: 'Reports', description: 'Explore dummy operational and performance reports.', item: 'report' },
  communications: { title: 'Communications', description: 'Manage learner announcements and outreach.', item: 'message' },
  settings: { title: 'Settings', description: 'Configure your demo workspace and preferences.', item: 'setting' },
};

const dummyRows = [
  ['BQ-01024', 'Hassan Ali', 'Web Development', 'Gulshan Campus', 'Active'],
  ['BQ-01025', 'Ayesha Khan', 'Graphic Design', 'Nazimabad Campus', 'Follow-up'],
  ['BQ-01026', 'Muhammad Bilal', 'Cyber Security', 'Iqbal Town Campus', 'Active'],
  ['BQ-01027', 'Zainab Fatima', 'Digital Marketing', 'Lahore Township', 'Review'],
  ['BQ-01028', 'Safeer Ahmed', 'UI/UX Design', 'Faisalabad Campus', 'Active'],
  ['BQ-01029', 'Laiba Noor', 'Freelancing', 'Gulshan Campus', 'Inactive'],
];

type FormField = { label: string; type?: 'email' | 'number' | 'textarea'; options?: string[] };
const courses = ['Web Development', 'Graphic Design', 'Digital Marketing', 'Cyber Security', 'UI/UX Design'];
const campuses = ['Iqbal Town Campus', 'Gulshan Campus', 'Johar Town Campus', 'Nazimabad Girls Campus', 'Faisalabad Campus'];
const formFields: Record<string, FormField[]> = {
  students: [{label:'Full name'},{label:'Email address',type:'email'},{label:'Phone number'},{label:'Program',options:courses},{label:'Campus',options:campuses}],
  batches: [{label:'Batch name'},{label:'Program',options:courses},{label:'Campus',options:campuses},{label:'Timing',options:['09:00 AM - 11:00 AM','11:00 AM - 01:00 PM','02:00 PM - 04:00 PM','04:00 PM - 06:00 PM','06:00 PM - 08:00 PM']},{label:'Capacity',type:'number'}],
  trainers: [{label:'Full name'},{label:'Email address',type:'email'},{label:'Specialization',options:courses},{label:'Campus',options:campuses},{label:'Weekly Capacity',options:['10 hours','20 hours','30 hours','40 hours']}],
  admissions: [{label:'Applicant name'},{label:'Email address',type:'email'},{label:'Phone number'},{label:'Preferred Course',options:courses},{label:'Preferred Campus',options:campuses}],
  reports: [{label:'Report title'},{label:'Report type',options:['Campus Performance','Admissions Summary','Attendance & Risk','Seat Utilization','Security Fee & Refund']},{label:'Reporting period',options:['Current week','Current month','Current quarter','Current intake']},{label:'Scope',options:['Campus','Region','Network']},{label:'Campus or Region',options:['Iqbal Town Campus','Lahore Region','Karachi Region','All Network']}],
  communications: [{label:'Message title'},{label:'Audience',options:['Students','Teachers','All Campus Staff']},{label:'Delivery channel',options:['In-app','Email','SMS']},{label:'Message',type:'textarea'}],
};

export default function GenericSectionPage() {
  const params = useParams<{ section: string }>();
  const section = params.section ?? 'students';
  const copy = sectionCopy[section] ?? sectionCopy.students;
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [detailRow, setDetailRow] = useState<string[] | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<AppRole | null>(null);
  const rows = useMemo(() => dummyRows.filter((row) => row.join(' ').toLowerCase().includes(search.toLowerCase())), [search]);
  useEffect(() => { setCurrentRole((sessionStorage.getItem('bqone-demo-role') as AppRole | null) ?? 'Coordinator'); }, []);

  async function viewRecord(row: string[]) {
    setLoadingId(row[0]);
    const request = new Promise<string[]>((resolve) => setTimeout(() => resolve(row), 1100));
    const result = await toast.promise(request, {
      loading: { title: 'Loading record', description: `Fetching ${row[0]} from the demo API…`, type: 'loading' },
      success: { title: 'Record loaded', description: `${row[0]} is ready to view.`, type: 'success' },
      error: { title: 'Unable to load record', description: 'Please try again.', type: 'error' },
    });
    setDetailRow(result);
    setLoadingId(null);
  }

  function submitRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormOpen(false);
    setMessage(`A dummy ${copy.item} was created.`);
    toast.add({ title: `${copy.item[0].toUpperCase()}${copy.item.slice(1)} created`, description: 'The demo form was submitted successfully.', type: 'success' });
    if (section === 'reports') generatePdf();
  }

  function generatePdf() {
    downloadBanoQabilReport({ title: `${copy.title} Summary`, subtitle: 'Dummy operational report template', preparedBy: currentRole ?? 'Coordinator', sections: [
      { label: 'Total records', value: '1,248' }, { label: 'Active records', value: '986' }, { label: 'Needs review', value: '142' },
      { label: 'Completed', value: '217' }, { label: 'Reporting scope', value: 'Bano Qabil Network' }, { label: 'Data status', value: 'Dummy frontend data' },
    ] });
    toast.add({ title: 'PDF report generated', description: 'The BanoQabil One report was downloaded.', type: 'success' });
  }

  return (
    <AppShell>
      <PageHeader title={copy.title} description={copy.description} actions={<>{section === 'reports' && <Button variant="outline" className="bg-white" onClick={generatePdf}>Generate PDF</Button>}{currentRole === 'Coordinator' && <Button onClick={() => setFormOpen(true)} className="bg-gradient-to-r from-[#08af8b] to-[#07558a] text-white"><FilePlus2 />Add {copy.item}</Button>}</>} />
      {message && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">{message}</div>}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><StatCard label={`Total ${copy.title}`} value="1,248" change="12.5%" icon={UsersRound} tone="green" /><StatCard label="Active" value="986" change="8.1%" icon={Activity} tone="blue" /><StatCard label="Needs Review" value="142" change="6.3%" icon={Layers3} tone="amber" /><StatCard label="Completed" value="217" change="15.7%" icon={UserRoundCheck} tone="lime" /></div>
      <Panel title={`${copy.title} Directory`} subtitle="All information on this page is dummy frontend data." className="mt-4" action={<div className="w-64"><PageSearch value={search} onChange={setSearch} placeholder={`Search ${copy.title.toLowerCase()}…`} /></div>}>
        <Table><TableHeader><TableRow className="bg-slate-50"><TableHead className="px-4">ID</TableHead><TableHead>Name</TableHead><TableHead>Program</TableHead><TableHead>Campus</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{rows.map((row) => <TableRow key={row[0]}>{row.map((cell, index) => index === 4 ? <TableCell key={cell}><Badge className={cell === 'Active' ? 'bg-emerald-50 text-emerald-700' : cell === 'Follow-up' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}>{cell}</Badge></TableCell> : <TableCell key={cell} className={index === 0 ? 'px-4 font-medium text-[#17345f]' : ''}>{cell}</TableCell>)}<TableCell><Button onClick={() => viewRecord(row)} variant="outline" size="sm" disabled={loadingId === row[0]}>{loadingId === row[0] ? 'Loading…' : 'View'} <ArrowRight /></Button></TableCell></TableRow>)}</TableBody></Table>
      </Panel>

      <Dialog open={formOpen} onOpenChange={setFormOpen}><DialogContent className="sm:max-w-xl"><DialogHeader><DialogTitle>Add {copy.item}</DialogTitle><DialogDescription>Complete the fields below to create a new dummy {copy.item}.</DialogDescription></DialogHeader><form onSubmit={submitRecord}><div className="grid gap-4 py-2 sm:grid-cols-2">{(formFields[section] ?? [{label:'Name'},{label:'Description'},{label:'Category'}]).map((field, index) => <label key={field.label} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}><span className="mb-1.5 block text-xs font-semibold text-[#17345f]">{field.label}</span>{field.options ? <NativeSelect className="w-full [&_select]:h-10 [&_select]:bg-white">{field.options.map((option) => <NativeSelectOption key={option}>{option}</NativeSelectOption>)}</NativeSelect> : field.type === 'textarea' ? <textarea required rows={4} className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-emerald-400" placeholder={`Enter ${field.label.toLowerCase()}`} /> : <Input required type={field.type ?? 'text'} placeholder={`Enter ${field.label.toLowerCase()}`} autoFocus={index === 0} />}</label>)}</div><DialogFooter className="mt-4"><Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button><Button type="submit" className="bg-gradient-to-r from-[#08af8b] to-[#07558a] text-white">{section === 'reports' ? 'Create & Download PDF' : `Create ${copy.item}`}</Button></DialogFooter></form></DialogContent></Dialog>

      <Dialog open={Boolean(detailRow)} onOpenChange={(open) => !open && setDetailRow(null)}><DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>{copy.item[0].toUpperCase()}{copy.item.slice(1)} details</DialogTitle><DialogDescription>Complete information returned for the selected row.</DialogDescription></DialogHeader>{detailRow && <div className="grid gap-3 sm:grid-cols-2">{['Record ID', 'Name', 'Program', 'Campus', 'Status'].map((label, index) => <div key={label} className={index === 1 ? 'sm:col-span-2 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4' : 'rounded-xl bg-slate-50 p-4'}><p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1.5 text-sm font-semibold text-[#17345f]">{detailRow[index]}</p></div>)}</div>}<DialogFooter showCloseButton /></DialogContent></Dialog>
    </AppShell>
  );
}
