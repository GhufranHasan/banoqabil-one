'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Eye,
  FileClock,
  FileSpreadsheet,
  Filter,
  Pencil,
  RefreshCw,
  Rows3,
  Save,
  Sparkles,
} from 'lucide-react';

import { AppShell } from '@/components/app-shell';
import { PageHeader, Panel } from '@/components/dashboard-ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const mappings = [
  ['Full Name', 'Student Name', 'High', 'Mapped'], ['F/Name', 'Father Name', 'High', 'Mapped'], ['CNIC No.', 'CNIC', 'High', 'Mapped'], ['Phone Number', 'Mobile Number', 'High', 'Mapped'], ['Email Address', 'Email', 'Medium', 'Review'], ['Select Course', 'Course', 'High', 'Mapped'], ['Batch Time', 'Timing', 'Medium', 'Review'], ['Program Fee', 'Fee (PKR)', 'Medium', 'Review'], ['City', 'City', 'High', 'Mapped'], ['Gender', 'Gender', 'High', 'Mapped'],
];

export default function ImportsPage() {
  const router = useRouter();
  const [approved, setApproved] = useState(false);
  const [message, setMessage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <AppShell>
      <div className="mb-3 flex items-center gap-2 text-[10px] text-slate-400"><span>Imports</span><ArrowRight className="size-3" /><span>Import Upload & Mapping</span></div>
      <PageHeader title="Import Upload + AI Mapping Review" description="Upload your registration file and review AI-suggested mappings before you commit." actions={<><Button variant="outline" className="bg-white" onClick={() => setMessage('Mapping draft saved locally for this demo.')}><Save />Save Mapping</Button><Button variant="outline" className="bg-white"><FileClock />Import History</Button></>} />

      {message && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">{message}</div>}

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-4">
          <Panel title="Upload Summary">
            <div className="grid gap-4 p-4 md:grid-cols-[1.6fr_repeat(4,1fr)]">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-4"><span className="grid size-12 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><FileSpreadsheet className="size-6" /></span><div><p className="text-xs font-semibold text-[#17345f]">registrations_may_18_2025.xlsx</p><p className="mt-1 text-[9px] text-slate-400">Uploaded May 18, 2025 · 11:24 AM</p><Badge className="mt-2 bg-emerald-50 text-emerald-700">Completed</Badge></div></div>
              {[[Rows3,'Total Rows','1,248',''],[CheckCircle2,'Mapped Columns','18 / 22','82%'],[AlertTriangle,'Review Needed','37','3.0%'],[FileSpreadsheet,'Quarantined Rows','12','1.0%']].map(([Icon,label,value,extra], index) => { const MetricIcon = Icon as typeof Rows3; return <div key={String(label)} className="flex items-center gap-3 md:block"><MetricIcon className={`size-5 ${index === 2 ? 'text-red-500' : index === 3 ? 'text-amber-500' : 'text-emerald-500'}`} /><div><p className="mt-2 text-[9px] text-slate-400">{String(label)}</p><p className="mt-1 text-xl font-bold text-[#0a1e4b]">{String(value)}</p>{extra && <p className={`mt-1 text-[10px] font-semibold ${index < 2 ? 'text-emerald-600' : 'text-amber-500'}`}>{String(extra)}</p>}</div></div>; })}
            </div>
          </Panel>

          <Panel title="AI Mapping Review" subtitle="Review and adjust the AI-suggested mapping between your file columns and system fields." action={<div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => setMessage('AI mapping refreshed with the same demo results.')}><RefreshCw />Auto-map Again</Button><Button variant="outline" size="sm"><Filter />Filters</Button></div>}>
            <div className="p-4">
              <Table>
                <TableHeader><TableRow className="bg-slate-50"><TableHead className="px-4 text-[9px]">Source Header</TableHead><TableHead /><TableHead className="text-[9px]">Suggested Field</TableHead><TableHead className="text-[9px]">Confidence</TableHead><TableHead className="text-[9px]">Status</TableHead><TableHead className="text-[9px]">Action</TableHead></TableRow></TableHeader>
                <TableBody>{mappings.map(([source, field, confidence, status]) => <TableRow key={source}><TableCell className="px-4 py-2 text-[10px] text-[#17345f]">{source}</TableCell><TableCell className="py-2"><ArrowRight className="size-3.5 text-slate-400" /></TableCell><TableCell className="py-2"><NativeSelect className="w-40 [&_select]:h-8 [&_select]:text-[10px]"><NativeSelectOption>{field}</NativeSelectOption><NativeSelectOption>Ignore field</NativeSelectOption></NativeSelect></TableCell><TableCell className="py-2"><Badge className={confidence === 'High' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}>{confidence}</Badge></TableCell><TableCell className="py-2"><span className={`flex items-center gap-1 text-[10px] ${status === 'Mapped' ? 'text-emerald-600' : 'text-amber-600'}`}>{status === 'Mapped' ? <CheckCircle2 className="size-3.5" /> : <AlertTriangle className="size-3.5" />}{status}</span></TableCell><TableCell className="py-2"><Button variant="outline" size="icon-sm" aria-label={`Edit ${source}`}><Pencil /></Button></TableCell></TableRow>)}</TableBody>
              </Table>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[9px] text-slate-400"><div className="flex flex-wrap gap-3"><span className="text-emerald-600">● High (≥80%)</span><span className="text-amber-500">● Medium (50–79%)</span><span className="text-red-500">● Needs Review (&lt;50%)</span></div><span>Showing 1–10 of 22 mappings</span></div>
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-100 p-4 sm:flex-row sm:items-center"><Button variant="outline" onClick={() => router.push('/dashboard/coordinator')}><ArrowLeft />Back</Button><div className="ml-auto flex gap-2"><Button variant="outline" onClick={() => { setApproved(true); setMessage('Mapping approved. You can now commit the import.'); }}>{approved ? <CheckCircle2 /> : null}{approved ? 'Approved' : 'Approve Mapping'}</Button><Button onClick={() => router.push('/seat-recovery')} className="bg-gradient-to-r from-[#07ae89] to-[#07558a] text-white">Commit Import <ArrowRight /></Button></div></div>
          </Panel>
        </div>

        <aside className="space-y-4">
          <Panel title="AI Recommendations" action={<Sparkles className="size-4 text-blue-600" />}>
            <div className="space-y-3 p-3">{[
              ['Course Normalization','AI normalized 23 variations to 7 standard courses.','blue'], ['Timing Normalization','AI standardized 11 timing formats.','blue'], ['Validation Issues','37 rows need review due to missing or invalid data.','red'],
            ].map(([title,text,tone]) => <div key={title} className="rounded-xl border border-slate-200 p-3"><div className="flex gap-3"><span className={`grid size-8 shrink-0 place-items-center rounded-full ${tone === 'red' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-600'}`}>{tone === 'red' ? <AlertTriangle className="size-4" /> : <Sparkles className="size-4" />}</span><div><p className="text-[10px] font-semibold text-[#17345f]">{title}</p><p className="mt-1 text-[9px] leading-4 text-slate-400">{text}</p><button className="mt-2 flex items-center gap-1 text-[9px] font-medium text-blue-600">View details <ArrowRight className="size-3" /></button></div></div></div>)}</div>
          </Panel>
          <Panel title="Import Quality Score"><div className="p-4"><div className="mx-auto grid size-24 place-items-center rounded-full bg-[conic-gradient(#08aa89_0_86%,#e7edf2_86%)]"><div className="grid size-16 place-items-center rounded-full bg-white text-center"><span className="text-lg font-bold text-[#0a1e4b]">86<small className="text-[9px] text-slate-400">/100</small></span><span className="-mt-4 text-[9px] text-emerald-600">Good</span></div></div><div className="mt-4 space-y-2 text-[9px]">{[['Accuracy',86],['Completeness',82],['Consistency',88]].map(([label,value]) => <div key={String(label)} className="flex items-center gap-2"><span className="w-20 text-slate-500">{label}</span><Progress value={Number(value)} className="flex-1 gap-0 [&_[data-slot=progress-indicator]]:bg-emerald-500" /><b className="text-[#17345f]">{value}%</b></div>)}</div></div></Panel>
          <Panel title="Sample Data Preview" subtitle="Preview of the first 5 rows from your file."><div className="p-4"><Button variant="outline" className="w-full" onClick={() => setPreviewOpen(true)}><Eye />View preview</Button></div></Panel>
          <Panel title="Need Help?" subtitle="Chat with our AI Assistant for guidance."><div className="p-4"><Button variant="outline" className="w-full"><Bot />Open AI Assistant</Button></div></Panel>
        </aside>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}><DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>Sample registration data</DialogTitle><DialogDescription>Dummy preview of the first five imported rows.</DialogDescription></DialogHeader><div className="overflow-auto"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Course</TableHead><TableHead>Campus</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{[['Hassan Ali','Web Development','Gulshan','Valid'],['Ayesha Khan','Graphic Design','Nazimabad','Valid'],['Maha Shahid','Digital Marketing','Iqbal Town','Review'],['Ali Tayyab','Data Analytics','Lahore','Valid'],['Iqra Qureshi','UI/UX Design','Gulshan','Review']].map((row) => <TableRow key={row[0]}>{row.map((cell) => <TableCell key={cell}>{cell}</TableCell>)}</TableRow>)}</TableBody></Table></div></DialogContent></Dialog>
    </AppShell>
  );
}
