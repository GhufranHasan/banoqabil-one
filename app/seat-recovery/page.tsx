'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  RefreshCw,
  Send,
  ShieldAlert,
  Sparkles,
  TicketCheck,
  UserRoundCheck,
  UsersRound,
  Workflow,
} from 'lucide-react';

import { AppShell, PageSearch } from '@/components/app-shell';
import { PageHeader, Panel, StatCard } from '@/components/dashboard-ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

export default function SeatRecoveryPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [waitlistMatches, setWaitlistMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [releasing, setReleasing] = useState(false);
  const [offering, setOffering] = useState(false);
  const [offeredWaitlistIds, setOfferedWaitlistIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  async function loadRecoveryData() {
    setLoading(true);
    try {
      const res = await fetch('/api/seats/recovery-candidates');
      const data = (await res.json()) as any;
      if (data.success) {
        setCandidates(data.candidates);
        if (data.candidates.length > 0) {
          setSelectedCandidate(data.candidates[0]);
        }
      }

      const matchRes = await fetch('/api/waitlist/matches?offeringId=off-gul-wd');
      const matchData = (await matchRes.json()) as any;
      if (matchData.success) {
        setWaitlistMatches(matchData.matches);
      }
    } catch {
      toast.add({ title: 'Error', description: 'Failed to load recovery data', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecoveryData();
  }, []);

  async function handleReleaseSeat(candidate: any) {
    if (!candidate) return;
    setReleasing(true);
    try {
      const res = await fetch(`/api/seats/${candidate.enrollmentId}/release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Unreachable after repeated coordinator contact; complete no-show across first 6 weeks.' }),
      });
      const data = (await res.json()) as any;
      if (data.success) {
        toast.add({
          title: 'Seat Released & Recovered',
          description: `Dead seat in ${candidate.batchName} released. Matched ${data.matches.length} waitlist candidates.`,
          type: 'success',
        });
        setCandidates((prev) => {
          const remaining = prev.filter((c) => c.enrollmentId !== candidate.enrollmentId);
          setSelectedCandidate(remaining.length > 0 ? remaining[0] : null);
          return remaining;
        });
        setWaitlistMatches(data.matches || []);
        setMessage(`Seat released for ${candidate.studentName}. Ready to offer to top waitlist applicant.`);
      }
    } catch {
      toast.add({ title: 'Release failed', description: 'Could not release seat', type: 'error' });
    } finally {
      setReleasing(false);
    }
  }

  async function handleOfferWaitlist(match: any) {
    if (!match) return;
    setOffering(true);
    try {
      const res = await fetch(`/api/waitlist/${match.waitlistId}/offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId: selectedCandidate?.batchId || 'batch-wd-gul-m-a' }),
      });
      const data = (await res.json()) as any;
      if (data.success) {
        setOfferedWaitlistIds((prev) => [...prev, match.waitlistId]);
        toast.add({
          title: 'Seat Offered',
          description: `Recovered seat in ${selectedCandidate?.batchName || 'WD-GUL-M-A'} offered to ${match.studentName}. 48h reservation hold placed.`,
          type: 'success',
        });
      }
    } catch {
      toast.add({ title: 'Offer failed', description: 'Could not send offer', type: 'error' });
    } finally {
      setOffering(false);
    }
  }

  const visibleCandidates = useMemo(
    () =>
      candidates.filter((item) =>
        `${item.studentName} ${item.courseName} ${item.batchName}`.toLowerCase().includes(search.toLowerCase())
      ),
    [candidates, search]
  );

  return (
    <AppShell role="Coordinator">
      <div className="mb-3 flex items-center gap-2 text-[10px] text-slate-400">
        <span>Seat Operations</span>
        <ArrowRight className="size-3" />
        <span>Seat Recovery & Waitlist Matching (Hero 3)</span>
      </div>

      <PageHeader
        title="Seat Recovery & Waitlist Matching"
        description="Detect enrolled students who never attended, confirm follow-up outcome, release wasted seats, and backfill qualified waitlisted applicants."
        actions={
          <Button variant="outline" className="bg-white" onClick={loadRecoveryData} disabled={loading}>
            <RefreshCw className={loading ? 'animate-spin' : ''} />
            Refresh Queue
          </Button>
        }
      />

      {message && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
          {message}
        </div>
      )}

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Dead Seats Detected" value={String(candidates.length)} change="15 in Gulshan" icon={ShieldAlert} tone="amber" />
        <StatCard label="Potential Impact" value={`+${candidates.length} Youth`} change="Zero extra funding" icon={Sparkles} tone="green" />
        <StatCard label="Waitlist Backlog" value="120" change="Interview passed" icon={UsersRound} tone="blue" />
        <StatCard label="Reservation Hold" value="48 Hours" change="Auto-return if unclaimed" icon={Clock3} tone="violet" />
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        {/* Left: Dead Seats Candidates */}
        <div className="space-y-4">
          <Panel
            title="Dead Seat Recovery Candidates"
            subtitle="Students with 0% attendance across first 6 weeks and unreachable follow-up attempts"
            action={<PageSearch value={search} onChange={setSearch} placeholder="Search candidate..." />}
          >
            <div className="p-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="px-4 text-[9px]">Student</TableHead>
                    <TableHead className="text-[9px]">Course / Batch</TableHead>
                    <TableHead className="text-[9px]">Attendance Proof</TableHead>
                    <TableHead className="text-[9px]">Follow-up Status</TableHead>
                    <TableHead className="text-[9px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleCandidates.slice(0, 8).map((c: any) => (
                    <TableRow
                      key={c.enrollmentId}
                      className={cn(
                        'cursor-pointer transition',
                        selectedCandidate?.enrollmentId === c.enrollmentId ? 'bg-blue-50/60 font-semibold' : ''
                      )}
                      onClick={() => setSelectedCandidate(c)}
                    >
                      <TableCell className="px-4 py-2 font-medium text-[10px] text-[#17345f]">
                        {c.studentName}
                      </TableCell>
                      <TableCell className="py-2 text-[10px] text-slate-600">
                        {c.courseName} · <span className="font-mono text-blue-700">{c.batchName}</span>
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge className="bg-red-50 text-red-700 font-mono text-[9px]">
                          0/18 Classes (0%)
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge className="bg-amber-50 text-amber-700 text-[9px]">{c.followUpStatus}</Badge>
                      </TableCell>
                      <TableCell className="py-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={releasing}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReleaseSeat(c);
                          }}
                          className="h-7 border-red-200 bg-red-50/50 text-[10px] text-red-700 hover:bg-red-100"
                        >
                          Release Seat
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {visibleCandidates.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-xs text-slate-400">
                        All dead seats successfully released and backfilled from waitlist!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Panel>
        </div>

        {/* Right: Waitlist Matching & Immediate Backfill */}
        <aside className="space-y-4">
          <Panel
            title="Instant Waitlist Backfill"
            subtitle={selectedCandidate ? `Matching for freed seat in ${selectedCandidate.batchName}` : 'Select a candidate'}
            action={<Sparkles className="size-4 text-emerald-600" />}
          >
            <div className="space-y-3 p-4">
              {waitlistMatches.slice(0, 4).map((w: any) => {
                const isOffered = offeredWaitlistIds.includes(w.waitlistId);
                return (
                  <div
                    key={w.waitlistId}
                    className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-emerald-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-xs text-[#0a1e4b]">{w.studentName}</p>
                        <p className="text-[10px] text-slate-500">
                          Aptitude: {w.score}% · Interview: <span className="text-emerald-600 font-semibold">Passed</span>
                        </p>
                      </div>
                      <Badge className="bg-emerald-50 font-bold text-emerald-700 text-[10px]">
                        {w.matchScore}% Match
                      </Badge>
                    </div>
                    <p className="mt-2 text-[9px] text-slate-500 leading-relaxed">{w.matchReason}</p>
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
                      <span className="flex items-center gap-1 text-[9px] text-slate-400">
                        <Clock3 className="size-3" /> 48h hold
                      </span>
                      <Button
                        size="sm"
                        disabled={offering || isOffered}
                        onClick={() => handleOfferWaitlist(w)}
                        className={cn(
                          'h-7 text-[10px]',
                          isOffered
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gradient-to-r from-[#07ae89] to-[#07558a] text-white'
                        )}
                      >
                        {isOffered ? <CheckCircle2 className="size-3" /> : <Send className="size-3" />}
                        {isOffered ? 'Offer Sent & Seat Held' : 'Offer Seat'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Hero 3 Impact Pitch Statement">
            <div className="rounded-xl bg-gradient-to-br from-[#07475b] to-[#032976] p-4 text-white">
              <p className="text-xs font-bold text-[#c6ef33]">🎯 High-Leverage Impact</p>
              <p className="mt-2 text-[11px] leading-relaxed text-blue-100/90">
                “This session, BanoQabil One recovered <strong>15 dead seats</strong> in one campus alone. Across 220 campuses, that represents <strong>thousands of additional Pakistani youth trained</strong> at zero additional classroom or trainer cost.”
              </p>
            </div>
          </Panel>
        </aside>
      </div>
    </AppShell>
  );
}
