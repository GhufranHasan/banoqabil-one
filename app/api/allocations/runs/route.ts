import { NextResponse } from 'next/server';
import { AllocationSolver, computeStateHash } from '@/lib/allocation-solver';
import { resolveScopeContext } from '@/lib/auth-scope';
import { dbStore } from '@/lib/demo-data';

export async function GET(req: Request) {
  const scope = resolveScopeContext(req);
  const state = dbStore.getState();

  return NextResponse.json({
    success: true,
    runs: state.allocationRuns,
    proposals: state.allocationProposals.slice(0, 50),
  });
}

export async function POST(req: Request) {
  const scope = resolveScopeContext(req);
  const state = dbStore.getState();

  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body optional, default to Gulshan & Web Dev demo
    }

    const campusId = body.campusId || scope.campusIds?.[0] || 'campus-gulshan';
    const courseId = body.courseId || 'course-web-dev';
    const mode = (body.mode || 'ALLOCATE') as 'ALLOCATE' | 'REOPTIMIZE';

    const campus = state.campuses.find((c) => c.id === campusId) || state.campuses[0];
    const course = state.courses.find((c) => c.id === courseId) || state.courses[0];
    const candidateBatches = state.batches.filter((b) => b.campusId === campusId && b.courseId === courseId);

    // Prepare student pool for solver
    const unallocatedStudents = state.students.slice(0, 120).map((s, idx) => ({
      id: s.id,
      fullName: s.fullName,
      gender: s.gender,
      preferredTimeSlotIds: idx % 4 === 0 ? ['slot-morning'] : idx % 4 === 1 ? ['slot-evening'] : ['slot-morning', 'slot-evening'],
    }));

    const result = AllocationSolver.solve({
      sessionId: 'bq-5.0',
      campusId,
      courseId,
      mode,
      createdById: scope.userId,
      students: unallocatedStudents,
      batches: candidateBatches,
      campus,
      course,
    });

    // Store in global state
    state.allocationRuns.unshift(result.run);
    state.allocationProposals.unshift(...result.proposals);

    dbStore.addAuditLog({
      actorId: scope.userId,
      actorRole: scope.role,
      actorName: scope.userName || 'Coordinator',
      action: 'RUN_ALLOCATION',
      entityType: 'AllocationRun',
      entityId: result.run.id,
      details: `Generated ${mode} proposal for ${result.stats.totalStudents} students. ${result.stats.allocatedCount} allocated, ${result.stats.unallocatedCount} unallocated.`,
      scopeJson: { campusIds: [campusId] },
    });

    return NextResponse.json({
      success: true,
      run: result.run,
      proposals: result.proposals,
      unallocated: result.unallocated,
      stats: result.stats,
    });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'ALLOCATION_FAILED', message: err.message } }, { status: 500 });
  }
}
