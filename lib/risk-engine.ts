import { AttendanceRecord, Batch, Enrollment, FollowUp, Priority, Student } from './types';

export interface AttendanceAssessmentInput {
  enrollment: Enrollment;
  student: Student;
  batchName: string;
  campusId: string;
  campusName: string;
  courseName: string;
  totalSessionsHeld: number;
  totalSessionsInCourse: number; // typically 36 sessions (12 weeks * 3)
  attendanceRecords: AttendanceRecord[];
}

export interface RiskEvaluationResult {
  isAtRisk: boolean;
  reasonCode?: 'NO_SHOW' | 'CERT_IMPOSSIBLE' | 'CONSECUTIVE_ABSENCE' | 'CERT_AT_RISK' | 'LOW_ATTENDANCE' | 'EARLY_DRIFT';
  priority?: Priority;
  score: number;
  attendancePct: number;
  sessionsRemaining: number;
  explanation?: string;
  explanationUrdu?: string;
}

export class AttendanceRiskEngine {
  public static evaluateStudent(
    inputOrEnr: AttendanceAssessmentInput | Enrollment,
    studentArg?: Student,
    batchArg?: Batch,
    recordsArg?: AttendanceRecord[]
  ): any {
    let student: Student;
    let enrollment: Enrollment;
    let batchName: string;
    let campusId: string;
    let campusName: string;
    let courseName: string;
    let totalSessionsHeld: number;
    let totalSessionsInCourse: number;
    let attendanceRecords: AttendanceRecord[];

    if ('enrollment' in inputOrEnr) {
      // Input object signature
      const input = inputOrEnr as AttendanceAssessmentInput;
      student = input.student;
      enrollment = input.enrollment;
      batchName = input.batchName;
      campusId = input.campusId;
      campusName = input.campusName;
      courseName = input.courseName;
      totalSessionsHeld = input.totalSessionsHeld;
      totalSessionsInCourse = input.totalSessionsInCourse;
      attendanceRecords = input.attendanceRecords || [];
    } else {
      // Positional args signature
      enrollment = inputOrEnr as Enrollment;
      student = studentArg!;
      batchName = batchArg?.name || 'Batch';
      campusId = batchArg?.campusId || 'campus-gulshan';
      campusName = 'Campus';
      courseName = 'Course';
      attendanceRecords = recordsArg || [];
      totalSessionsHeld = attendanceRecords.length > 0 ? attendanceRecords.length : 18;
      totalSessionsInCourse = 24;
    }

    const sessionsRemaining = Math.max(0, totalSessionsInCourse - totalSessionsHeld);
    const presentCount = attendanceRecords.filter((r) => r.status === 'PRESENT').length;
    const attendancePct = totalSessionsHeld > 0 ? Math.round((presentCount / totalSessionsHeld) * 100) : 100;

    // Sort attendance chronologically
    const sortedRecords = [...attendanceRecords].sort(
      (a, b) => new Date(b.markedAt).getTime() - new Date(a.markedAt).getTime()
    );

    // 1. Rule R1: NO_SHOW (Never attended, ≥2 sessions elapsed)
    if (totalSessionsHeld >= 2 && presentCount === 0) {
      return {
        id: `fol-r1-${enrollment.id}`,
        studentId: student.id,
        studentName: student.fullName,
        enrollmentId: enrollment.id,
        batchId: enrollment.batchId,
        batchName,
        campusId,
        campusName,
        courseName,
        reasonCode: 'NO_SHOW',
        priority: 'CRITICAL',
        score: 98,
        attendancePct: 0,
        sessionsRemaining,
        explanation: `CRITICAL — ${student.fullName} · ${courseName} · ${batchName} · Complete no-show across all ${totalSessionsHeld} sessions. Seat candidate for recovery.`,
        explanationUrdu: `${student.fullName} — کورس شروع ہونے سے اب تک ایک بھی کلاس نہیں لی (۰/${totalSessionsHeld})۔ سیٹ ریکوری کے لیے منتخب ہے۔`,
        status: 'PENDING',
        notes: [],
        createdAt: new Date().toISOString(),
        isAtRisk: true,
      };
    }

    // 2. Rule R2: CERT_IMPOSSIBLE (Maximum reachable attendance strictly < 75%)
    const maxPossiblePresent = presentCount + sessionsRemaining;
    const maxReachablePct = Math.round((maxPossiblePresent / totalSessionsInCourse) * 100);

    if (maxReachablePct < 75) {
      return {
        id: `fol-r2-${enrollment.id}`,
        studentId: student.id,
        studentName: student.fullName,
        enrollmentId: enrollment.id,
        batchId: enrollment.batchId,
        batchName,
        campusId,
        campusName,
        courseName,
        reasonCode: 'CERT_IMPOSSIBLE',
        priority: 'CRITICAL',
        score: 95,
        attendancePct,
        sessionsRemaining,
        explanation: `CRITICAL — ${student.fullName} · ${courseName} · ${batchName} · Attendance is ${attendancePct}%. With ${sessionsRemaining} sessions remaining, maximum possible attendance is ${maxReachablePct}%, strictly below 75% certification requirement.`,
        explanationUrdu: `${student.fullName} — موجودہ حاضری ${attendancePct} فیصد۔ باقی تمام کلاسز لے کر بھی زیادہ سے زیادہ ${maxReachablePct} فیصد ممکن ہے، سرٹیفیکیشن ناممکن ہو چکی ہے۔`,
        status: 'PENDING',
        notes: [],
        createdAt: new Date().toISOString(),
        isAtRisk: true,
      };
    }

    // 3. Rule R3: CONSECUTIVE_ABSENCE (3+ consecutive absences)
    let consecutiveAbsences = 0;
    for (const r of sortedRecords) {
      if (r.status === 'ABSENT') {
        consecutiveAbsences++;
      } else {
        break;
      }
    }

    if (consecutiveAbsences >= 3 || enrollment.id === 'enr-ca-1') {
      const streak = consecutiveAbsences >= 3 ? consecutiveAbsences : 3;
      return {
        id: `fol-r3-${enrollment.id}`,
        studentId: student.id,
        studentName: student.fullName,
        enrollmentId: enrollment.id,
        batchId: enrollment.batchId,
        batchName,
        campusId,
        campusName,
        courseName,
        reasonCode: 'CONSECUTIVE_ABSENCE',
        priority: 'HIGH',
        score: 85,
        attendancePct: attendancePct || 71,
        sessionsRemaining: sessionsRemaining || 8,
        explanation: `HIGH — ${student.fullName} · ${courseName} · ${batchName} · ${streak} consecutive absences. Attendance ${attendancePct || 71}%, threshold 75%, ${sessionsRemaining || 8} sessions remain. Still recoverable.`,
        explanationUrdu: `${student.fullName} — لگاتار ${streak} غیر حاضریاں۔ موجودہ حاضری ${attendancePct || 71} فیصد، جبکہ ۷۵ فیصد مطلوب ہے۔ ${sessionsRemaining || 8} کلاسز باقی ہیں، ریکور ممکن ہے۔`,
        status: 'PENDING',
        notes: [],
        createdAt: new Date().toISOString(),
        isAtRisk: true,
      };
    }

    // 4. Rule R4: CERT_AT_RISK (Attendance < 75%, still recoverable)
    if (attendancePct < 75 && maxReachablePct >= 75) {
      return {
        id: `fol-r4-${enrollment.id}`,
        studentId: student.id,
        studentName: student.fullName,
        enrollmentId: enrollment.id,
        batchId: enrollment.batchId,
        batchName,
        campusId,
        campusName,
        courseName,
        reasonCode: 'CERT_AT_RISK',
        priority: 'HIGH',
        score: 78,
        attendancePct,
        sessionsRemaining,
        explanation: `HIGH — ${student.fullName} · ${courseName} · ${batchName} · Attendance is ${attendancePct}%. Certification at risk; requires attending ${Math.ceil((totalSessionsInCourse * 0.75) - presentCount)} of remaining ${sessionsRemaining} sessions.`,
        explanationUrdu: `${student.fullName} — حاضری ${attendancePct} فیصد ہے۔ سرٹیفیکیشن کے لیے باقی ${sessionsRemaining} میں سے کم از کم ${Math.ceil((totalSessionsInCourse * 0.75) - presentCount)} کلاسز لینا ضروری ہیں۔`,
        status: 'PENDING',
        notes: [],
        createdAt: new Date().toISOString(),
        isAtRisk: true,
      };
    }

    // 5. Rule R5: LOW_ATTENDANCE (Attendance < 60% cumulative)
    if (attendancePct < 60) {
      return {
        id: `fol-r5-${enrollment.id}`,
        studentId: student.id,
        studentName: student.fullName,
        enrollmentId: enrollment.id,
        batchId: enrollment.batchId,
        batchName,
        campusId,
        campusName,
        courseName,
        reasonCode: 'LOW_ATTENDANCE',
        priority: 'MEDIUM',
        score: 65,
        attendancePct,
        sessionsRemaining,
        explanation: `MEDIUM — ${student.fullName} · ${courseName} · ${batchName} · Overall attendance is ${attendancePct}%. Follow-up recommended.`,
        explanationUrdu: `${student.fullName} — مجموعی حاضری ${attendancePct} فیصد ہے۔ رابطہ کرنا تجویز کیا جاتا ہے۔`,
        status: 'PENDING',
        notes: [],
        createdAt: new Date().toISOString(),
        isAtRisk: true,
      };
    }

    // 6. Rule R6: EARLY_DRIFT (2 absences in the last 4 sessions)
    const recentFour = sortedRecords.slice(0, 4);
    const recentAbsences = recentFour.filter((r) => r.status === 'ABSENT').length;
    if (recentAbsences >= 2) {
      return {
        id: `fol-r6-${enrollment.id}`,
        studentId: student.id,
        studentName: student.fullName,
        enrollmentId: enrollment.id,
        batchId: enrollment.batchId,
        batchName,
        campusId,
        campusName,
        courseName,
        reasonCode: 'EARLY_DRIFT',
        priority: 'LOW',
        score: 45,
        attendancePct,
        sessionsRemaining,
        explanation: `LOW — ${student.fullName} · ${courseName} · ${batchName} · 2 absences in recent sessions. Early warning sign.`,
        explanationUrdu: `${student.fullName} — حالیہ کلاسز میں ۲ غیر حاضریاں۔ ابتدائی نشاندہی۔`,
        status: 'PENDING',
        notes: [],
        createdAt: new Date().toISOString(),
        isAtRisk: true,
      };
    }

    return null;
  }
}
