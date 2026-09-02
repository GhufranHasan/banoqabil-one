import {
  AllocationProposal,
  AllocationRun,
  Approval,
  AttendanceRecord,
  AuditLog,
  Batch,
  Campus,
  Course,
  CourseOffering,
  DuplicateCandidate,
  Enrollment,
  FollowUp,
  Gender,
  ImportJob,
  NLQueryLog,
  Notification,
  Recommendation,
  Region,
  Session,
  Student,
  Teacher,
  TimeSlot,
  TransferRequest,
  WaitlistEntry,
} from './types';

export interface DatabaseState {
  sessions: Session[];
  regions: Region[];
  campuses: Campus[];
  courses: Course[];
  offerings: CourseOffering[];
  timeSlots: TimeSlot[];
  batches: Batch[];
  teachers: Teacher[];
  students: Student[];
  enrollments: Enrollment[];
  attendanceRecords: AttendanceRecord[];
  waitlist: WaitlistEntry[];
  allocationRuns: AllocationRun[];
  allocationProposals: AllocationProposal[];
  followUps: FollowUp[];
  duplicates: DuplicateCandidate[];
  transferRequests: TransferRequest[];
  importJobs: ImportJob[];
  recommendations: Recommendation[];
  approvals: Approval[];
  auditLogs: AuditLog[];
  nlQueryLogs: NLQueryLog[];
  notifications: Notification[];
}

function createInitialDatabaseState(): DatabaseState {
  const sessions: Session[] = [
    {
      id: 'bq-5.0',
      name: 'Bano Qabil 5.0 — Spring 2026',
      startDate: '2026-01-03',
      endDate: '2026-04-15',
      isActive: true,
    },
  ];

  const regions: Region[] = [
    { id: 'region-sindh-south', name: 'Sindh South (Karachi)' },
    { id: 'region-central-punjab', name: 'Central Punjab (Lahore)' },
    { id: 'region-isb-ict', name: 'Islamabad Capital Territory (ICT)' },
    { id: 'region-rwp-north', name: 'Rawalpindi & Potohar' },
  ];

  const campuses: Campus[] = [
    {
      id: 'campus-gulshan',
      name: 'Gulshan Campus, Karachi',
      code: 'GUL',
      city: 'Karachi',
      regionId: 'region-sindh-south',
      genderPolicy: 'MIXED',
    },
    {
      id: 'campus-lahore-township',
      name: 'Lahore Township Campus',
      code: 'LHR-TWN',
      city: 'Lahore',
      regionId: 'region-central-punjab',
      genderPolicy: 'MALE_ONLY',
    },
    {
      id: 'campus-nazimabad-girls',
      name: 'Nazimabad Girls Campus',
      code: 'NZM-GRL',
      city: 'Karachi',
      regionId: 'region-sindh-south',
      genderPolicy: 'FEMALE_ONLY',
    },

    // Islamabad Campuses
    {
      id: 'campus-isb-i8',
      name: 'I-8 Campus, Islamabad (Jamia Masjid Al Furqan)',
      code: 'ISB-I8',
      city: 'Islamabad',
      regionId: 'region-isb-ict',
      genderPolicy: 'MIXED',
    },
    {
      id: 'campus-isb-h8',
      name: 'H-8 Campus, Islamabad (Jamia Tafheem-ul-Quran)',
      code: 'ISB-H8',
      city: 'Islamabad',
      regionId: 'region-isb-ict',
      genderPolicy: 'MIXED',
    },
    {
      id: 'campus-isb-g12',
      name: 'G-12 Campus, Islamabad (Lahore Leads University)',
      code: 'ISB-G12',
      city: 'Islamabad',
      regionId: 'region-isb-ict',
      genderPolicy: 'MIXED',
    },
    {
      id: 'campus-isb-kyani',
      name: 'Kyani Road Campus, Bharakhu (Ghazali Premier Schools)',
      code: 'ISB-KYN',
      city: 'Islamabad',
      regionId: 'region-isb-ict',
      genderPolicy: 'MIXED',
    },
    {
      id: 'campus-isb-cbr',
      name: 'CBR Town Campus, Islamabad',
      code: 'ISB-CBR',
      city: 'Islamabad',
      regionId: 'region-isb-ict',
      genderPolicy: 'MIXED',
    },
    {
      id: 'campus-isb-kahuta',
      name: 'Kahuta Road Campus (Alkhidmat IT Training Center)',
      code: 'ISB-KHT',
      city: 'Islamabad',
      regionId: 'region-isb-ict',
      genderPolicy: 'MIXED',
    },
    {
      id: 'campus-isb-burma',
      name: 'Burma Town Campus, Islamabad',
      code: 'ISB-BRM',
      city: 'Islamabad',
      regionId: 'region-isb-ict',
      genderPolicy: 'MIXED',
    },

    // Rawalpindi Campuses & Hubs
    {
      id: 'campus-rwp-rcc',
      name: 'Rawalpindi College of Commerce (Assessment & Intake Hub)',
      code: 'RWP-RCC',
      city: 'Rawalpindi',
      regionId: 'region-rwp-north',
      genderPolicy: 'MIXED',
    },
    {
      id: 'campus-rwp-satellite',
      name: 'Government College Satellite Town, Rawalpindi',
      code: 'RWP-ST',
      city: 'Rawalpindi',
      regionId: 'region-rwp-north',
      genderPolicy: 'MIXED',
    },
  ];

  const courses: Course[] = [
    {
      id: 'course-web-dev',
      name: 'Web Development',
      code: 'WD',
      durationWeeks: 12,
      sessionsPerWeek: 3,
      minAttendancePct: 75,
      aliases: ['Web Dev', 'web development', 'WebDev', 'Web & App', 'ویب ڈیولپمنٹ', 'Web Devlopment'],
    },
    {
      id: 'course-graphic-design',
      name: 'Graphic Design',
      code: 'GD',
      durationWeeks: 12,
      sessionsPerWeek: 3,
      minAttendancePct: 75,
      aliases: ['Graphic Designing', 'GD', 'گرافک ڈیزائن', 'Graphics'],
    },
    {
      id: 'course-digital-marketing',
      name: 'Digital Marketing',
      code: 'DM',
      durationWeeks: 12,
      sessionsPerWeek: 3,
      minAttendancePct: 75,
      aliases: ['Digital Mktg', 'SEO / SMM', 'ڈیجیٹل مارکیٹنگ', 'Marketing'],
    },
    {
      id: 'course-cyber-security',
      name: 'Cyber Security',
      code: 'CS',
      durationWeeks: 12,
      sessionsPerWeek: 3,
      minAttendancePct: 75,
      aliases: ['Cyber Sec', 'Ethical Hacking', 'سائبر سیکیورٹی', 'InfoSec'],
    },
  ];

  const timeSlots: TimeSlot[] = [
    { id: 'slot-morning', campusId: 'campus-gulshan', label: 'Morning (09:00 - 12:00)', daysMask: 42, startTime: '09:00', endTime: '12:00' },
    { id: 'slot-afternoon', campusId: 'campus-gulshan', label: 'Afternoon (01:00 - 04:00)', daysMask: 42, startTime: '13:00', endTime: '16:00' },
    { id: 'slot-evening', campusId: 'campus-gulshan', label: 'Evening (05:00 - 08:00)', daysMask: 42, startTime: '17:00', endTime: '20:00' },
    { id: 'slot-weekend', campusId: 'campus-gulshan', label: 'Weekend (Sat-Sun)', daysMask: 3, startTime: '10:00', endTime: '14:00' },
  ];

  const offerings: CourseOffering[] = [
    { id: 'off-gul-wd', sessionId: 'bq-5.0', campusId: 'campus-gulshan', courseId: 'course-web-dev', genderPolicy: 'MIXED', totalCapacity: 180 },
    { id: 'off-gul-gd', sessionId: 'bq-5.0', campusId: 'campus-gulshan', courseId: 'course-graphic-design', genderPolicy: 'MIXED', totalCapacity: 120 },
    { id: 'off-gul-dm', sessionId: 'bq-5.0', campusId: 'campus-gulshan', courseId: 'course-digital-marketing', genderPolicy: 'MIXED', totalCapacity: 120 },
    { id: 'off-gul-cs', sessionId: 'bq-5.0', campusId: 'campus-gulshan', courseId: 'course-cyber-security', genderPolicy: 'MIXED', totalCapacity: 90 },

    { id: 'off-lhr-wd', sessionId: 'bq-5.0', campusId: 'campus-lahore-township', courseId: 'course-web-dev', genderPolicy: 'MALE_ONLY', totalCapacity: 150 },
    { id: 'off-lhr-gd', sessionId: 'bq-5.0', campusId: 'campus-lahore-township', courseId: 'course-graphic-design', genderPolicy: 'MALE_ONLY', totalCapacity: 120 },
    { id: 'off-lhr-dm', sessionId: 'bq-5.0', campusId: 'campus-lahore-township', courseId: 'course-digital-marketing', genderPolicy: 'MALE_ONLY', totalCapacity: 90 },
    { id: 'off-lhr-cs', sessionId: 'bq-5.0', campusId: 'campus-lahore-township', courseId: 'course-cyber-security', genderPolicy: 'MALE_ONLY', totalCapacity: 90 },

    { id: 'off-nzm-wd', sessionId: 'bq-5.0', campusId: 'campus-nazimabad-girls', courseId: 'course-web-dev', genderPolicy: 'FEMALE_ONLY', totalCapacity: 120 },
    { id: 'off-nzm-gd', sessionId: 'bq-5.0', campusId: 'campus-nazimabad-girls', courseId: 'course-graphic-design', genderPolicy: 'FEMALE_ONLY', totalCapacity: 120 },
    { id: 'off-nzm-dm', sessionId: 'bq-5.0', campusId: 'campus-nazimabad-girls', courseId: 'course-digital-marketing', genderPolicy: 'FEMALE_ONLY', totalCapacity: 90 },
    { id: 'off-nzm-cs', sessionId: 'bq-5.0', campusId: 'campus-nazimabad-girls', courseId: 'course-cyber-security', genderPolicy: 'FEMALE_ONLY', totalCapacity: 60 },

    // Islamabad Offerings
    { id: 'off-isb-i8-wd', sessionId: 'bq-5.0', campusId: 'campus-isb-i8', courseId: 'course-web-dev', genderPolicy: 'MIXED', totalCapacity: 120 },
    { id: 'off-isb-i8-gd', sessionId: 'bq-5.0', campusId: 'campus-isb-i8', courseId: 'course-graphic-design', genderPolicy: 'MIXED', totalCapacity: 90 },
    { id: 'off-isb-i8-dm', sessionId: 'bq-5.0', campusId: 'campus-isb-i8', courseId: 'course-digital-marketing', genderPolicy: 'MIXED', totalCapacity: 90 },
    { id: 'off-isb-i8-cs', sessionId: 'bq-5.0', campusId: 'campus-isb-i8', courseId: 'course-cyber-security', genderPolicy: 'MIXED', totalCapacity: 60 },
    { id: 'off-isb-h8-wd', sessionId: 'bq-5.0', campusId: 'campus-isb-h8', courseId: 'course-web-dev', genderPolicy: 'MIXED', totalCapacity: 90 },
    { id: 'off-isb-g12-wd', sessionId: 'bq-5.0', campusId: 'campus-isb-g12', courseId: 'course-web-dev', genderPolicy: 'MIXED', totalCapacity: 90 },
    { id: 'off-isb-kyani-gd', sessionId: 'bq-5.0', campusId: 'campus-isb-kyani', courseId: 'course-graphic-design', genderPolicy: 'MIXED', totalCapacity: 60 },
    { id: 'off-isb-cbr-dm', sessionId: 'bq-5.0', campusId: 'campus-isb-cbr', courseId: 'course-digital-marketing', genderPolicy: 'MIXED', totalCapacity: 60 },
    { id: 'off-isb-kahuta-wd', sessionId: 'bq-5.0', campusId: 'campus-isb-kahuta', courseId: 'course-web-dev', genderPolicy: 'MIXED', totalCapacity: 60 },
    { id: 'off-isb-burma-cs', sessionId: 'bq-5.0', campusId: 'campus-isb-burma', courseId: 'course-cyber-security', genderPolicy: 'MIXED', totalCapacity: 60 },

    // Rawalpindi Offerings
    { id: 'off-rwp-rcc-wd', sessionId: 'bq-5.0', campusId: 'campus-rwp-rcc', courseId: 'course-web-dev', genderPolicy: 'MIXED', totalCapacity: 150 },
    { id: 'off-rwp-rcc-gd', sessionId: 'bq-5.0', campusId: 'campus-rwp-rcc', courseId: 'course-graphic-design', genderPolicy: 'MIXED', totalCapacity: 120 },
    { id: 'off-rwp-rcc-dm', sessionId: 'bq-5.0', campusId: 'campus-rwp-rcc', courseId: 'course-digital-marketing', genderPolicy: 'MIXED', totalCapacity: 90 },
    { id: 'off-rwp-sat-wd', sessionId: 'bq-5.0', campusId: 'campus-rwp-satellite', courseId: 'course-web-dev', genderPolicy: 'MIXED', totalCapacity: 120 },
    { id: 'off-rwp-sat-cs', sessionId: 'bq-5.0', campusId: 'campus-rwp-satellite', courseId: 'course-cyber-security', genderPolicy: 'MIXED', totalCapacity: 90 },
  ];

  // Teachers - Sara Nawaz has 7 batches (planted imbalance!), Bilal has 2
  const teachers: Teacher[] = [
    { id: 'teacher-sara', fullName: 'Sara Nawaz', email: 'sara.nawaz@banoqabil.pk', specialization: 'Web Development', campusId: 'campus-gulshan', maxWeeklyBatches: 4 },
    { id: 'teacher-bilal', fullName: 'Bilal Tariq', email: 'bilal.tariq@banoqabil.pk', specialization: 'Web Development', campusId: 'campus-gulshan', maxWeeklyBatches: 4 },
    { id: 'teacher-hamza', fullName: 'Hamza Sheikh', email: 'hamza.sheikh@banoqabil.pk', specialization: 'Graphic Design', campusId: 'campus-gulshan', maxWeeklyBatches: 4 },
    { id: 'teacher-zainab', fullName: 'Zainab Qazi', email: 'zainab.qazi@banoqabil.pk', specialization: 'Digital Marketing', campusId: 'campus-gulshan', maxWeeklyBatches: 4 },
    { id: 'teacher-usman', fullName: 'Usman Ali', email: 'usman.ali@banoqabil.pk', specialization: 'Cyber Security', campusId: 'campus-gulshan', maxWeeklyBatches: 4 },
    { id: 'teacher-kashif', fullName: 'Kashif Mehmood', email: 'kashif.m@banoqabil.pk', specialization: 'Web Development', campusId: 'campus-lahore-township', maxWeeklyBatches: 4 },
    { id: 'teacher-asma', fullName: 'Asma Rauf', email: 'asma.rauf@banoqabil.pk', specialization: 'Graphic Design', campusId: 'campus-nazimabad-girls', maxWeeklyBatches: 4 },
    { id: 'teacher-fatima-t', fullName: 'Fatima Noor', email: 'fatima.noor@banoqabil.pk', specialization: 'Digital Marketing', campusId: 'campus-nazimabad-girls', maxWeeklyBatches: 4 },

    // Islamabad & Rawalpindi Trainers
    { id: 'teacher-asad', fullName: 'Engr. Asadullah', email: 'asadullah@banoqabil.pk', specialization: 'Web Development', campusId: 'campus-isb-i8', maxWeeklyBatches: 4 },
    { id: 'teacher-maryam', fullName: 'Maryam Bibi', email: 'maryam.b@banoqabil.pk', specialization: 'Graphic Design', campusId: 'campus-isb-i8', maxWeeklyBatches: 4 },
    { id: 'teacher-zeeshan', fullName: 'Zeeshan Abbasi', email: 'zeeshan.a@banoqabil.pk', specialization: 'Web Development', campusId: 'campus-rwp-rcc', maxWeeklyBatches: 4 },
    { id: 'teacher-tayyaba', fullName: 'Tayyaba Rehman', email: 'tayyaba.r@banoqabil.pk', specialization: 'Cyber Security', campusId: 'campus-rwp-satellite', maxWeeklyBatches: 4 },
  ];

  // Batches
  // Planted: batch-wd-gul-m-a has 55 students, batch-wd-gul-m-b has 20 students (Re-optimise demo)
  const batches: Batch[] = [
    { id: 'batch-wd-gul-m-a', name: 'WD-GUL-M-A', sessionId: 'bq-5.0', offeringId: 'off-gul-wd', campusId: 'campus-gulshan', courseId: 'course-web-dev', timeSlotId: 'slot-morning', capacity: 30, minViable: 12, genderPolicy: 'MIXED', room: 'Lab 1', trainerId: 'teacher-sara' },
    { id: 'batch-wd-gul-m-b', name: 'WD-GUL-M-B', sessionId: 'bq-5.0', offeringId: 'off-gul-wd', campusId: 'campus-gulshan', courseId: 'course-web-dev', timeSlotId: 'slot-morning', capacity: 30, minViable: 12, genderPolicy: 'MIXED', room: 'Lab 2', trainerId: 'teacher-bilal' },
    { id: 'batch-wd-gul-e-a', name: 'WD-GUL-E-A', sessionId: 'bq-5.0', offeringId: 'off-gul-wd', campusId: 'campus-gulshan', courseId: 'course-web-dev', timeSlotId: 'slot-evening', capacity: 30, minViable: 12, genderPolicy: 'MIXED', room: 'Lab 1', trainerId: 'teacher-sara' },
    { id: 'batch-wd-gul-w-a', name: 'WD-GUL-W-A', sessionId: 'bq-5.0', offeringId: 'off-gul-wd', campusId: 'campus-gulshan', courseId: 'course-web-dev', timeSlotId: 'slot-weekend', capacity: 30, minViable: 12, genderPolicy: 'MIXED', room: 'Lab 3', trainerId: 'teacher-sara' },
    { id: 'batch-gd-gul-m-a', name: 'GD-GUL-M-A', sessionId: 'bq-5.0', offeringId: 'off-gul-gd', campusId: 'campus-gulshan', courseId: 'course-graphic-design', timeSlotId: 'slot-morning', capacity: 30, minViable: 12, genderPolicy: 'MIXED', room: 'Studio 1', trainerId: 'teacher-hamza' },
    { id: 'batch-gd-gul-e-a', name: 'GD-GUL-E-A', sessionId: 'bq-5.0', offeringId: 'off-gul-gd', campusId: 'campus-gulshan', courseId: 'course-graphic-design', timeSlotId: 'slot-evening', capacity: 30, minViable: 12, genderPolicy: 'MIXED', room: 'Studio 1', trainerId: 'teacher-hamza' },
    { id: 'batch-dm-gul-m-a', name: 'DM-GUL-M-A', sessionId: 'bq-5.0', offeringId: 'off-gul-dm', campusId: 'campus-gulshan', courseId: 'course-digital-marketing', timeSlotId: 'slot-morning', capacity: 30, minViable: 12, genderPolicy: 'MIXED', room: 'Hall B', trainerId: 'teacher-zainab' },
    { id: 'batch-cs-gul-e-a', name: 'CS-GUL-E-A', sessionId: 'bq-5.0', offeringId: 'off-gul-cs', campusId: 'campus-gulshan', courseId: 'course-cyber-security', timeSlotId: 'slot-evening', capacity: 30, minViable: 12, genderPolicy: 'MIXED', room: 'Security Lab', trainerId: 'teacher-usman' },

    // Lahore Township (Male Only)
    { id: 'batch-wd-lhr-m-a', name: 'WD-LHR-M-A', sessionId: 'bq-5.0', offeringId: 'off-lhr-wd', campusId: 'campus-lahore-township', courseId: 'course-web-dev', timeSlotId: 'slot-morning', capacity: 30, minViable: 12, genderPolicy: 'MALE_ONLY', room: 'Room 101', trainerId: 'teacher-kashif' },
    { id: 'batch-wd-lhr-e-a', name: 'WD-LHR-E-A', sessionId: 'bq-5.0', offeringId: 'off-lhr-wd', campusId: 'campus-lahore-township', courseId: 'course-web-dev', timeSlotId: 'slot-evening', capacity: 30, minViable: 12, genderPolicy: 'MALE_ONLY', room: 'Room 101', trainerId: 'teacher-kashif' },
    { id: 'batch-gd-lhr-m-a', name: 'GD-LHR-M-A', sessionId: 'bq-5.0', offeringId: 'off-lhr-gd', campusId: 'campus-lahore-township', courseId: 'course-graphic-design', timeSlotId: 'slot-morning', capacity: 30, minViable: 12, genderPolicy: 'MALE_ONLY', room: 'Media Lab' },

    // Nazimabad (Female Only)
    { id: 'batch-wd-nzm-m-a', name: 'WD-NZM-M-A', sessionId: 'bq-5.0', offeringId: 'off-nzm-wd', campusId: 'campus-nazimabad-girls', courseId: 'course-web-dev', timeSlotId: 'slot-morning', capacity: 30, minViable: 12, genderPolicy: 'FEMALE_ONLY', room: 'Lab G1', trainerId: 'teacher-sara' },
    { id: 'batch-gd-nzm-m-a', name: 'GD-NZM-M-A', sessionId: 'bq-5.0', offeringId: 'off-nzm-gd', campusId: 'campus-nazimabad-girls', courseId: 'course-graphic-design', timeSlotId: 'slot-morning', capacity: 30, minViable: 12, genderPolicy: 'FEMALE_ONLY', room: 'Art Lab', trainerId: 'teacher-asma' },
    { id: 'batch-dm-nzm-e-a', name: 'DM-NZM-E-A', sessionId: 'bq-5.0', offeringId: 'off-nzm-dm', campusId: 'campus-nazimabad-girls', courseId: 'course-digital-marketing', timeSlotId: 'slot-evening', capacity: 30, minViable: 12, genderPolicy: 'FEMALE_ONLY', room: 'Room 204', trainerId: 'teacher-fatima-t' },

    // Islamabad Batches
    { id: 'batch-wd-isb-i8-m', name: 'WD-ISB-I8-M', sessionId: 'bq-5.0', offeringId: 'off-isb-i8-wd', campusId: 'campus-isb-i8', courseId: 'course-web-dev', timeSlotId: 'slot-morning', capacity: 30, minViable: 12, genderPolicy: 'MIXED', room: 'IT Lab 1', trainerId: 'teacher-asad' },
    { id: 'batch-gd-isb-i8-e', name: 'GD-ISB-I8-E', sessionId: 'bq-5.0', offeringId: 'off-isb-i8-gd', campusId: 'campus-isb-i8', courseId: 'course-graphic-design', timeSlotId: 'slot-evening', capacity: 30, minViable: 12, genderPolicy: 'MIXED', room: 'Studio 1', trainerId: 'teacher-maryam' },

    // Rawalpindi Batches
    { id: 'batch-wd-rwp-rcc-m', name: 'WD-RWP-RCC-M', sessionId: 'bq-5.0', offeringId: 'off-rwp-rcc-wd', campusId: 'campus-rwp-rcc', courseId: 'course-web-dev', timeSlotId: 'slot-morning', capacity: 30, minViable: 12, genderPolicy: 'MIXED', room: 'Main Lab', trainerId: 'teacher-zeeshan' },
    { id: 'batch-cs-rwp-sat-e', name: 'CS-RWP-SAT-E', sessionId: 'bq-5.0', offeringId: 'off-rwp-sat-cs', campusId: 'campus-rwp-satellite', courseId: 'course-cyber-security', timeSlotId: 'slot-evening', capacity: 30, minViable: 12, genderPolicy: 'MIXED', room: 'Auditorium A', trainerId: 'teacher-tayyaba' },
  ];

  const students: Student[] = [];
  const enrollments: Enrollment[] = [];
  const followUps: FollowUp[] = [];
  const attendanceRecords: AttendanceRecord[] = [];

  // 1. Planted Consecutive Absence cases (8 cases - recoverable, Rule R3)
  const consecutiveAbsenceNames = [
    { id: 'stu-ahmed-raza', name: 'Ahmed Raza', gender: 'MALE' as Gender, phone: '+923001234567', cnic: '42101-•••••••-3', att: 71 },
    { id: 'stu-ca-2', name: 'Babar Azam', gender: 'MALE' as Gender, phone: '+923001234502', cnic: '42101-•••••••-2', att: 72 },
    { id: 'stu-ca-3', name: 'Shaheen Afridi', gender: 'MALE' as Gender, phone: '+923001234503', cnic: '42101-•••••••-3', att: 70 },
    { id: 'stu-ca-4', name: 'Shadab Khan', gender: 'MALE' as Gender, phone: '+923001234504', cnic: '42101-•••••••-4', att: 73 },
    { id: 'stu-ca-5', name: 'Naseem Shah', gender: 'MALE' as Gender, phone: '+923001234505', cnic: '42101-•••••••-5', att: 74 },
    { id: 'stu-ca-6', name: 'Fakhar Zaman', gender: 'MALE' as Gender, phone: '+923001234506', cnic: '42101-•••••••-6', att: 71 },
    { id: 'stu-ca-7', name: 'Haris Rauf', gender: 'MALE' as Gender, phone: '+923001234507', cnic: '42101-•••••••-7', att: 70 },
    { id: 'stu-ca-8', name: 'Iftikhar Ahmed', gender: 'MALE' as Gender, phone: '+923001234508', cnic: '42101-•••••••-8', att: 72 },
  ];

  consecutiveAbsenceNames.forEach((item, idx) => {
    const student: Student = {
      id: item.id,
      fullName: item.name,
      normalizedName: item.name.toLowerCase(),
      gender: item.gender,
      dateOfBirth: '2004-05-14',
      isMinor: false,
      phoneNormalized: item.phone,
      emailNormalized: `${item.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      cnicMasked: item.cnic,
      city: 'Karachi',
      hasLaptop: true,
    };
    students.push(student);

    const enrollment: Enrollment = {
      id: `enr-ca-${idx + 1}`,
      studentId: student.id,
      batchId: 'batch-wd-gul-m-a',
      sessionId: 'bq-5.0',
      status: 'AT_RISK',
      allocatedAt: '2026-01-05',
    };
    enrollments.push(enrollment);

    followUps.push({
      id: `fol-ca-${idx + 1}`,
      studentId: student.id,
      studentName: item.name,
      enrollmentId: enrollment.id,
      batchId: 'batch-wd-gul-m-a',
      batchName: 'WD-GUL-M-A',
      campusId: 'campus-gulshan',
      campusName: 'Gulshan Campus, Karachi',
      courseName: 'Web Development',
      reasonCode: 'CONSECUTIVE_ABSENCE',
      priority: 'HIGH',
      score: 85,
      explanation: `HIGH — ${item.name} · Web Development · Batch A · 3 consecutive absences (12, 14, 16 Feb). Attendance ${item.att}%, certification threshold 75%, 8 sessions remain. Still recoverable.`,
      explanationUrdu: `${item.name} — لگاتار ۳ غیر حاضریاں۔ موجودہ حاضری ${item.att} فیصد، جبکہ سرٹیفیکیشن کے لیے ۷۵ فیصد ضروری ہے۔ ۸ کلاسز باقی ہیں، ریکور ممکن ہے۔`,
      attendancePct: item.att,
      sessionsRemaining: 8,
      status: 'PENDING',
      notes: [],
      createdAt: new Date().toISOString(),
    });
  });

  // 2. Planted Hero Record: 4 CERT_IMPOSSIBLE (Rule R2)
  const certImpossibleNames = [
    { id: 'stu-fatima-zahra', name: 'Fatima Zahra', gender: 'FEMALE' as Gender, phone: '+923019876543', cnic: '42201-•••••••-6', att: 42 },
    { id: 'stu-ci-2', name: 'Maryam Nawaz', gender: 'FEMALE' as Gender, phone: '+923019876502', cnic: '42201-•••••••-2', att: 38 },
    { id: 'stu-ci-3', name: 'Sania Mirza', gender: 'FEMALE' as Gender, phone: '+923019876503', cnic: '42201-•••••••-3', att: 40 },
    { id: 'stu-ci-4', name: 'Hania Aamir', gender: 'FEMALE' as Gender, phone: '+923019876504', cnic: '42201-•••••••-4', att: 35 },
  ];

  certImpossibleNames.forEach((item, idx) => {
    const student: Student = {
      id: item.id,
      fullName: item.name,
      normalizedName: item.name.toLowerCase(),
      gender: item.gender,
      dateOfBirth: '2005-09-20',
      isMinor: false,
      phoneNormalized: item.phone,
      emailNormalized: `${item.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      cnicMasked: item.cnic,
      city: 'Karachi',
      hasLaptop: true,
    };
    students.push(student);

    const enrollment: Enrollment = {
      id: `enr-ci-${idx + 1}`,
      studentId: student.id,
      batchId: 'batch-gd-gul-m-a',
      sessionId: 'bq-5.0',
      status: 'AT_RISK',
      allocatedAt: '2026-01-05',
    };
    enrollments.push(enrollment);

    const maxReachable = Math.round(((item.att * 16 + 8 * 100) / 24));
    followUps.push({
      id: `fol-ci-${idx + 1}`,
      studentId: student.id,
      studentName: item.name,
      enrollmentId: enrollment.id,
      batchId: 'batch-gd-gul-m-a',
      batchName: 'GD-GUL-M-A',
      campusId: 'campus-gulshan',
      campusName: 'Gulshan Campus, Karachi',
      courseName: 'Graphic Design',
      reasonCode: 'CERT_IMPOSSIBLE',
      priority: 'CRITICAL',
      score: 95,
      explanation: `CRITICAL — ${item.name} · Graphic Design · Batch A · Attendance ${item.att}%. With 8 sessions remaining, maximum reachable attendance is ${maxReachable}%, strictly below 75% threshold.`,
      explanationUrdu: `${item.name} — موجودہ حاضری ${item.att} فیصد۔ باقی تمام کلاسز لے کر بھی زیادہ سے زیادہ ${maxReachable} فیصد ممکن ہے، سرٹیفیکیشن ناممکن ہو چکی ہے۔`,
      attendancePct: item.att,
      sessionsRemaining: 8,
      status: 'PENDING',
      notes: [],
      createdAt: new Date().toISOString(),
    });
  });

  // 3. Planted Hero 3 Records: 15 No-Show students (0% attendance, eligible for SEAT RECOVERY)
  const noShowNames = [
    'Bilal Farooq', 'Saad Mehmood', 'Hamza Malik', 'Usman Tariq', 'Danish Ali',
    'Zubair Ahmed', 'Shahzaib Khan', 'Arsalan Qureshi', 'Faizan Mustafa', 'Waleed Raza',
    'Mohsin Javed', 'Taimoor Hassan', 'Adeel Noman', 'Farhan Siddiqui', 'Noman Bashir'
  ];

  noShowNames.forEach((name, idx) => {
    const id = `stu-noshow-${idx + 1}`;
    const student: Student = {
      id,
      fullName: name,
      normalizedName: name.toLowerCase(),
      gender: 'MALE',
      dateOfBirth: '2004-01-10',
      isMinor: false,
      phoneNormalized: `+9230000000${String(idx).padStart(2, '0')}`,
      emailNormalized: `noshow.${idx}@example.com`,
      cnicMasked: `42101-•••••••-${(idx % 9) + 1}`,
      city: 'Karachi',
      hasLaptop: true,
    };
    students.push(student);

    const enrollment: Enrollment = {
      id: `enr-noshow-${idx + 1}`,
      studentId: id,
      batchId: 'batch-wd-gul-m-a',
      sessionId: 'bq-5.0',
      status: 'AT_RISK',
      allocatedAt: '2026-01-05',
    };
    enrollments.push(enrollment);

    followUps.push({
      id: `fol-noshow-${idx + 1}`,
      studentId: id,
      studentName: name,
      enrollmentId: enrollment.id,
      batchId: 'batch-wd-gul-m-a',
      batchName: 'WD-GUL-M-A',
      campusId: 'campus-gulshan',
      campusName: 'Gulshan Campus, Karachi',
      courseName: 'Web Development',
      reasonCode: 'NO_SHOW',
      priority: 'CRITICAL',
      score: 98,
      explanation: `CRITICAL — ${name} · Web Development · Batch A · Complete no-show across first 6 weeks (0/18 sessions attended). Unreachable after 3 coordinator calls.`,
      explanationUrdu: `${name} — پہلے ۶ ہفتوں میں ایک بھی کلاس نہیں لی (۰/۱۸ حاضری)۔ ۳ بار رابطہ کرنے پر بھی کوئی جواب نہیں۔`,
      attendancePct: 0,
      sessionsRemaining: 6,
      status: idx < 5 ? 'UNREACHABLE' : 'PENDING',
      notes: [
        { id: `note-${idx}-1`, author: 'Ahmad Saeed (Coordinator)', text: 'Called 3 times on phone; number switched off.', createdAt: '2026-02-10' }
      ],
      createdAt: new Date().toISOString(),
    });
  });

  // 4. Planted 25 Low Attendance Cases (55–65% attendance, Rule R5)
  for (let i = 1; i <= 25; i++) {
    const stuId = `stu-low-att-${i}`;
    const name = `Low Attendance Learner ${i}`;
    const student: Student = {
      id: stuId,
      fullName: name,
      normalizedName: name.toLowerCase(),
      gender: i % 2 === 0 ? 'FEMALE' : 'MALE',
      dateOfBirth: '2003-04-12',
      isMinor: false,
      phoneNormalized: `+92300777${String(i).padStart(4, '0')}`,
      emailNormalized: `lowatt.${i}@example.com`,
      cnicMasked: `42101-•••••••-${(i % 9) + 1}`,
      city: 'Karachi',
      hasLaptop: true,
    };
    students.push(student);

    const attPct = 55 + (i % 11); // 55% to 65%
    const enrollment: Enrollment = {
      id: `enr-low-att-${i}`,
      studentId: stuId,
      batchId: i % 2 === 0 ? 'batch-gd-gul-m-a' : 'batch-dm-gul-m-a',
      sessionId: 'bq-5.0',
      status: 'AT_RISK',
      allocatedAt: '2026-01-05',
    };
    enrollments.push(enrollment);

    followUps.push({
      id: `fol-low-att-${i}`,
      studentId: stuId,
      studentName: name,
      enrollmentId: enrollment.id,
      batchId: enrollment.batchId,
      batchName: enrollment.batchId.toUpperCase(),
      campusId: 'campus-gulshan',
      campusName: 'Gulshan Campus, Karachi',
      courseName: i % 2 === 0 ? 'Graphic Design' : 'Digital Marketing',
      reasonCode: 'LOW_ATTENDANCE',
      priority: 'MEDIUM',
      score: 65,
      explanation: `MEDIUM — ${name} · Attendance ${attPct}% is below 65% warning band.`,
      explanationUrdu: `${name} — حاضری ${attPct} فیصد ہے جو کہ انتباہی حد سے نیچے ہے۔`,
      attendancePct: attPct,
      sessionsRemaining: 8,
      status: 'PENDING',
      notes: [],
      createdAt: new Date().toISOString(),
    });
  }

  // 4. Populate ~350 realistic students distributed across batches
  const firstNamesM = ['Ali', 'Usman', 'Hamza', 'Bilal', 'Zain', 'Kashif', 'Haris', 'Danish', 'Fahad', 'Mustafa', 'Rehan', 'Omer', 'Saqib', 'Talha', 'Waqas'];
  const firstNamesF = ['Ayesha', 'Sana', 'Hira', 'Mariam', 'Zainab', 'Iqra', 'Fatima', 'Sadia', 'Bushra', 'Laiba', 'Maha', 'Anum', 'Kiran', 'Noor', 'Mahnoor'];
  const lastNames = ['Khan', 'Ahmed', 'Ali', 'Malik', 'Siddiqui', 'Raza', 'Qureshi', 'Shah', 'Farooqi', 'Chaudhry', 'Ansari', 'Hussain', 'Mirza', 'Bhatti', 'Javed'];

  let sIdx = 100;
  batches.forEach((batch) => {
    // Fill each batch with 20 to 28 students (except the overloaded batch-wd-gul-m-a which already has 16 + 39 = 55)
    const targetCount = batch.id === 'batch-wd-gul-m-a' ? 39 : batch.id === 'batch-wd-gul-m-b' ? 20 : 25;

    for (let i = 0; i < targetCount; i++) {
      sIdx++;
      const isFemale = batch.genderPolicy === 'FEMALE_ONLY' || (batch.genderPolicy === 'MIXED' && i % 2 === 1);
      const fName = isFemale ? firstNamesF[i % firstNamesF.length] : firstNamesM[i % firstNamesM.length];
      const lName = lastNames[(i + sIdx) % lastNames.length];
      const fullName = `${fName} ${lName}`;
      const isMinor = (sIdx % 5 === 0);

      const stu: Student = {
        id: `stu-${sIdx}`,
        fullName,
        normalizedName: fullName.toLowerCase(),
        gender: isFemale ? 'FEMALE' : 'MALE',
        dateOfBirth: isMinor ? '2009-03-12' : '2002-07-25',
        isMinor,
        phoneNormalized: `+9230${(sIdx % 9) + 1}${String(sIdx).padStart(7, '0')}`,
        emailNormalized: `${fName.toLowerCase()}.${lName.toLowerCase()}${sIdx}@example.com`,
        cnicMasked: `42101-•••••••-${(sIdx % 9) + 1}`,
        city: batch.campusId.includes('lahore')
          ? 'Lahore'
          : batch.campusId.includes('isb')
          ? 'Islamabad'
          : batch.campusId.includes('rwp')
          ? 'Rawalpindi'
          : 'Karachi',
        hasLaptop: true,
      };
      students.push(stu);

      const enr: Enrollment = {
        id: `enr-${sIdx}`,
        studentId: stu.id,
        batchId: batch.id,
        sessionId: 'bq-5.0',
        status: 'ACTIVE',
        allocatedAt: '2026-01-05',
      };
      enrollments.push(enr);
    }
  });

  // Populate realistic Attendance Records across all student cohorts
  // 1. Consecutive Absence students (8 cases: 15 Present, last 3 Absent -> Rule R3)
  consecutiveAbsenceNames.forEach((item, idx) => {
    const enrId = `enr-ca-${idx + 1}`;
    for (let s = 1; s <= 18; s++) {
      const isAbsent = s >= 16;
      attendanceRecords.push({
        id: `att-ca-${idx + 1}-${s}`,
        classSessionId: `sess-wd-gul-${s}`,
        enrollmentId: enrId,
        batchId: 'batch-wd-gul-m-a',
        status: isAbsent ? 'ABSENT' : 'PRESENT',
        markedById: 'teacher-sara',
        markedAt: `2026-0${s < 10 ? '1' : '2'}-${String((s % 28) + 1).padStart(2, '0')}T10:00:00Z`,
      });
    }
  });

  // 2. No-Show students (15 cases: 18 Absent, 0 Present -> Rule R1 / Dead Seat Recovery)
  noShowNames.forEach((item, idx) => {
    const enrId = `enr-noshow-${idx + 1}`;
    for (let s = 1; s <= 18; s++) {
      attendanceRecords.push({
        id: `att-ns-${idx + 1}-${s}`,
        classSessionId: `sess-wd-gul-${s}`,
        enrollmentId: enrId,
        batchId: 'batch-wd-gul-m-a',
        status: 'ABSENT',
        markedById: 'teacher-sara',
        markedAt: `2026-0${s < 10 ? '1' : '2'}-${String((s % 28) + 1).padStart(2, '0')}T10:00:00Z`,
      });
    }
  });

  // 3. Cert Impossible students (4 cases: 7 Present, 11 Absent -> Rule R2)
  certImpossibleNames.forEach((item, idx) => {
    const enrId = `enr-ci-${idx + 1}`;
    for (let s = 1; s <= 18; s++) {
      const isAbsent = s > 7;
      attendanceRecords.push({
        id: `att-ci-${idx + 1}-${s}`,
        classSessionId: `sess-gd-gul-${s}`,
        enrollmentId: enrId,
        batchId: 'batch-gd-gul-m-a',
        status: isAbsent ? 'ABSENT' : 'PRESENT',
        markedById: 'teacher-hamza',
        markedAt: `2026-0${s < 10 ? '1' : '2'}-${String((s % 28) + 1).padStart(2, '0')}T10:00:00Z`,
      });
    }
  });

  // 4. Low Attendance students (25 cases: 11 Present, 7 Absent -> Rule R5)
  for (let i = 1; i <= 25; i++) {
    const enrId = `enr-low-att-${i}`;
    const batchId = i % 2 === 0 ? 'batch-gd-gul-m-a' : 'batch-dm-gul-m-a';
    for (let s = 1; s <= 18; s++) {
      const isAbsent = s % 3 === 0;
      attendanceRecords.push({
        id: `att-low-${i}-${s}`,
        classSessionId: `sess-b-${batchId}-${s}`,
        enrollmentId: enrId,
        batchId,
        status: isAbsent ? 'ABSENT' : 'PRESENT',
        markedById: 'teacher-zainab',
        markedAt: `2026-0${s < 10 ? '1' : '2'}-${String((s % 28) + 1).padStart(2, '0')}T10:00:00Z`,
      });
    }
  }

  // 5. Active healthy students (16 Present, 2 Absent -> Good standing)
  enrollments.forEach((enr, idx) => {
    if (
      !enr.id.startsWith('enr-ca-') &&
      !enr.id.startsWith('enr-noshow-') &&
      !enr.id.startsWith('enr-ci-') &&
      !enr.id.startsWith('enr-low-att-')
    ) {
      for (let s = 1; s <= 18; s++) {
        const isAbsent = s === 5 || s === 12;
        attendanceRecords.push({
          id: `att-act-${idx}-${s}`,
          classSessionId: `sess-${enr.batchId}-${s}`,
          enrollmentId: enr.id,
          batchId: enr.batchId,
          status: isAbsent ? 'ABSENT' : 'PRESENT',
          markedById: 'teacher-sara',
          markedAt: `2026-0${s < 10 ? '1' : '2'}-${String((s % 28) + 1).padStart(2, '0')}T10:00:00Z`,
        });
      }
    }
  });

  // 5. Waitlist (120 candidates, top ones ready for matching)
  const waitlist: WaitlistEntry[] = [
    {
      id: 'wait-kashif-ali',
      studentId: 'stu-wait-1',
      offeringId: 'off-gul-wd',
      campusId: 'campus-gulshan',
      courseId: 'course-web-dev',
      timeSlotIds: ['slot-morning'],
      appliedAt: '2026-01-02',
      interviewPassed: true,
      score: 94,
      status: 'WAITING',
    },
    {
      id: 'wait-mubashir-hassan',
      studentId: 'stu-wait-2',
      offeringId: 'off-gul-wd',
      campusId: 'campus-gulshan',
      courseId: 'course-web-dev',
      timeSlotIds: ['slot-morning', 'slot-evening'],
      appliedAt: '2026-01-03',
      interviewPassed: true,
      score: 91,
      status: 'WAITING',
    },
    {
      id: 'wait-sumaira-khan',
      studentId: 'stu-wait-3',
      offeringId: 'off-gul-wd',
      campusId: 'campus-gulshan',
      courseId: 'course-web-dev',
      timeSlotIds: ['slot-morning'],
      appliedAt: '2026-01-04',
      interviewPassed: true,
      score: 89,
      status: 'WAITING',
    },
    {
      id: 'wait-danish-iqbal',
      studentId: 'stu-wait-4',
      offeringId: 'off-gul-gd',
      campusId: 'campus-gulshan',
      courseId: 'course-graphic-design',
      timeSlotIds: ['slot-morning'],
      appliedAt: '2026-01-04',
      interviewPassed: true,
      score: 88,
      status: 'WAITING',
    },
  ];

  // Waitlist students
  const waitlistStudentRecords: Student[] = [
    { id: 'stu-wait-1', fullName: 'Kashif Ali', normalizedName: 'kashif ali', gender: 'MALE', dateOfBirth: '2003-11-10', isMinor: false, phoneNormalized: '+923005551122', emailNormalized: 'kashif.ali@example.com', cnicMasked: '42101-•••••••-8', city: 'Karachi', hasLaptop: true },
    { id: 'stu-wait-2', fullName: 'Mubashir Hassan', normalizedName: 'mubashir hassan', gender: 'MALE', dateOfBirth: '2004-02-15', isMinor: false, phoneNormalized: '+923005553344', emailNormalized: 'mubashir.h@example.com', cnicMasked: '42101-•••••••-2', city: 'Karachi', hasLaptop: true },
    { id: 'stu-wait-3', fullName: 'Sumaira Khan', normalizedName: 'sumaira khan', gender: 'FEMALE', dateOfBirth: '2005-06-21', isMinor: false, phoneNormalized: '+923005556677', emailNormalized: 'sumaira.k@example.com', cnicMasked: '42101-•••••••-4', city: 'Karachi', hasLaptop: true },
    { id: 'stu-wait-4', fullName: 'Danish Iqbal', normalizedName: 'danish iqbal', gender: 'MALE', dateOfBirth: '2002-09-08', isMinor: false, phoneNormalized: '+923005558899', emailNormalized: 'danish.i@example.com', cnicMasked: '42101-•••••••-9', city: 'Karachi', hasLaptop: true },
  ];
  students.push(...waitlistStudentRecords);

  // 6. Duplicate candidates (15 planted pairs including 4 transliteration variants)
  const duplicates: DuplicateCandidate[] = [
    { id: 'dup-1', studentAId: 'stu-dup-1a', studentAName: 'Muhammad Bilal', studentBId: 'stu-dup-1b', studentBName: 'Mohammad Bilal', confidence: 'LIKELY', matchReason: 'Transliteration variant: Muhammad vs Mohammad with identical DOB (2003-08-14) and Phone', status: 'PENDING', campusId: 'campus-gulshan', detectedAt: '2026-02-18' },
    { id: 'dup-2', studentAId: 'stu-dup-2a', studentAName: 'Abdul Rehman', studentBId: 'stu-dup-2b', studentBName: 'Abdur Rahman', confidence: 'LIKELY', matchReason: 'Transliteration variant: Abdul Rehman vs Abdur Rahman with identical CNIC hash', status: 'PENDING', campusId: 'campus-gulshan', detectedAt: '2026-02-18' },
    { id: 'dup-3', studentAId: 'stu-dup-3a', studentAName: 'Usman Ali', studentBId: 'stu-dup-3b', studentBName: 'Othman Ali', confidence: 'LIKELY', matchReason: 'Transliteration variant: Usman vs Othman with identical phone number', status: 'PENDING', campusId: 'campus-lahore-township', detectedAt: '2026-02-18' },
    { id: 'dup-4', studentAId: 'stu-dup-4a', studentAName: 'Fatima Zahra', studentBId: 'stu-dup-4b', studentBName: 'Fatimah Zahra', confidence: 'LIKELY', matchReason: 'Transliteration variant: Fatima vs Fatimah with identical DOB', status: 'PENDING', campusId: 'campus-nazimabad-girls', detectedAt: '2026-02-18' },
    { id: 'dup-5', studentAId: 'stu-dup-5a', studentAName: 'Ayesha Khan', studentBId: 'stu-dup-5b', studentBName: 'Ayesha Khan', confidence: 'CERTAIN', matchReason: 'Exact CNIC hash and phone match across 2 intake forms', status: 'PENDING', campusId: 'campus-nazimabad-girls', detectedAt: '2026-02-17' },
    { id: 'dup-6', studentAId: 'stu-dup-6a', studentAName: 'Ali Hassan', studentBId: 'stu-dup-6b', studentBName: 'Ali Hassan', confidence: 'CERTAIN', matchReason: 'Exact phone number + identical father name', status: 'PENDING', campusId: 'campus-gulshan', detectedAt: '2026-02-17' },
    { id: 'dup-7', studentAId: 'stu-dup-7a', studentAName: 'Hamza Tariq', studentBId: 'stu-dup-7b', studentBName: 'Hamza Tariq', confidence: 'CERTAIN', matchReason: 'Exact CNIC hash match', status: 'PENDING', campusId: 'campus-gulshan', detectedAt: '2026-02-17' },
    { id: 'dup-8', studentAId: 'stu-dup-8a', studentAName: 'Zainab Bibi', studentBId: 'stu-dup-8b', studentBName: 'Zainab Bibi', confidence: 'CERTAIN', matchReason: 'Exact verified email and CNIC hash', status: 'PENDING', campusId: 'campus-nazimabad-girls', detectedAt: '2026-02-16' },
    { id: 'dup-9', studentAId: 'stu-dup-9a', studentAName: 'Bilal Ahmed', studentBId: 'stu-dup-9b', studentBName: 'Bilal Ahmad', confidence: 'LIKELY', matchReason: 'Name similarity 94% + identical DOB and city', status: 'PENDING', campusId: 'campus-lahore-township', detectedAt: '2026-02-16' },
    { id: 'dup-10', studentAId: 'stu-dup-10a', studentAName: 'Saad Mehmood', studentBId: 'stu-dup-10b', studentBName: 'Saad Mehmood', confidence: 'CERTAIN', matchReason: 'Exact phone and email match across two registrations', status: 'PENDING', campusId: 'campus-gulshan', detectedAt: '2026-02-15' },
    { id: 'dup-11', studentAId: 'stu-dup-11a', studentAName: 'Danish Ali', studentBId: 'stu-dup-11b', studentBName: 'Danish Ali', confidence: 'CERTAIN', matchReason: 'Exact CNIC hash match', status: 'PENDING', campusId: 'campus-gulshan', detectedAt: '2026-02-15' },
    { id: 'dup-12', studentAId: 'stu-dup-12a', studentAName: 'Shahzaib Khan', studentBId: 'stu-dup-12b', studentBName: 'Shahzeb Khan', confidence: 'LIKELY', matchReason: 'Trigram name similarity 91% + identical phone', status: 'PENDING', campusId: 'campus-gulshan', detectedAt: '2026-02-15' },
    { id: 'dup-13', studentAId: 'stu-dup-13a', studentAName: 'Kashif Mehmood', studentBId: 'stu-dup-13b', studentBName: 'Kashif Mahmood', confidence: 'LIKELY', matchReason: 'Name similarity + identical DOB (2004-03-21)', status: 'PENDING', campusId: 'campus-lahore-township', detectedAt: '2026-02-14' },
    { id: 'dup-14', studentAId: 'stu-dup-14a', studentAName: 'Asma Rauf', studentBId: 'stu-dup-14b', studentBName: 'Asma Rauf', confidence: 'CERTAIN', matchReason: 'Exact CNIC hash and phone match', status: 'PENDING', campusId: 'campus-nazimabad-girls', detectedAt: '2026-02-14' },
    { id: 'dup-15', studentAId: 'stu-dup-15a', studentAName: 'Farhan Siddiqui', studentBId: 'stu-dup-15b', studentBName: 'Farhan Siddiqui', confidence: 'CERTAIN', matchReason: 'Exact verified phone and DOB match', status: 'PENDING', campusId: 'campus-gulshan', detectedAt: '2026-02-14' },
  ];

  // 7. Transfer Requests (In-Campus and Cross-Campus with compatibility rules)
  const transferRequests: TransferRequest[] = [
    {
      id: 'trans-1',
      enrollmentId: 'enr-101',
      studentId: 'stu-101',
      studentName: 'Ali Khan',
      currentBatchId: 'batch-wd-gul-m-a',
      currentBatchName: 'WD-GUL-M-A',
      targetBatchId: 'batch-wd-gul-e-a',
      targetBatchName: 'WD-GUL-E-A',
      currentCampusId: 'campus-gulshan',
      currentCampusName: 'Gulshan Campus, Karachi',
      targetCampusId: 'campus-gulshan',
      targetCampusName: 'Gulshan Campus, Karachi',
      isCrossCampus: false,
      reason: 'Shift clash with university exams; morning to evening in same campus.',
      status: 'PENDING',
      requestedById: 'stu-101',
      createdAt: '2026-02-16T09:00:00Z',
      updatedAt: '2026-02-16T09:00:00Z',
    },
    {
      id: 'trans-2',
      enrollmentId: 'enr-102',
      studentId: 'stu-102',
      studentName: 'Usman Ali',
      currentBatchId: 'batch-wd-gul-m-a',
      currentBatchName: 'WD-GUL-M-A',
      targetBatchId: 'batch-wd-lhr-m-a',
      targetBatchName: 'WD-LHR-M-A',
      currentCampusId: 'campus-gulshan',
      currentCampusName: 'Gulshan Campus, Karachi',
      targetCampusId: 'campus-lahore-township',
      targetCampusName: 'Lahore Township Campus',
      isCrossCampus: true,
      reason: 'Family relocated from Karachi to Lahore; requesting seat in Lahore Township.',
      status: 'PENDING',
      requestedById: 'user-coord-ahmad',
      createdAt: '2026-02-17T11:30:00Z',
      updatedAt: '2026-02-17T11:30:00Z',
    },
  ];

  // 8. Import Jobs
  const importJobs: ImportJob[] = [
    {
      id: 'import-1000-messy',
      fileName: 'registrations_banoqabil_5_intake.xlsx',
      totalRows: 1000,
      validRows: 992,
      quarantinedRows: 8,
      status: 'MAPPED',
      uploadedById: 'user-coord-ahmad',
      uploadedAt: '2026-02-18T08:30:00Z',
      mappings: [
        { sourceHeader: 'نام (Full Name)', suggestedField: 'fullName', confidence: 'High', confidenceScore: 0.94, status: 'Mapped', sampleValues: ['Hassan Ali', 'Ayesha Khan'] },
        { sourceHeader: 'F/Name', suggestedField: 'fullName', confidence: 'High', confidenceScore: 0.90, status: 'Mapped', sampleValues: ['Muhammad Ali', 'Tariq Khan'] },
        { sourceHeader: 'CNIC No.', suggestedField: 'cnic', confidence: 'High', confidenceScore: 0.98, status: 'Mapped', sampleValues: ['42101-1234567-1'] },
        { sourceHeader: 'Phone Number', suggestedField: 'phone', confidence: 'High', confidenceScore: 0.96, status: 'Mapped', sampleValues: ['0300-1234567'] },
        { sourceHeader: 'Select Course', suggestedField: 'course', confidence: 'High', confidenceScore: 0.92, status: 'Mapped', sampleValues: ['web dev', 'Web & App', 'ویب ڈیولپمنٹ'] },
        { sourceHeader: 'Batch Time', suggestedField: 'timing', confidence: 'High', confidenceScore: 0.95, status: 'Mapped', sampleValues: ['subah', '9-12', '5-8'] },
      ],
      sampleRows: [],
    },
  ];

  // 9. Recommendations & Approvals
  const recommendations: Recommendation[] = [
    { id: 'rec-1', type: 'SEAT_RECOVERY', title: '15 Dead Seats in Gulshan Campus', description: '15 students have 0% attendance; release seats to backfill from qualified waitlist backlog.', impactScore: 98, metadata: { campusId: 'campus-gulshan', count: 15 }, status: 'OPEN', createdAt: '2026-02-18T08:00:00Z' },
    { id: 'rec-2', type: 'TRAINER_REBALANCE', title: 'Workload Imbalance: Sara Nawaz', description: 'Sara Nawaz is assigned 7 batches (28h/week). Move 2 batches to Bilal Tariq.', impactScore: 88, metadata: { fromTrainer: 'teacher-sara', toTrainer: 'teacher-bilal' }, status: 'OPEN', createdAt: '2026-02-18T08:00:00Z' },
  ];

  const approvals: Approval[] = [
    { id: 'app-001', entityType: 'ALLOCATION_RUN', entityId: 'run-init-01', status: 'APPROVED', requestedBy: 'user-coord-ahmad', reviewedBy: 'user-admin-tariq', decision: 'Approved batch placement for 340 students.', createdAt: '2026-01-05T10:30:00Z', resolvedAt: '2026-01-05T10:35:00Z' }
  ];

  // 10. Audit Log
  const auditLogs: AuditLog[] = [
    {
      id: 'audit-001',
      actorId: 'user-coord-ahmad',
      actorRole: 'COORDINATOR',
      actorName: 'Ahmad Saeed',
      action: 'APPROVE_ALLOCATION',
      entityType: 'AllocationRun',
      entityId: 'run-init-01',
      details: 'Approved batch placement for 340 students in Web Development (Gulshan Campus)',
      scopeJson: { campusIds: ['campus-gulshan'] },
      createdAt: '2026-01-05T10:30:00Z',
    },
    {
      id: 'audit-002',
      actorId: 'user-admin-tariq',
      actorRole: 'SUPER_ADMIN',
      actorName: 'Muhammad Tariq',
      action: 'NL_QUERY',
      entityType: 'NLQueryLog',
      details: 'NL Query: "Show seats available across all campuses"',
      scopeJson: { isGlobal: true },
      createdAt: '2026-02-15T14:12:00Z',
    },
  ];

  const nlQueryLogs: NLQueryLog[] = [];
  const allocationRuns: AllocationRun[] = [];
  const allocationProposals: AllocationProposal[] = [];

  const notifications: Notification[] = [
    {
      id: 'notif-1',
      role: 'COORDINATOR',
      title: 'High Risk Alert: Ahmed Raza',
      message: '3 consecutive absences in WD-GUL-M-A. Still recoverable (71%).',
      link: '/follow-ups',
      priority: 'HIGH',
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'notif-2',
      role: 'COORDINATOR',
      title: '15 No-Show Seats Ready for Recovery',
      message: '15 students have 0% attendance. Release seats to backfill from waitlist.',
      link: '/seat-recovery',
      priority: 'CRITICAL',
      read: false,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'notif-3',
      role: 'SUPER_ADMIN',
      title: 'Trainer Workload Imbalance Detected',
      message: 'Sara Nawaz has 7 batches assigned while Bilal Tariq has 2.',
      link: '/trainers/workload',
      priority: 'MEDIUM',
      read: false,
      createdAt: new Date(Date.now() - 18000000).toISOString(),
    },
  ];

  return {
    sessions,
    regions,
    campuses,
    courses,
    offerings,
    timeSlots,
    batches,
    teachers,
    students,
    enrollments,
    attendanceRecords,
    waitlist,
    allocationRuns,
    allocationProposals,
    followUps,
    duplicates,
    transferRequests,
    importJobs,
    recommendations,
    approvals,
    auditLogs,
    nlQueryLogs,
    notifications,
  };
}

// Global in-memory singleton that persists across API calls in the Node runtime
// and provides atomic operations + reset capability
class MemoryDataStore {
  private static instance: MemoryDataStore;
  private state: DatabaseState;

  private constructor() {
    this.state = createInitialDatabaseState();
  }

  public static getInstance(): MemoryDataStore {
    if (!MemoryDataStore.instance) {
      MemoryDataStore.instance = new MemoryDataStore();
    }
    return MemoryDataStore.instance;
  }

  public getState(): DatabaseState {
    return this.state;
  }

  public reset(): DatabaseState {
    this.state = createInitialDatabaseState();
    return this.state;
  }

  public addAuditLog(log: Omit<AuditLog, 'id' | 'createdAt'>): AuditLog {
    const fullLog: AuditLog = {
      ...log,
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    this.state.auditLogs.unshift(fullLog);
    return fullLog;
  }

  public addNLQueryLog(log: Omit<NLQueryLog, 'id' | 'createdAt'>): NLQueryLog {
    const fullLog: NLQueryLog = {
      ...log,
      id: `nlq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    this.state.nlQueryLogs.unshift(fullLog);
    return fullLog;
  }
}

export const dbStore = MemoryDataStore.getInstance();
