import { z } from 'zod';

export type Role = 'STUDENT' | 'TEACHER' | 'COORDINATOR' | 'REGIONAL_MANAGER' | 'SUPER_ADMIN';
export type ScopeType = 'SELF' | 'BATCH' | 'CAMPUS' | 'REGION' | 'GLOBAL';
export type Gender = 'MALE' | 'FEMALE';
export type GenderPolicy = 'MALE_ONLY' | 'FEMALE_ONLY' | 'MIXED';
export type EnrollmentStatus =
  | 'PROPOSED'
  | 'ALLOCATED'
  | 'ACTIVE'
  | 'AT_RISK'
  | 'TRANSFERRED'
  | 'RELEASED'
  | 'DROPPED'
  | 'COMPLETED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export interface ScopeContext {
  userId: string;
  role: Role;
  sessionId: string; // e.g. "bq-5.0"
  userName?: string;
  studentId?: string; // For STUDENT role
  batchIds?: string[]; // For TEACHER role
  campusIds?: string[]; // For COORDINATOR role
  regionIds?: string[]; // For REGIONAL_MANAGER role
  isGlobal: boolean; // For SUPER_ADMIN role
}

export interface Session {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Region {
  id: string;
  name: string;
}

export interface Campus {
  id: string;
  name: string;
  code: string;
  city: string;
  regionId: string;
  genderPolicy: GenderPolicy;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  minAttendancePct: number; // default 75%
  aliases: string[];
}

export interface CourseOffering {
  id: string;
  sessionId: string;
  campusId: string;
  courseId: string;
  genderPolicy: GenderPolicy;
  totalCapacity: number;
}

export interface TimeSlot {
  id: string;
  campusId: string;
  label: string; // "Morning", "Afternoon", "Evening", "Weekend"
  daysMask: number; // e.g. Mon/Wed/Fri or Tue/Thu/Sat
  startTime: string; // "09:00"
  endTime: string; // "12:00"
}

export interface Batch {
  id: string;
  name: string; // e.g. "WD-GUL-M-A"
  sessionId: string;
  offeringId: string;
  campusId: string;
  courseId: string;
  timeSlotId: string;
  capacity: number; // default 30
  minViable: number; // default 12
  genderPolicy: GenderPolicy;
  room?: string;
  trainerId?: string;
}

export interface Student {
  id: string;
  fullName: string;
  normalizedName: string;
  gender: Gender;
  dateOfBirth: string;
  isMinor: boolean;
  phoneNormalized?: string;
  emailNormalized?: string;
  cnicHash?: string;
  cnicMasked?: string; // "•••••-•••••1-2"
  city?: string;
  hasLaptop: boolean;
  sourceReference?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  batchId: string;
  sessionId: string;
  status: EnrollmentStatus;
  allocatedAt: string;
  seatHeldUntil?: string;
  releasedAt?: string;
  releaseReason?: string;
}

export interface ClassSession {
  id: string;
  batchId: string;
  scheduledAt: string;
  status: 'SCHEDULED' | 'HELD' | 'CANCELLED';
}

export interface AttendanceRecord {
  id: string;
  classSessionId: string;
  enrollmentId: string;
  batchId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  markedById: string;
  markedAt: string;
}

export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  specialization: string;
  campusId: string;
  maxWeeklyBatches: number;
}

export interface WaitlistEntry {
  id: string;
  studentId: string;
  offeringId: string;
  campusId: string;
  courseId: string;
  timeSlotIds: string[];
  appliedAt: string;
  interviewPassed: boolean;
  score: number;
  status: 'WAITING' | 'OFFERED' | 'ENROLLED' | 'EXPIRED';
}

export interface AllocationRun {
  id: string;
  sessionId: string;
  campusId: string;
  courseId: string;
  mode: 'ALLOCATE' | 'REOPTIMIZE';
  stateHash: string;
  stats: {
    totalStudents: number;
    allocatedCount: number;
    unallocatedCount: number;
    batchCount: number;
    avgFillRate: number;
  };
  status: ApprovalStatus;
  createdById: string;
  approvedById?: string;
  createdAt: string;
}

export interface AllocationProposal {
  id: string;
  runId: string;
  studentId: string;
  studentName: string;
  courseName: string;
  campusName: string;
  batchId?: string;
  batchName?: string;
  timeSlotLabel?: string;
  reasonCode: string;
  reasonText: string;
  isFeasible: boolean;
  score: number;
}

export interface FollowUp {
  id: string;
  studentId: string;
  studentName: string;
  enrollmentId: string;
  batchId: string;
  batchName: string;
  campusId: string;
  campusName: string;
  courseName: string;
  reasonCode: 'NO_SHOW' | 'CERT_IMPOSSIBLE' | 'CONSECUTIVE_ABSENCE' | 'CERT_AT_RISK' | 'LOW_ATTENDANCE' | 'EARLY_DRIFT';
  priority: Priority;
  score: number;
  explanation: string;
  explanationUrdu?: string;
  attendancePct: number;
  sessionsRemaining: number;
  status: 'PENDING' | 'CONTACTED' | 'RESOLVED' | 'UNREACHABLE' | 'WITHDRAWN';
  assignedToId?: string;
  notes: Array<{ id: string; author: string; text: string; createdAt: string }>;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: Role;
  actorName: string;
  action: string;
  entityType: string;
  entityId?: string;
  details: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  scopeJson: Partial<ScopeContext>;
  ip?: string;
  createdAt: string;
  isSecurityAlert?: boolean;
}

export interface NLQueryLog {
  id: string;
  userId: string;
  role: Role;
  question: string;
  querySpec?: Record<string, unknown>;
  compiledSql?: string;
  outcome: 'ANSWERED' | 'REFUSED_INTENT' | 'REFUSED_POLICY' | 'ERROR';
  rowCount?: number;
  latencyMs?: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId?: string;
  role?: Role;
  title: string;
  message: string;
  link?: string;
  priority: Priority;
  read: boolean;
  createdAt: string;
}

export interface DuplicateCandidate {
  id: string;
  studentAId: string;
  studentAName: string;
  studentBId: string;
  studentBName: string;
  confidence: 'CERTAIN' | 'LIKELY' | 'POSSIBLE';
  matchReason: string;
  status: 'PENDING' | 'MERGED' | 'DISMISSED';
  campusId: string;
  detectedAt: string;
}

export interface TransferRequest {
  id: string;
  enrollmentId: string;
  studentId: string;
  studentName: string;
  currentBatchId: string;
  currentBatchName: string;
  targetBatchId: string;
  targetBatchName: string;
  currentCampusId: string;
  currentCampusName: string;
  targetCampusId: string;
  targetCampusName: string;
  isCrossCampus: boolean;
  reason: string;
  status: ApprovalStatus;
  requestedById: string;
  approvedById?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImportJob {
  id: string;
  fileName: string;
  totalRows: number;
  validRows: number;
  quarantinedRows: number;
  status: 'PENDING' | 'MAPPED' | 'COMMITTED' | 'FAILED';
  mappings: Array<{
    sourceHeader: string;
    suggestedField: string;
    confidence: string;
    confidenceScore: number;
    status: string;
    sampleValues: string[];
    reason?: string;
  }>;
  uploadedById: string;
  uploadedAt: string;
  sampleRows: any[];
  quarantinedList?: any[];
}

export interface ImportRow {
  id: string;
  jobId: string;
  rowNumber: number;
  rawData: Record<string, any>;
  parsedData?: Record<string, any>;
  isQuarantine: boolean;
}

export interface ImportIssue {
  id: string;
  jobId: string;
  rowNumber: number;
  field: string;
  issueType: 'MISSING_CNIC' | 'INVALID_PHONE' | 'PROMPT_INJECTION' | 'INVALID_NAME';
  message: string;
}

export interface Recommendation {
  id: string;
  type: 'SEAT_RECOVERY' | 'BATCH_SPLIT' | 'TRAINER_REBALANCE' | 'TRANSFER';
  title: string;
  description: string;
  impactScore: number;
  metadata: Record<string, any>;
  status: 'OPEN' | 'APPLIED' | 'DISMISSED';
  createdAt: string;
}

export interface Approval {
  id: string;
  entityType: 'ALLOCATION_RUN' | 'TRANSFER_REQUEST' | 'DEAD_SEAT_RELEASE' | 'DUPLICATE_MERGE';
  entityId: string;
  status: ApprovalStatus;
  requestedBy: string;
  reviewedBy?: string;
  decision?: string;
  comments?: string;
  createdAt: string;
  resolvedAt?: string;
}

// Zod schema for RBAC Safe Query Spec
export const QuerySpecSchema = z.object({
  intent: z.enum([
    'ATTENDANCE_SUMMARY',
    'AT_RISK_STUDENTS',
    'SEAT_AVAILABILITY',
    'BATCH_ROSTER',
    'BATCH_FILL',
    'TRAINER_WORKLOAD',
    'FOLLOWUP_QUEUE',
    'ENROLMENT_COUNT',
    'COURSE_DEMAND',
    'DUPLICATE_FLAGS',
    'MY_ATTENDANCE',
    'MY_SCHEDULE',
    'SEAT_RECOVERY_STATS',
  ]),
  entity: z.enum(['student', 'batch', 'campus', 'course', 'trainer', 'enrollment', 'followup', 'waitlist']),
  metrics: z.array(
    z.enum(['count', 'avg_attendance_pct', 'seats_available', 'batch_count', 'absence_streak', 'fill_rate', 'recovered_seats'])
  ).max(4),
  filters: z.array(
    z.object({
      field: z.enum(['course', 'campus', 'timeslot', 'gender', 'attendance_pct', 'absence_streak', 'batch', 'status', 'priority']),
      op: z.enum(['eq', 'lt', 'gt', 'lte', 'gte', 'in', 'contains']),
      value: z.union([z.string(), z.number(), z.array(z.string())]),
    })
  ).max(5),
  groupBy: z.array(z.enum(['campus', 'course', 'timeslot', 'batch', 'trainer', 'priority', 'status'])).max(2),
  orderBy: z.object({ field: z.string(), dir: z.enum(['asc', 'desc']) }).optional(),
  limit: z.number().int().min(1).max(200).default(50),
});

export type QuerySpec = z.infer<typeof QuerySpecSchema>;
