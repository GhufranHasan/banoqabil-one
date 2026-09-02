'use client';

import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { CheckCircle2, Download, Search, SlidersHorizontal, Sparkles } from 'lucide-react';

import { AppShell, type AppRole } from '@/components/app-shell';
import { FilterSelect, PageHeader, Panel, StatCard } from '@/components/dashboard-ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/toast';

type Metric = { label: string; value: string; change: string; icon: LucideIcon; tone: 'green' | 'blue' | 'amber' | 'lime' | 'violet'; note?: string };
export type OperationalRow = { id: string; cells: string[]; status: string; score?: number };
export type OperationalConfig = {
  title: string;
  description: string;
  role?: AppRole;
  userName?: string;
  primaryAction: string;
  metrics: Metric[];
  panelTitle: string;
  panelSubtitle: string;
  columns: string[];
  rows: OperationalRow[];
  filterLabels: string[];
  insights: { title: string; text: string; tone?: 'green' | 'blue' | 'amber' }[];
};

function badgeClass(status: string) {
  const value = status.toLowerCase();
  if (value.includes('complete') || value.includes('approved') || value.includes('present') || value.includes('resolved') || value.includes('healthy')) return 'bg-emerald-50 text-emerald-700';
  if (value.includes('pending') || value.includes('review') || value.includes('late') || value.includes('medium')) return 'bg-amber-50 text-amber-700';
  if (value.includes('risk') || value.includes('rejected') || value.includes('absent') || value.includes('high')) return 'bg-red-50 text-red-600';
  return 'bg-blue-50 text-blue-700';
}

export function OperationalScreen({ config }: { config: OperationalConfig }) {
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [processed, setProcessed] = useState<string[]>([]);
  const [detail, setDetail] = useState<OperationalRow | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const filtered = useMemo(() => config.rows.filter((row) => `${row.cells.join(' ')} ${row.status}`.toLowerCase().includes(query.toLowerCase())), [config.rows, query]);

  function process(id: string) {
    setProcessed((current) => current.includes(id) ? current : [...current, id]);
    setMessage('The selected record was updated successfully in this frontend demo.');
  }

  async function viewRow(row: OperationalRow) {
    setLoadingId(row.id);
    const request = new Promise<OperationalRow>((resolve) => setTimeout(() => resolve(row), 1100));
    const result = await toast.promise(request, {
      loading: { title: 'Fetching details', description: `Waiting for record ${row.id} from the demo API…`, type: 'loading' },
      success: { title: 'Details loaded', description: `Record ${row.id} is ready.`, type: 'success' },
      error: { title: 'Request failed', description: 'The record could not be loaded.', type: 'error' },
    });
    setDetail(result);
    setLoadingId(null);
  }

  return (
    <AppShell role={config.role ?? 'Coordinator'} userName={config.userName}>
      <PageHeader title={config.title} description={config.description} actions={<><Button variant="outline" onClick={() => setMessage('Demo CSV export prepared successfully.')} className="bg-white"><Download />Export</Button><Button onClick={() => setMessage(`${config.primaryAction} completed with dummy data.`)} className="bg-gradient-to-r from-[#08aa87] to-[#083b85] text-white"><Sparkles />{config.primaryAction}</Button></>} />

      {message && <div className="mb-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700"><span className="flex items-center gap-2"><CheckCircle2 className="size-4" />{message}</span><button onClick={() => setMessage('')} className="font-bold">×</button></div>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{config.metrics.map((metric) => <StatCard key={metric.label} {...metric} />)}</div>

      <div className="mt-4 grid gap-4 2xl:grid-cols-[minmax(0,1fr)_280px]">
        <Panel title={config.panelTitle} subtitle={config.panelSubtitle}>
          <div className="flex flex-wrap gap-2 border-b border-slate-100 p-4">
            {config.filterLabels.map((label) => <FilterSelect key={label} label={label} options={[`All ${label}`, `${label} A`, `${label} B`]} />)}
            <label className="min-w-[210px] flex-[2]"><span className="mb-1 block text-[9px] font-semibold text-slate-500">Search</span><span className="relative block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-9 bg-white pl-9 text-xs" placeholder="Search records…" /></span></label>
            <Button variant="outline" className="mt-auto h-9 bg-white"><SlidersHorizontal />Filters</Button>
          </div>
          <div className="overflow-x-auto"><Table>
            <TableHeader><TableRow>{config.columns.map((column) => <TableHead key={column} className="first:pl-4">{column}</TableHead>)}<TableHead>Status</TableHead><TableHead>Score</TableHead><TableHead className="pr-4 text-right">Action</TableHead></TableRow></TableHeader>
            <TableBody>{filtered.map((row) => {
              const done = processed.includes(row.id);
              return <TableRow key={row.id}>{row.cells.map((cell, index) => <TableCell key={`${row.id}-${index}`} className={index === 0 ? 'pl-4 text-xs font-semibold text-[#15345e]' : 'text-[10px] text-slate-500'}>{cell}</TableCell>)}<TableCell><Badge className={badgeClass(done ? 'Complete' : row.status)}>{done ? 'Complete' : row.status}</Badge></TableCell><TableCell>{row.score !== undefined ? <div className="w-24"><div className="mb-1 flex justify-between text-[9px]"><span>{row.score}%</span></div><Progress value={row.score} /></div> : <span className="text-slate-300">—</span>}</TableCell><TableCell className="pr-4 text-right"><Button variant="outline" size="sm" onClick={() => viewRow(row)} disabled={loadingId === row.id}>{loadingId === row.id ? 'Loading…' : 'View'}</Button></TableCell></TableRow>;
            })}</TableBody>
          </Table></div>
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-[10px] text-slate-400"><span>Showing {filtered.length} of {config.rows.length} records</span><span>1 · 2 · 3</span></div>
        </Panel>

        <aside className="space-y-4">
          <Panel title="Smart Insights" subtitle="Based on current dummy data"><div className="space-y-3 p-4">{config.insights.map((item) => <button key={item.title} onClick={() => setMessage(item.text)} className="w-full rounded-xl border border-slate-200 p-3 text-left hover:border-emerald-300"><p className="text-xs font-bold text-[#15345e]">{item.title}</p><p className="mt-1 text-[10px] leading-4 text-slate-500">{item.text}</p></button>)}</div></Panel>
          <Panel title="Activity Summary"><div className="p-4"><div className="grid grid-cols-2 gap-3 text-center"><div className="rounded-xl bg-emerald-50 p-3"><b className="text-xl text-emerald-700">{processed.length}</b><p className="text-[9px] text-emerald-700">Updated now</p></div><div className="rounded-xl bg-blue-50 p-3"><b className="text-xl text-blue-700">{config.rows.length}</b><p className="text-[9px] text-blue-700">Total records</p></div></div></div></Panel>
        </aside>
      </div>

      <Dialog open={Boolean(detail)} onOpenChange={(open) => !open && setDetail(null)}><DialogContent className="sm:max-w-xl"><DialogHeader><DialogTitle>{config.panelTitle} details</DialogTitle><DialogDescription>Further information for record {detail?.id}.</DialogDescription></DialogHeader>{detail && <><div className="grid gap-3 sm:grid-cols-2">{config.columns.map((column, index) => <div key={column} className={index === 0 ? 'rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 sm:col-span-2' : 'rounded-xl bg-slate-50 p-4'}><p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">{column}</p><p className="mt-1.5 text-sm font-semibold text-[#17345f]">{detail.cells[index]}</p></div>)}<div className="rounded-xl bg-slate-50 p-4"><p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Status</p><Badge className={`mt-2 ${badgeClass(processed.includes(detail.id) ? 'Complete' : detail.status)}`}>{processed.includes(detail.id) ? 'Complete' : detail.status}</Badge></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Score</p><p className="mt-1.5 text-sm font-semibold text-[#17345f]">{detail.score !== undefined ? `${detail.score}%` : 'Not scored'}</p></div></div><DialogFooter className="mt-4"><Button variant="outline" onClick={() => setDetail(null)}>Close</Button><Button onClick={() => { process(detail.id); setDetail(null); }} disabled={processed.includes(detail.id)} className="bg-gradient-to-r from-[#08aa87] to-[#083b85] text-white">{processed.includes(detail.id) ? 'Already complete' : 'Mark complete'}</Button></DialogFooter></>}</DialogContent></Dialog>
    </AppShell>
  );
}
