'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  CircleAlert,
  Layers3,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

import { AppShell } from '@/components/app-shell';
import { PageHeader, Panel } from '@/components/dashboard-ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/toast';

export default function AllocationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const [runData, setRunData] = useState<any>(null);
  const [unallocOpen, setUnallocOpen] = useState(false);

  async function runAllocationSolver(mode: 'ALLOCATE' | 'REOPTIMIZE' = 'ALLOCATE') {
    setLoading(true);
    try {
      const res = await fetch('/api/allocations/runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campusId: 'campus-gulshan',
          courseId: 'course-web-dev',
          mode,
        }),
      });
      const data = (await res.json()) as any;
      if (data.success) {
        setRunData(data);
        setApproved(false);
        toast.add({
          title: 'Solver Completed',
          description: `Generated constraint-satisfying batch placement for ${data.stats.totalStudents} students.`,
          type: 'success',
        });
      }
    } catch {
      toast.add({ title: 'Solver failed', description: 'Could not run allocation solver', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runAllocationSolver('ALLOCATE');
  }, []);

  async function handleApprove() {
    if (!runData?.run?.id) return;
    setApproving(true);
    try {
      const res = await fetch(`/api/allocations/runs/${runData.run.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = (await res.json()) as any;
      if (data.success) {
        setApproved(true);
        toast.add({
          title: 'Allocation Approved',
          description: 'Batches published to active schedule. Enrollments committed.',
          type: 'success',
        });
      }
    } catch {
      toast.add({ title: 'Approval failed', description: 'Could not approve allocation run', type: 'error' });
    } finally {
      setApproving(false);
    }
  }

  const proposals = runData?.proposals || [
    { id: 'p1', studentName: 'Ayesha Khan', courseName: 'Web Development', campusName: 'Gulshan Campus', batchName: 'WD-GUL-M-A', timeSlotLabel: 'Morning (09:00 - 12:00)', reasonText: 'Assigned to WD-GUL-M-A matching morning preference and gender policy.', score: 96 },
    { id: 'p2', studentName: 'M. Rehan', courseName: 'Web Development', campusName: 'Gulshan Campus', batchName: 'WD-GUL-E-A', timeSlotLabel: 'Evening (05:00 - 08:00)', reasonText: 'Assigned to WD-GUL-E-A matching evening preference.', score: 92 },
    { id: 'p3', studentName: 'Sana Naveed', courseName: 'Web Development', campusName: 'Gulshan Campus', batchName: 'WD-GUL-M-B', timeSlotLabel: 'Morning (09:00 - 12:00)', reasonText: 'Assigned to Lab 2 morning batch.', score: 88 },
    { id: 'p4', studentName: 'Zain Ali', courseName: 'Web Development', campusName: 'Gulshan Campus', batchName: 'WD-GUL-W-A', timeSlotLabel: 'Weekend (Sat-Sun)', reasonText: 'Assigned to weekend batch.', score: 85 },
    { id: 'p5', studentName: 'Noor Malik', courseName: 'Web Development', campusName: 'Gulshan Campus', batchName: 'WD-GUL-M-A', timeSlotLabel: 'Morning (09:00 - 12:00)', reasonText: 'Assigned to WD-GUL-M-A.', score: 94 },
  ];

  const unallocatedList = runData?.unallocated || [
    { studentId: 'stu-un-1', studentName: 'Tariq Javed', reason: 'Timeslot mismatch: candidate requested Friday morning only, but lab capacity is 100% full.' },
    { studentId: 'stu-un-2', studentName: 'Farhan Siddiqui', reason: 'Lab maximum capacity of 30 students reached in all compatible slots.' },
  ];

  const stats = runData?.stats || {
    totalStudents: 120,
    allocatedCount: 106,
    unallocatedCount: 14,
    batchCount: 4,
    avgFillRate: 88,
  };

  return (
    <AppShell>
      <div className="mb-3 flex items-center gap-2 text-[10px] text-slate-400">
        <span>Allocation</span>
        <ArrowRight className="size-3" />
        <span>Batch Allocation Proposal Review (Hero 1)</span>
      </div>

      <PageHeader
        title="Allocation Proposal Review"
        description="Deterministic CSP constraint solver output for student-to-batch placement. The AI explains, the solver decides."
        actions={
          <>
            <Button variant="outline" className="bg-white" onClick={() => runAllocationSolver('ALLOCATE')} disabled={loading}>
              <RefreshCw className={loading ? 'animate-spin' : ''} />
              Re-solve Fresh
            </Button>
            <Button variant="outline" className="bg-white text-blue-700" onClick={() => runAllocationSolver('REOPTIMIZE')} disabled={loading}>
              <Sparkles />
              Re-optimise (Balance Batches)
            </Button>
          </>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Candidates', value: stats.totalStudents, icon: Users, tone: 'blue' },
          { label: 'Proposed Allocated', value: stats.allocatedCount, icon: CheckCircle2, tone: 'green' },
          { label: 'Unallocated (Queued)', value: stats.unallocatedCount, icon: CircleAlert, tone: 'amber', action: () => setUnallocOpen(true) },
          { label: 'Active Batches', value: `${stats.batchCount} (${stats.avgFillRate}% Fill)`, icon: Layers3, tone: 'violet' },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              onClick={metric.action}
              className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition ${metric.action ? 'cursor-pointer hover:border-amber-400 hover:bg-amber-50/20' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{metric.label}</span>
                <Icon className={`size-5 ${metric.tone === 'green' ? 'text-emerald-500' : metric.tone === 'amber' ? 'text-amber-500' : 'text-blue-500'}`} />
              </div>
              <p className="mt-2 text-2xl font-bold text-[#0a1e4b]">{metric.value}</p>
              {metric.action && <p className="mt-1 text-[10px] font-semibold text-amber-600">Click to view reasons →</p>}
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-4">
          <Panel
            title="Batch Allocation Proposals"
            subtitle={`Solver State Hash: ${runData?.run?.stateHash || 'sh-7a91b'} · Checked capacities, gender segregation, and timeslots`}
            action={
              <div className="flex gap-2">
                <Button
                  onClick={handleApprove}
                  disabled={approving || approved}
                  className={approved ? 'bg-emerald-600 text-white' : 'bg-gradient-to-r from-[#07ae89] to-[#07558a] text-white'}
                >
                  {approved ? <CheckCircle2 /> : <ShieldCheck />}
                  {approved ? 'Batches Published & Approved' : approving ? 'Validating stateHash...' : 'Approve & Publish Batches'}
                </Button>
              </div>
            }
          >
            <div className="p-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="px-4 text-[9px]">Student</TableHead>
                    <TableHead className="text-[9px]">Course</TableHead>
                    <TableHead className="text-[9px]">Assigned Batch</TableHead>
                    <TableHead className="text-[9px]">Timeslot</TableHead>
                    <TableHead className="text-[9px]">Grounded Reason (LLM Narrated)</TableHead>
                    <TableHead className="text-[9px]">Match</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposals.slice(0, 10).map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell className="px-4 py-2 font-medium text-[10px] text-[#17345f]">{p.studentName}</TableCell>
                      <TableCell className="py-2 text-[10px] text-slate-600">{p.courseName}</TableCell>
                      <TableCell className="py-2">
                        <Badge className="bg-blue-50 font-mono text-[9px] text-blue-700">{p.batchName || 'Unallocated'}</Badge>
                      </TableCell>
                      <TableCell className="py-2 text-[9px] text-slate-500">{p.timeSlotLabel || 'Standard'}</TableCell>
                      <TableCell className="py-2 text-[9px] text-slate-600 leading-relaxed">{p.reasonText}</TableCell>
                      <TableCell className="py-2">
                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">{p.score || 90}%</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-100 p-4 sm:flex-row sm:items-center">
              <Button variant="outline" onClick={() => router.push('/imports')}>
                <ArrowLeft />
                Back to Import
              </Button>
              <div className="ml-auto flex gap-2">
                <Button variant="outline" onClick={() => setUnallocOpen(true)}>
                  View Unallocated Candidates ({unallocatedList.length})
                </Button>
                <Button onClick={() => router.push('/seat-recovery')} className="bg-slate-800 text-white">
                  Proceed to Seat Recovery <ArrowRight />
                </Button>
              </div>
            </div>
          </Panel>
        </div>

        <aside className="space-y-4">
          <Panel title="Constraint Solver Rules" action={<BrainCircuit className="size-4 text-emerald-600" />}>
            <div className="space-y-2 p-3 text-xs">
              {[
                ['Hard: Batch Capacity', 'Max 30 students per lab room strictly enforced.'],
                ['Hard: Gender Policy', 'Gulshan (Mixed), Lahore Township (Male Only), Nazimabad (Female Only).'],
                ['Hard: Timeslot Choice', 'Students assigned only to declared available shifts.'],
                ['Soft: Load Balancing', 'Batch sizes balanced to avoid trailing batches < 12.'],
                ['Concurrency Guard', 'State hash checked at approval time to prevent race conditions.'],
              ].map(([rule, desc]) => (
                <div key={rule} className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                  <p className="font-semibold text-[#17345f] text-[10px]">{rule}</p>
                  <p className="mt-0.5 text-[9px] text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Pitch Impact Highlight">
            <div className="p-4 text-xs text-slate-600">
              <p className="font-bold text-[#07558a]">⚡ 90 Seconds vs 2 Days</p>
              <p className="mt-2 text-[10px] leading-relaxed">
                Coordinators previously spent 1–3 days per intake manually sorting registrations by course, campus, and gender in Excel. BanoQabil One solves and explains the allocation in 90 seconds.
              </p>
            </div>
          </Panel>
        </aside>
      </div>

      <Dialog open={unallocOpen} onOpenChange={setUnallocOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Unallocated Students ({unallocatedList.length})</DialogTitle>
            <DialogDescription>
              These applicants could not be placed due to capacity or timeslot constraints. They are queued for Transfer and Waitlist matching.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Detailed Rejection Reason</TableHead>
                  <TableHead>Recommended Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unallocatedList.map((u: any) => (
                  <TableRow key={u.studentId}>
                    <TableCell className="font-semibold text-xs text-[#17345f]">{u.studentName}</TableCell>
                    <TableCell className="text-xs text-slate-600">{u.reason}</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-50 text-amber-700 text-[9px]">Queue Waitlist Offer</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
