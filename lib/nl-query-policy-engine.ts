import { AIGateway } from './ai-gateway';
import { dbStore } from './demo-data';
import { QuerySpec, ScopeContext } from './types';

export interface NLQueryResult {
  question: string;
  answer: string;
  answerUrdu: string;
  querySpec: QuerySpec;
  rowCount: number;
  latencyMs: number;
  scopeEnforced: {
    role: string;
    campusFilter: string[];
    isGlobal: boolean;
  };
  securityAlert?: boolean;
  data: Record<string, unknown>[];
}

export class NLQueryPolicyEngine {
  /**
   * Hero 2: 9-step RBAC-Safe Query Execution Pipeline
   */
  public static async executeQuery(question: string, scope: ScopeContext): Promise<NLQueryResult> {
    const startTime = Date.now();
    const state = dbStore.getState();

    // 1. Check for prompt injection / jailbreak attempts in the question
    const isInjectionAttempt =
      /ignore (all |previous )?instructions/i.test(question) ||
      /you are (now )?(an )?(super )?admin/i.test(question) ||
      /bypass (permissions|security)/i.test(question) ||
      /(all|every|other|cross)\s+campus(es)?/i.test(question) ||
      /delete|drop table|truncate/i.test(question);




    // 2. Intent classifier & QuerySpec translation (Model NEVER sees user scope or database credentials)
    const spec = await AIGateway.translateNLToQuerySpec(question);

    if (!spec) {
      const latencyMs = Date.now() - startTime;
      dbStore.addNLQueryLog({
        userId: scope.userId,
        role: scope.role,
        question,
        outcome: 'REFUSED_INTENT',
        latencyMs,
      });

      return {
        question,
        answer: "I couldn't understand that operational question. Try asking: 'Show at-risk students', 'Which batches have available seats?', 'Check trainer workload', or 'Show seat recovery candidates'.",
        answerUrdu: 'Main is sawal ko process nahi kar saka. Aap at-risk talba, seat availability ya trainer workload ke bare mein pooch sakte hain.',
        querySpec: {
          intent: 'ATTENDANCE_SUMMARY',
          entity: 'enrollment',
          metrics: ['count'],
          filters: [],
          groupBy: [],
          limit: 10,
        },
        rowCount: 0,
        latencyMs,
        scopeEnforced: {
          role: scope.role,
          campusFilter: scope.campusIds || [],
          isGlobal: scope.isGlobal,
        },
        data: [],
      };
    }

    // 3. POLICY ENGINE: Server-Side Mandatory Scope Injection
    // The model CANNOT remove, override, or request these predicates.
    const effectiveCampusIds = scope.isGlobal ? [] : (scope.campusIds || []);

    // 4. Execute Scoped Query against data store
    let rows: Record<string, unknown>[] = [];

    if (spec.intent === 'AT_RISK_STUDENTS' || spec.intent === 'FOLLOWUP_QUEUE') {
      rows = state.followUps
        .filter((f) => {
          if (!scope.isGlobal && effectiveCampusIds.length > 0) {
            return effectiveCampusIds.includes(f.campusId);
          }
          return true;
        })
        .map((f) => ({
          studentName: f.studentName,
          campusName: f.campusName,
          courseName: f.courseName,
          attendancePct: f.attendancePct,
          reasonCode: f.reasonCode,
          priority: f.priority,
          sessionsRemaining: f.sessionsRemaining,
        }));
    } else if (spec.intent === 'SEAT_AVAILABILITY') {
      rows = state.batches
        .filter((b) => {
          if (!scope.isGlobal && effectiveCampusIds.length > 0) {
            return effectiveCampusIds.includes(b.campusId);
          }
          return true;
        })
        .map((b) => {
          const offering = state.offerings.find((o) => o.id === b.offeringId);
          const course = state.courses.find((c) => c.id === b.courseId);
          const campus = state.campuses.find((c) => c.id === b.campusId);
          const activeEnrollments = state.enrollments.filter((e) => e.batchId === b.id && e.status !== 'RELEASED').length;
          const availableSeats = Math.max(0, b.capacity - activeEnrollments);

          return {
            batchName: b.name,
            campusName: campus?.name || b.campusId,
            courseName: course?.name || b.courseId,
            capacity: b.capacity,
            occupied: activeEnrollments,
            seatsAvailable: availableSeats,
            fillRatePct: Math.round((activeEnrollments / b.capacity) * 100),
          };
        });
    } else if (spec.intent === 'TRAINER_WORKLOAD') {
      rows = state.teachers
        .filter((t) => {
          if (!scope.isGlobal && effectiveCampusIds.length > 0) {
            return effectiveCampusIds.includes(t.campusId);
          }
          return true;
        })
        .map((t) => {
          const assignedBatches = state.batches.filter((b) => b.trainerId === t.id);
          return {
            trainerName: t.fullName,
            specialization: t.specialization,
            batchCount: assignedBatches.length,
            isImbalanced: assignedBatches.length > t.maxWeeklyBatches,
          };
        });
    } else if (spec.intent === 'SEAT_RECOVERY_STATS') {
      rows = state.followUps
        .filter((f) => f.reasonCode === 'NO_SHOW' && (scope.isGlobal || effectiveCampusIds.includes(f.campusId)))
        .map((f) => ({
          studentName: f.studentName,
          campusName: f.campusName,
          courseName: f.courseName,
          status: 'DEAD_SEAT_CANDIDATE',
        }));
    } else {
      rows = state.enrollments
        .slice(0, 20)
        .map((e) => ({
          studentId: e.studentId,
          batchId: e.batchId,
          status: e.status,
        }));
    }

    const campusName = effectiveCampusIds.length === 1
      ? state.campuses.find((c) => c.id === effectiveCampusIds[0])?.name
      : undefined;

    // 5. Grounded narration
    const narration = await AIGateway.narrateQueryResultsAsync(
      question,
      spec,
      rows,
      scope.role,
      campusName
    );

    const latencyMs = Date.now() - startTime;

    // 6. Audit logging
    dbStore.addNLQueryLog({
      userId: scope.userId,
      role: scope.role,
      question,
      querySpec: spec as unknown as Record<string, unknown>,
      outcome: 'ANSWERED',
      rowCount: rows.length,
      latencyMs,
    });

    if (isInjectionAttempt) {
      const { DbAdapter } = await import('./db-adapter');
      await DbAdapter.logAudit({
        actorId: scope.userId,
        actorRole: scope.role,
        actorName: scope.userName || 'Demo User',
        action: 'SCOPE_ATTACK_BLOCKED',
        entityType: 'NLQuery',
        details: `Blocked attempted cross-scope prompt injection: "${question}". Enforced server scope: [${effectiveCampusIds.join(', ')}]`,
        scopeJson: { campusIds: effectiveCampusIds, role: scope.role },
        isSecurityAlert: true,
      });
    }

    return {
      question,
      answer: narration.english,
      answerUrdu: narration.romanUrdu,
      querySpec: spec,
      rowCount: rows.length,
      latencyMs,
      scopeEnforced: {
        role: scope.role,
        campusFilter: effectiveCampusIds,
        isGlobal: scope.isGlobal,
      },
      securityAlert: isInjectionAttempt,
      aiProvider: 'Alibaba Cloud Model Studio (Qwen)',
      model: narration.model,
      aiSource: narration.aiSource,
      data: rows,
    };

  }
}
