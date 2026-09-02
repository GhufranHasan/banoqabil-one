'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  PhoneCall,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  UsersRound,
} from 'lucide-react';

import { AppShell, PageSearch } from '@/components/app-shell';
import { PageHeader, Panel, StatCard } from '@/components/dashboard-ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [noteText, setNoteText] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);

  async function loadFollowUps() {
    setLoading(true);
    try {
      const res = await fetch('/api/risk/followups');
      const data = (await res.json()) as any;
      if (data.success) {
        setFollowUps(data.followUps);
      }
    } catch {
      toast.add({ title: 'Error', description: 'Failed to load follow-up queue', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFollowUps();
  }, []);

  async function updateStatus(id: string, status: string, note?: string) {
    try {
      const res = await fetch(`/api/risk/followups/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note }),
      });
      const data = (await res.json()) as any;
      if (data.success) {
        setFollowUps((prev) =>
          prev.map((f) => (f.id === id ? { ...f, status, notes: data.followUp.notes } : f))
        );
        toast.add({ title: 'Status Updated', description: `Follow-up marked as ${status}`, type: 'success' });
        setDetailOpen(false);
      }
    } catch {
      toast.add({ title: 'Update failed', description: 'Could not update status', type: 'error' });
    }
  }

  const visibleList = useMemo(
    () =>
      followUps.filter((item) =>
        `${item.studentName} ${item.courseName} ${item.batchName} ${item.reasonCode}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [followUps, search]
  );

  const criticalCount = followUps.filter((f) => f.priority === 'CRITICAL').length;
  const highCount = followUps.filter((f) => f.priority === 'HIGH').length;

  async function handleReevaluate() {
    setLoading(true);
    try {
      const res = await fetch('/api/risk/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = (await res.json()) as any;
      if (data.success) {
        await loadFollowUps();
        toast.add({
          title: 'Risk Engine Evaluated',
          description: `Evaluated cohort students. ${data.totalFollowUps || followUps.length} students prioritized across rules R1–R6.`,
          type: 'success',
        });
      } else {
        toast.add({ title: 'Evaluation Failed', description: data.error || 'Server error', type: 'error' });
      }
    } catch {
      toast.add({ title: 'Evaluation Failed', description: 'Could not run risk engine evaluation', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="mb-3 flex items-center gap-2 text-[10px] text-slate-400">
        <span>Attendance</span>
        <ArrowRight className="size-3" />
        <span>Attendance Risk Engine & Follow-up Worklist</span>
      </div>

      <PageHeader
        title="Student Follow-up Worklist"
        description="Deterministic risk engine evaluating rules R1–R6. Grounded explanations show mathematically when certification is at risk or impossible."
        actions={
          <Button variant="outline" className="bg-white gap-1.5" onClick={handleReevaluate} disabled={loading}>
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
            Re-evaluate Risk Engine
          </Button>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total At-Risk" value={String(followUps.length)} change="Live evaluated" icon={UsersRound} tone="blue" />
        <StatCard label="Critical (No-show / Lost Cert)" value={String(criticalCount)} change="Immediate action" icon={ShieldAlert} tone="amber" />
        <StatCard label="High (3+ Absences)" value={String(highCount)} change="Recoverable" icon={CircleAlert} tone="amber" />
        <StatCard label="Certification Threshold" value="75%" change="Official Bano Qabil rule" icon={CheckCircle2} tone="green" />
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <Panel
            title="Prioritized Follow-up Queue"
            subtitle="Sorted by calculated risk score and certification deadline urgency"
            action={<PageSearch value={search} onChange={setSearch} placeholder="Search student, batch, rule..." />}
          >
            <div className="p-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="px-4 text-[9px]">Priority</TableHead>
                    <TableHead className="text-[9px]">Student</TableHead>
                    <TableHead className="text-[9px]">Batch / Course</TableHead>
                    <TableHead className="text-[9px]">Attendance</TableHead>
                    <TableHead className="text-[9px]">Grounded Rule Explanation</TableHead>
                    <TableHead className="text-[9px]">Status</TableHead>
                    <TableHead className="text-[9px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleList.slice(0, 10).map((f: any) => (
                    <TableRow key={f.id} className="hover:bg-slate-50/80 transition">
                      <TableCell className="px-4 py-2">
                        <Badge
                          className={cn(
                            'text-[9px] font-bold',
                            f.priority === 'CRITICAL'
                              ? 'bg-red-50 text-red-700'
                              : f.priority === 'HIGH'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-blue-50 text-blue-700'
                          )}
                        >
                          {f.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 font-semibold text-[10px] text-[#17345f]">
                        {f.studentName}
                      </TableCell>
                      <TableCell className="py-2 text-[10px] text-slate-600">
                        {f.courseName} · <span className="font-mono text-blue-700">{f.batchName}</span>
                      </TableCell>
                      <TableCell className="py-2 font-mono text-[10px] text-slate-700">
                        {f.attendancePct}%
                      </TableCell>
                      <TableCell className="py-2 text-[9px] text-slate-600 leading-relaxed max-w-[340px]">
                        <p>{f.explanation}</p>
                        {f.explanationUrdu && (
                          <p className="mt-1 text-[8px] italic text-slate-400">{f.explanationUrdu}</p>
                        )}
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge className="bg-slate-100 text-slate-700 text-[9px]">{f.status}</Badge>
                      </TableCell>
                      <TableCell className="py-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedItem(f);
                            setDetailOpen(true);
                          }}
                          className="h-7 text-[10px]"
                        >
                          Follow-up
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Panel>
        </div>

        <aside className="space-y-4">
          <Panel title="Attendance Risk Rules" action={<Sparkles className="size-4 text-blue-600" />}>
            <div className="space-y-2 p-3 text-xs">
              {[
                ['R1: NO_SHOW (Critical)', '0% attendance, ≥2 sessions elapsed -> Dead seat candidate.'],
                ['R2: CERT_IMPOSSIBLE (Critical)', 'Max reachable attendance < 75% -> Mathematically cannot qualify.'],
                ['R3: CONSECUTIVE_ABSENCE (High)', '3+ consecutive absences (e.g. Ahmed Raza) -> Recoverable.'],
                ['R4: CERT_AT_RISK (High)', 'Attendance < 75% and falling -> Action required.'],
                ['R5: LOW_ATTENDANCE (Medium)', '<60% cumulative attendance.'],
                ['R6: EARLY_DRIFT (Low)', '2 absences in last 4 sessions.'],
              ].map(([code, desc]) => (
                <div key={code} className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                  <p className="font-semibold text-[#17345f] text-[10px]">{code}</p>
                  <p className="mt-0.5 text-[9px] text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Safeguarding Note">
            <div className="p-3 text-[10px] leading-relaxed text-slate-600">
              <p className="font-semibold text-emerald-800">🛡️ Contact Details Protected</p>
              <p className="mt-1">
                Trainers can view risk signals for their own batches but <strong>cannot see phone numbers or CNICs</strong>. Contacting learners and guardians is the Coordinator’s role.
              </p>
            </div>
          </Panel>
        </aside>
      </div>

      {/* Follow-up Action Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Coordinator Follow-up: {selectedItem?.studentName}</DialogTitle>
            <DialogDescription>
              {selectedItem?.batchName} · {selectedItem?.courseName} (Current Attendance: {selectedItem?.attendancePct}%)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
              <p className="font-bold text-[#0a1e4b]">Grounded Risk Evaluation:</p>
              <p className="mt-1">{selectedItem?.explanation}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Coordinator Call Note</label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Called student / guardian; student stated..."
                className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                rows={3}
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                size="sm"
                onClick={() => updateStatus(selectedItem.id, 'CONTACTED', noteText)}
                className="bg-blue-600 text-white text-xs"
              >
                Mark Contacted
              </Button>
              <Button
                size="sm"
                onClick={() => updateStatus(selectedItem.id, 'RESOLVED', noteText)}
                className="bg-emerald-600 text-white text-xs"
              >
                Mark Resolved
              </Button>
              <Button
                size="sm"
                onClick={() => updateStatus(selectedItem.id, 'UNREACHABLE', noteText)}
                className="bg-red-600 text-white text-xs"
              >
                Mark Unreachable (Queue Seat Recovery)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
