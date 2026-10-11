import { prisma } from '../lib/db';
import { createInitialDatabaseState } from '../lib/demo-data';

export async function seedSupabase() {
  console.log('🌱 Starting Supabase database synchronization & seeding...');

  try {
    await (prisma as any).$queryRaw`SELECT 1`;
  } catch (connErr: any) {
    console.warn('⚠️ Supabase database unreachable or Prisma ungenerated:', connErr?.message);
    throw new Error(`Database connection failed: ${connErr?.message || 'Offline'}`);
  }

  console.log('🌱 Starting Supabase database synchronization & seeding...');
  const state = createInitialDatabaseState();



  // 1. Clean existing records in reverse dependency order
  console.log('Cleaning existing database records...');
  await prisma.nLQueryLog.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.recommendation.deleteMany({});
  await prisma.approval.deleteMany({});
  await prisma.allocationProposal.deleteMany({});
  await prisma.allocationRun.deleteMany({});
  await prisma.importIssue.deleteMany({});
  await prisma.importRow.deleteMany({});
  await prisma.importJob.deleteMany({});
  await prisma.duplicateCandidate.deleteMany({});
  await prisma.transferRequest.deleteMany({});
  await prisma.followUp.deleteMany({});
  await prisma.attendanceRecord.deleteMany({});
  await prisma.classSession.deleteMany({});
  await prisma.waitlistEntry.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.teacherAssignment.deleteMany({});
  await prisma.batch.deleteMany({});
  await prisma.timeSlot.deleteMany({});
  await prisma.courseOffering.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.campus.deleteMany({});
  await prisma.region.deleteMany({});
  await prisma.session.deleteMany({});
  console.log('Cleaned all existing records.');

  // 2. Insert Sessions
  console.log(`Seeding ${state.sessions.length} sessions...`);
  for (const s of state.sessions) {
    await prisma.session.create({
      data: {
        id: s.id,
        name: s.name,
        startDate: new Date(s.startDate),
        endDate: new Date(s.endDate),
        isActive: s.isActive,
      },
    });
  }

  // 3. Insert Regions
  console.log(`Seeding ${state.regions.length} regions...`);
  for (const r of state.regions) {
    await prisma.region.create({
      data: {
        id: r.id,
        name: r.name,
      },
    });
  }

  // 4. Insert Campuses
  console.log(`Seeding ${state.campuses.length} campuses...`);
  for (const c of state.campuses) {
    await prisma.campus.create({
      data: {
        id: c.id,
        name: c.name,
        code: c.code,
        city: c.city,
        regionId: c.regionId,
        genderPolicy: c.genderPolicy as any,
      },
    });
  }

  // 5. Insert Courses
  console.log(`Seeding ${state.courses.length} courses...`);
  for (const c of state.courses) {
    await prisma.course.create({
      data: {
        id: c.id,
        name: c.name,
        code: c.code,
        durationWeeks: c.durationWeeks,
        sessionsPerWeek: c.sessionsPerWeek,
        minAttendancePct: c.minAttendancePct,
        aliases: c.aliases,
      },
    });
  }

  // 6. Insert Offerings
  console.log(`Seeding ${state.offerings.length} course offerings...`);
  for (const o of state.offerings) {
    await prisma.courseOffering.create({
      data: {
        id: o.id,
        sessionId: o.sessionId,
        campusId: o.campusId,
        courseId: o.courseId,
        genderPolicy: o.genderPolicy as any,
        totalCapacity: o.totalCapacity,
      },
    });
  }

  // 7. Insert TimeSlots
  console.log(`Seeding ${state.timeSlots.length} time slots...`);
  for (const t of state.timeSlots) {
    await prisma.timeSlot.create({
      data: {
        id: t.id,
        campusId: t.campusId,
        label: t.label,
        daysMask: t.daysMask,
        startTime: t.startTime,
        endTime: t.endTime,
      },
    });
  }

  // 8. Insert Teachers
  console.log(`Seeding ${state.teachers.length} teachers...`);
  for (const t of state.teachers) {
    await prisma.teacher.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        fullName: t.fullName,
        email: t.email,
        specialization: t.specialization,
        maxWeeklyBatches: t.maxWeeklyBatches,
      },
    });
  }

  // 9. Insert Batches & Teacher Assignments
  console.log(`Seeding ${state.batches.length} batches...`);
  for (const b of state.batches) {
    await prisma.batch.create({
      data: {
        id: b.id,
        name: b.name,
        sessionId: b.sessionId,
        offeringId: b.offeringId,
        campusId: b.campusId,
        timeSlotId: b.timeSlotId,
        capacity: b.capacity,
        minViable: b.minViable,
        genderPolicy: b.genderPolicy as any,
        room: b.room || null,
      },
    });

    if (b.trainerId) {
      await prisma.teacherAssignment.create({
        data: {
          id: `asgn-${b.id}-${b.trainerId}`,
          teacherId: b.trainerId,
          batchId: b.id,
        },
      });
    }
  }

  // 10. Insert Students
  console.log(`Seeding ${state.students.length} students...`);
  const studentChunks = [];
  const chunkSize = 50;
  for (let i = 0; i < state.students.length; i += chunkSize) {
    studentChunks.push(state.students.slice(i, i + chunkSize));
  }
  for (const chunk of studentChunks) {
    await prisma.student.createMany({
      data: chunk.map((s) => ({
        id: s.id,
        fullName: s.fullName,
        normalizedName: s.normalizedName,
        gender: s.gender as any,
        dateOfBirth: new Date(s.dateOfBirth),
        isMinor: s.isMinor,
        phoneNormalized: s.phoneNormalized || null,
        emailNormalized: s.emailNormalized || null,
        cnicHash: s.cnicHash || null,
        cnicMasked: s.cnicMasked || null,
        city: s.city || null,
        hasLaptop: s.hasLaptop,
      })),
    });
  }

  // Also seed duplicate candidate students
  const dupStudents = [];

  for (const d of state.duplicates) {
    dupStudents.push({
      id: d.studentAId,
      fullName: (d as any).studentAName || 'Student A',
      normalizedName: ((d as any).studentAName || 'Student A').toLowerCase(),
      gender: 'MALE' as any,
      dateOfBirth: new Date('2003-08-14'),
      isMinor: false,
      hasLaptop: true,
    });
    dupStudents.push({
      id: d.studentBId,
      fullName: (d as any).studentBName || 'Student B',
      normalizedName: ((d as any).studentBName || 'Student B').toLowerCase(),
      gender: 'MALE' as any,
      dateOfBirth: new Date('2003-08-14'),
      isMinor: false,
      hasLaptop: true,
    });
  }
  await prisma.student.createMany({
    data: dupStudents,
    skipDuplicates: true,
  });

  // 11. Insert Enrollments

  console.log(`Seeding ${state.enrollments.length} enrollments...`);
  const enrChunks = [];
  for (let i = 0; i < state.enrollments.length; i += chunkSize) {
    enrChunks.push(state.enrollments.slice(i, i + chunkSize));
  }
  // Ensure all studentIds referenced by enrollments exist
  const existingStudentIds = new Set((await prisma.student.findMany({ select: { id: true } })).map((s) => s.id));
  const missingStudents = [];
  for (const e of state.enrollments) {
    if (!existingStudentIds.has(e.studentId)) {
      missingStudents.push({
        id: e.studentId,
        fullName: `Student ${e.studentId}`,
        normalizedName: `student ${e.studentId}`,
        gender: 'MALE' as any,
        dateOfBirth: new Date('2004-01-01'),
        isMinor: false,
        hasLaptop: true,
      });
      existingStudentIds.add(e.studentId);
    }
  }
  if (missingStudents.length > 0) {
    await prisma.student.createMany({ data: missingStudents, skipDuplicates: true });
  }

  for (const chunk of enrChunks) {
    await prisma.enrollment.createMany({
      data: chunk.map((e) => ({
        id: e.id,
        studentId: e.studentId,
        batchId: e.batchId,
        sessionId: e.sessionId,
        status: e.status as any,
        allocatedAt: e.allocatedAt ? new Date(e.allocatedAt) : new Date(),
        seatHeldUntil: e.seatHeldUntil ? new Date(e.seatHeldUntil) : null,
      })),
      skipDuplicates: true,
    });
  }


  // 12. Create ClassSessions from attendance records
  console.log('Extracting and creating distinct ClassSessions...');
  const sessionMap = new Map<string, { batchId: string; scheduledAt: Date }>();
  const usedBatchTimes = new Map<string, Set<number>>();
  const sessionDataList: Array<{ id: string; batchId: string; scheduledAt: Date; status: string }> = [];

  for (const att of state.attendanceRecords) {
    if (!sessionMap.has(att.classSessionId)) {
      let timeMs = new Date(att.markedAt).getTime();
      let usedTimes = usedBatchTimes.get(att.batchId);
      if (!usedTimes) {
        usedTimes = new Set<number>();
        usedBatchTimes.set(att.batchId, usedTimes);
      }
      while (usedTimes.has(timeMs)) {
        timeMs += 3600000; // offset by 1 hour
      }
      usedTimes.add(timeMs);
      const scheduledAt = new Date(timeMs);
      sessionMap.set(att.classSessionId, { batchId: att.batchId, scheduledAt });
      sessionDataList.push({
        id: att.classSessionId,
        batchId: att.batchId,
        scheduledAt,
        status: 'HELD',
      });
    }
  }

  await prisma.classSession.createMany({ data: sessionDataList });
  console.log(`Created ${sessionDataList.length} ClassSessions.`);

  // 13. Insert Attendance Records in batches
  const existingEnrollmentIds = new Set((await prisma.enrollment.findMany({ select: { id: true } })).map((e) => e.id));
  const validAttendance = state.attendanceRecords.filter((a) => existingEnrollmentIds.has(a.enrollmentId));
  console.log(`Seeding ${validAttendance.length} attendance records...`);
  const attChunks = [];
  const attChunkSize = 250;
  for (let i = 0; i < validAttendance.length; i += attChunkSize) {
    attChunks.push(validAttendance.slice(i, i + attChunkSize));
  }
  for (const chunk of attChunks) {
    await prisma.attendanceRecord.createMany({
      data: chunk.map((a) => ({
        id: a.id,
        classSessionId: a.classSessionId,
        enrollmentId: a.enrollmentId,
        status: a.status,
        markedById: a.markedById,
        markedAt: new Date(a.markedAt),
      })),
      skipDuplicates: true,
    });
  }


  // 14. Insert Waitlist
  console.log(`Seeding ${state.waitlist.length} waitlist entries...`);
  await prisma.waitlistEntry.createMany({
    data: state.waitlist.map((w) => ({
      id: w.id,
      studentId: w.studentId,
      offeringId: w.offeringId,
      timeSlotIds: w.timeSlotIds,
      appliedAt: new Date(w.appliedAt),
      interviewPassed: w.interviewPassed,
      score: w.score,
      status: w.status,
    })),
  });

  // 15. Insert FollowUps
  const existingEnrollmentIdsForFollowUps = new Set((await prisma.enrollment.findMany({ select: { id: true } })).map((e) => e.id));
  const validFollowUps = state.followUps.filter((f) => existingEnrollmentIdsForFollowUps.has(f.enrollmentId));
  console.log(`Seeding ${validFollowUps.length} follow-up cases...`);
  await prisma.followUp.createMany({
    data: validFollowUps.map((f) => ({
      id: f.id,
      studentId: f.studentId,
      enrollmentId: f.enrollmentId,
      reasonCode: f.reasonCode,
      priority: f.priority as any,
      score: f.score,
      explanation: f.explanation,
      status: f.status,
      createdAt: new Date(f.createdAt),
    })),
    skipDuplicates: true,
  });

  // 16. Insert Duplicates
  const existingStudentIdsForDuplicates = new Set((await prisma.student.findMany({ select: { id: true } })).map((s) => s.id));
  const validDuplicates = state.duplicates.filter((d) => existingStudentIdsForDuplicates.has(d.studentAId) && existingStudentIdsForDuplicates.has(d.studentBId));
  console.log(`Seeding ${validDuplicates.length} duplicate candidates...`);
  await prisma.duplicateCandidate.createMany({
    data: validDuplicates.map((d) => ({
      id: d.id,
      studentAId: d.studentAId,
      studentBId: d.studentBId,
      confidence: d.confidence,
      matchReason: d.matchReason,
      status: d.status,
      campusId: d.campusId,
      detectedAt: new Date(d.detectedAt),
    })),
    skipDuplicates: true,
  });

  // 17. Insert Transfer Requests
  const existingStudentIdsForTransfers = new Set((await prisma.student.findMany({ select: { id: true } })).map((s) => s.id));
  const validTransfers = state.transferRequests.filter((t) => existingStudentIdsForTransfers.has(t.studentId));
  console.log(`Seeding ${validTransfers.length} transfer requests...`);
  await prisma.transferRequest.createMany({
    data: validTransfers.map((t) => ({
      id: t.id,
      studentId: t.studentId,
      enrollmentId: t.enrollmentId,
      currentBatchId: t.currentBatchId,
      targetBatchId: t.targetBatchId,
      currentCampusId: t.currentCampusId,
      targetCampusId: t.targetCampusId,
      isCrossCampus: t.isCrossCampus,
      reason: t.reason,
      status: t.status as any,
      requestedById: t.requestedById,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
    })),
    skipDuplicates: true,
  });


  // 18. Insert Notifications
  console.log(`Seeding ${state.notifications.length} notifications...`);
  await prisma.notification.createMany({
    data: state.notifications.map((n) => ({
      id: n.id,
      role: n.role as any,
      title: n.title,
      message: n.message,
      link: n.link || null,
      priority: n.priority as any,
      read: n.read,
      createdAt: new Date(n.createdAt),
    })),
  });

  // 19. Insert Initial Audit Logs
  console.log(`Seeding ${state.auditLogs.length} audit logs...`);
  await prisma.auditLog.createMany({
    data: state.auditLogs.map((a) => ({
      id: a.id,
      actorId: a.actorId,
      actorRole: a.actorRole as any,
      action: a.action,
      entityType: a.entityType,
      entityId: a.entityId || null,
      details: a.details,
      scopeJson: a.scopeJson as any,
      createdAt: new Date(a.createdAt),
    })),
  });


  console.log('✅ Supabase PostgreSQL seeding completed successfully!');
}

if (process.argv[1]?.includes('seed-supabase')) {
  seedSupabase()
    .catch((err) => {
      console.error('❌ Seeding failed:', err?.message || err);
      process.exit(1);
    })
    .finally(() => {
      if (typeof (prisma as any).$disconnect === 'function') {
        (prisma as any).$disconnect().catch(() => {});
      }
    });
}

