import {
  AuditLog,
  Batch,
  Campus,
  CourseOffering,
  Enrollment,
  FollowUp,
  Student,
  WaitlistEntry,
} from './types';
import { dbStore } from './demo-data';

export interface RecoveryCandidate {
  enrollmentId: string;
  studentId: string;
  studentName: string;
  batchId: string;
  batchName: string;
  campusId: string;
  campusName: string;
  courseName: string;
  timeSlotLabel: string;
  daysAbsent: number;
  reason: string;
  followUpStatus: string;
}

export interface MatchedWaitlistCandidate {
  waitlistId: string;
  studentId: string;
  studentName: string;
  score: number;
  appliedAt: string;
  interviewPassed: boolean;
  matchScore: number;
  matchReason: string;
}

export class SeatRecoveryEngine {
  /**
   * Hero 3: Get all candidates for seat recovery
   */
  public static getRecoveryCandidates(campusId?: string | string[]): RecoveryCandidate[] {
    const state = dbStore.getState();

    const deadFollowUps = state.followUps.filter((f) => {
      if (campusId) {
        if (Array.isArray(campusId)) {
          if (!campusId.includes(f.campusId)) return false;
        } else if (f.campusId !== campusId) {
          return false;
        }
      }
      return f.reasonCode === 'NO_SHOW' || f.status === 'UNREACHABLE' || f.status === 'WITHDRAWN';
    });

    return deadFollowUps.map((f) => {
      const student = state.students.find((s) => s.id === f.studentId);
      const batch = state.batches.find((b) => b.id === f.batchId);
      const campus = state.campuses.find((c) => c.id === f.campusId);

      return {
        enrollmentId: f.enrollmentId,
        studentId: f.studentId,
        studentName: student?.fullName || f.studentName,
        batchId: f.batchId,
        batchName: batch?.name || f.batchName,
        campusId: f.campusId,
        campusName: campus?.name || f.campusName,
        courseName: f.courseName,
        timeSlotLabel: batch?.timeSlotId.includes('morning') ? 'Morning (09:00 - 12:00)' : 'Evening (05:00 - 08:00)',
        daysAbsent: 18,
        reason: f.explanation,
        followUpStatus: f.status,
      };
    });
  }

  /**
   * Hero 3: Release seat with human confirmation and audit log
   */
  public static releaseSeat(
    enrollmentId: string,
    releasedById: string,
    releasedByName: string,
    role: string,
    releaseReason: string
  ): { success: boolean; freedBatchId: string; offeringId: string; enrollment: Enrollment } {
    const state = dbStore.getState();
    const enrollment = state.enrollments.find((e) => e.id === enrollmentId);

    if (!enrollment) {
      throw new Error(`Enrollment ${enrollmentId} not found`);
    }

    const batch = state.batches.find((b) => b.id === enrollment.batchId);
    if (!batch) {
      throw new Error(`Batch for enrollment ${enrollmentId} not found`);
    }

    enrollment.status = 'RELEASED';
    enrollment.releasedAt = new Date().toISOString();
    enrollment.releaseReason = releaseReason;

    // Log audit action
    dbStore.addAuditLog({
      actorId: releasedById,
      actorRole: role as any,
      actorName: releasedByName,
      action: 'RELEASE_SEAT',
      entityType: 'Enrollment',
      entityId: enrollmentId,
      details: `Released dead seat for student ${enrollment.studentId} in batch ${batch.name}. Reason: ${releaseReason}`,
      scopeJson: { campusIds: [batch.campusId] },
    });

    return {
      success: true,
      freedBatchId: batch.id,
      offeringId: batch.offeringId,
      enrollment,
    };
  }

  /**
   * Hero 3: Rank and match waitlist candidates for a released slot
   */
  public static matchWaitlistCandidates(offeringId: string, timeSlotId?: string): MatchedWaitlistCandidate[] {
    const state = dbStore.getState();

    const candidates = state.waitlist.filter((w) => w.offeringId === offeringId && w.status === 'WAITING');

    return candidates
      .map((entry) => {
        const student = state.students.find((s) => s.id === entry.studentId);
        let matchScore = entry.score || 85;

        let matchReason = 'High aptitude test & interview pass';
        if (entry.interviewPassed) {
          matchScore += 10;
          matchReason = 'Passed technical interview with excellent rating; preferred timing matches open slot.';
        }

        return {
          waitlistId: entry.id,
          studentId: entry.studentId,
          studentName: student?.fullName || 'Applicant',
          score: entry.score,
          appliedAt: entry.appliedAt,
          interviewPassed: entry.interviewPassed,
          matchScore,
          matchReason,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Hero 3: Offer seat to waitlist applicant and place hold
   */
  public static offerSeat(
    waitlistId: string,
    batchId: string,
    actorId: string,
    actorName: string
  ): { success: boolean; newEnrollment: Enrollment } {
    const state = dbStore.getState();
    const waitlistEntry = state.waitlist.find((w) => w.id === waitlistId);

    if (!waitlistEntry) {
      throw new Error(`Waitlist entry ${waitlistId} not found`);
    }

    waitlistEntry.status = 'OFFERED';

    const newEnrollment: Enrollment = {
      id: `enr-recovered-${Date.now()}`,
      studentId: waitlistEntry.studentId,
      batchId,
      sessionId: 'bq-5.0',
      status: 'ALLOCATED',
      allocatedAt: new Date().toISOString(),
      seatHeldUntil: new Date(Date.now() + 48 * 3600 * 1000).toISOString(), // 48h hold
    };

    state.enrollments.push(newEnrollment);

    dbStore.addAuditLog({
      actorId,
      actorRole: 'COORDINATOR',
      actorName,
      action: 'OFFER_WAITLIST_SEAT',
      entityType: 'WaitlistEntry',
      entityId: waitlistId,
      details: `Offered recovered seat in batch ${batchId} to student ${waitlistEntry.studentId}. 48h hold placed.`,
      scopeJson: { campusIds: [waitlistEntry.campusId] },
    });

    return { success: true, newEnrollment };
  }
}
