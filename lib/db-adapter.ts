import { prisma } from './db';
import { dbStore } from './demo-data';
import { Role } from './types';

export class DbAdapter {
  private static isConnected: boolean | null = null;

  /**
   * Health check to confirm live Supabase connection
   */
  public static async checkConnection(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      DbAdapter.isConnected = true;
      return true;
    } catch (err: any) {
      console.warn('⚠️ Supabase connection unavailable, fallback active:', err.message);
      DbAdapter.isConnected = false;
      return false;
    }
  }

  /**
   * Status reporter for audits
   */
  public static async getActiveDataLayer(): Promise<'Supabase/PostgreSQL' | 'In-memory fallback'> {
    const alive = await DbAdapter.checkConnection();
    return alive ? 'Supabase/PostgreSQL' : 'In-memory fallback';
  }

  /**
   * Audit log persistence: writes to Supabase table AuditLog and mirrors in dbStore
   */
  public static async logAudit(params: {
    actorId: string;
    actorRole: string;
    actorName?: string;
    action: string;
    entityType: string;
    entityId?: string;
    details: string;
    scopeJson?: any;
    isSecurityAlert?: boolean;
  }) {
    // 1. Mirror in-memory
    const memoryLog = dbStore.addAuditLog({
      actorId: params.actorId,
      actorRole: params.actorRole as any,
      actorName: params.actorName || 'System',
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      details: params.details,
      scopeJson: params.scopeJson,
      isSecurityAlert: params.isSecurityAlert,
    });

    // 2. Persist to real Supabase
    try {
      await prisma.auditLog.create({
        data: {
          id: memoryLog.id,
          actorId: params.actorId,
          actorRole: params.actorRole as any,
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId || null,
          details: params.details,
          scopeJson: params.scopeJson || {},
          createdAt: new Date(),
        },
      });
    } catch (err: any) {
      console.warn('Failed to persist audit log to Supabase:', err.message);
    }

    return memoryLog;
  }

  /**
   * Hero 3: Release seat persistence in Supabase
   */
  public static async persistReleaseSeat(
    enrollmentId: string,
    releasedById: string,
    releasedByName: string,
    role: string,
    releaseReason: string
  ) {
    const now = new Date();
    try {
      await prisma.enrollment.update({
        where: { id: enrollmentId },
        data: {
          status: 'RELEASED',
          releasedAt: now,
          releaseReason,
        },
      });

      // Update follow-up status if linked
      await prisma.followUp.updateMany({
        where: { enrollmentId },
        data: { status: 'RESOLVED' },
      });
    } catch (err: any) {
      console.warn('Supabase persistReleaseSeat error:', err.message);
    }

    await DbAdapter.logAudit({
      actorId: releasedById,
      actorRole: role,
      actorName: releasedByName,
      action: 'RELEASE_SEAT',
      entityType: 'Enrollment',
      entityId: enrollmentId,
      details: `Released seat ${enrollmentId}. Reason: ${releaseReason}`,
    });
  }

  /**
   * Hero 3: Waitlist seat offer hold persistence
   */
  public static async persistOfferSeat(
    waitlistEntryId: string,
    offeringId: string,
    batchId: string,
    offeredById: string,
    offeredByName: string,
    role: string
  ) {
    const holdUntil = new Date(Date.now() + 48 * 3600 * 1000); // 48-hour hold
    try {
      await prisma.waitlistEntry.update({
        where: { id: waitlistEntryId },
        data: { status: 'OFFERED' },
      });
    } catch (err: any) {
      console.warn('Supabase persistOfferSeat error:', err.message);
    }

    await DbAdapter.logAudit({
      actorId: offeredById,
      actorRole: role,
      actorName: offeredByName,
      action: 'OFFER_WAITLIST_SEAT',
      entityType: 'WaitlistEntry',
      entityId: waitlistEntryId,
      details: `Offered seat in batch ${batchId} to waitlist entry ${waitlistEntryId} with 48h hold until ${holdUntil.toISOString()}`,
    });
  }

  /**
   * Hero 3: Expire holds
   */
  public static async persistExpireHolds() {
    try {
      await prisma.waitlistEntry.updateMany({
        where: { status: 'OFFERED' },
        data: { status: 'EXPIRED' },
      });
    } catch (err: any) {
      console.warn('Supabase persistExpireHolds error:', err.message);
    }
  }

  /**
   * Hero 1: Allocation Run approval persistence
   */
  public static async persistApproveAllocation(
    runId: string,
    approvedById: string,
    approvedByName: string,
    role: string,
    proposals: Array<{ studentId: string; batchId: string }>
  ) {
    try {
      // Upsert allocation run status
      await prisma.allocationRun.updateMany({
        where: { id: runId },
        data: { status: 'APPROVED', approvedById },
      });

      // Commit proposed enrollments to real database
      for (const p of proposals) {
        if (p.batchId) {
          // Ensure student exists in Supabase to satisfy foreign key
          await prisma.student.upsert({
            where: { id: p.studentId },
            update: {},
            create: {
              id: p.studentId,
              fullName: (p as any).studentName || `Student ${p.studentId}`,
              normalizedName: ((p as any).studentName || `Student ${p.studentId}`).toLowerCase(),
              gender: 'MALE',
              dateOfBirth: new Date('2004-01-01'),
              isMinor: false,
              hasLaptop: true,
            },
          });

          await prisma.enrollment.upsert({
            where: {
              studentId_sessionId: {
                studentId: p.studentId,
                sessionId: 'bq-5.0',
              },
            },
            update: {
              batchId: p.batchId,
              status: 'ALLOCATED',
              allocatedAt: new Date(),
            },
            create: {
              studentId: p.studentId,
              batchId: p.batchId,
              sessionId: 'bq-5.0',
              status: 'ALLOCATED',
              allocatedAt: new Date(),
            },
          });
        }
      }

    } catch (err: any) {
      console.warn('Supabase persistApproveAllocation error:', err.message);
    }

    await DbAdapter.logAudit({
      actorId: approvedById,
      actorRole: role,
      actorName: approvedByName,
      action: 'APPROVE_ALLOCATION',
      entityType: 'AllocationRun',
      entityId: runId,
      details: `Approved allocation run ${runId}, committed ${proposals.length} enrollments.`,
    });
  }

  /**
   * Hero 2: Attendance marking persistence
   */
  public static async persistAttendance(
    batchId: string,
    classSessionId: string,
    scheduledAt: Date,
    records: Array<{ enrollmentId: string; status: string }>,
    markedById: string,
    role: string
  ) {
    try {
      // Ensure class session exists
      await prisma.classSession.upsert({
        where: { id: classSessionId },
        update: { status: 'HELD' },
        create: {
          id: classSessionId,
          batchId,
          scheduledAt,
          status: 'HELD',
        },
      });

      // Upsert attendance records
      for (const r of records) {
        await prisma.attendanceRecord.upsert({
          where: {
            classSessionId_enrollmentId: {
              classSessionId,
              enrollmentId: r.enrollmentId,
            },
          },
          update: {
            status: r.status,
            markedById,
            markedAt: new Date(),
          },
          create: {
            id: `att-${classSessionId}-${r.enrollmentId}`,
            classSessionId,
            enrollmentId: r.enrollmentId,
            status: r.status,
            markedById,
            markedAt: new Date(),
          },
        });
      }
    } catch (err: any) {
      console.warn('Supabase persistAttendance error:', err.message);
    }

    await DbAdapter.logAudit({
      actorId: markedById,
      actorRole: role,
      action: 'MARK_ATTENDANCE',
      entityType: 'ClassSession',
      entityId: classSessionId,
      details: `Marked attendance for ${records.length} students in batch ${batchId}`,
    });
  }

  /**
   * Transfer Request persistence
   */
  public static async persistTransfer(
    transferId: string,
    status: 'APPROVED' | 'REJECTED',
    approvedById: string,
    targetBatchId?: string,
    enrollmentId?: string
  ) {
    try {
      await prisma.transferRequest.update({
        where: { id: transferId },
        data: {
          status: status as any,
          approvedById,
        },
      });

      if (status === 'APPROVED' && enrollmentId && targetBatchId) {
        await prisma.enrollment.update({
          where: { id: enrollmentId },
          data: { batchId: targetBatchId, status: 'TRANSFERRED' },
        });
      }
    } catch (err: any) {
      console.warn('Supabase persistTransfer error:', err.message);
    }
  }

  /**
   * Duplicate resolution persistence
   */
  public static async persistDuplicateResolution(
    duplicateId: string,
    status: 'MERGED' | 'DISMISSED',
    resolvedById: string
  ) {
    try {
      await prisma.duplicateCandidate.update({
        where: { id: duplicateId },
        data: { status },
      });
    } catch (err: any) {
      console.warn('Supabase persistDuplicateResolution error:', err.message);
    }
  }

  /**
   * Notification read state persistence
   */
  public static async persistNotificationRead(id: string) {
    try {
      await prisma.notification.update({
        where: { id },
        data: { read: true },
      });
    } catch (err: any) {
      console.warn('Supabase persistNotificationRead error:', err.message);
    }
  }
}
