import {
  createSessionToken,
  verifySessionToken,
  DEMO_PERSONAS,
  isCampusInScope,
  isBatchInScope,
  maskStudentPII
} from '../lib/auth-scope';

let passed = 0;
let failed = 0;

function check(desc, cond) {
  if (cond) {
    console.log(`✅ PASS: ${desc}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${desc}`);
    failed++;
  }
}

console.log('🔒 Testing Scope & Security Controls...\n');

// 1. Session Token Validation
const token = createSessionToken('COORDINATOR', 'user-coord-ahmad');
const decoded = verifySessionToken(token);
check('Token generation and HMAC signature verification', decoded && decoded.role === 'COORDINATOR');

const tamperedToken = token.slice(0, -4) + 'abcd';
check('Tampered token rejection', verifySessionToken(tamperedToken) === null);

// 2. Scope checks
const coord = DEMO_PERSONAS.COORDINATOR;
const teacher = DEMO_PERSONAS.TEACHER;
const student = DEMO_PERSONAS.STUDENT;
const superAdmin = DEMO_PERSONAS.SUPER_ADMIN;

check('Coordinator allowed on Gulshan', isCampusInScope(coord, 'campus-gulshan'));
check('Coordinator blocked on Lahore Township', !isCampusInScope(coord, 'campus-lahore-township'));
check('Coordinator blocked on Nazimabad', !isCampusInScope(coord, 'campus-nazimabad-girls'));

check('Teacher allowed on assigned batch', isBatchInScope(teacher, 'batch-wd-gul-m-a'));
check('Teacher blocked on unassigned batch', !isBatchInScope(teacher, 'batch-cs-gul-e-a'));

check('Super Admin allowed across all campuses', isCampusInScope(superAdmin, 'campus-lahore-township') && isCampusInScope(superAdmin, 'campus-gulshan'));

// 3. PII Masking
const testStudent = {
  id: 'stu-123',
  fullName: 'Hamza Khan',
  normalizedName: 'hamza khan',
  gender: 'MALE',
  dateOfBirth: '2005-01-01',
  isMinor: false,
  phoneNormalized: '+923001234567',
  emailNormalized: 'hamza@example.com',
  cnicHash: 'hash-secret-value-12345',
  cnicMasked: '42101-•••••••-1',
  city: 'Karachi',
  hasLaptop: true,
};

const teacherView = maskStudentPII(testStudent, teacher);
check('Teacher cannot see phone number', teacherView.phoneNormalized === undefined);
check('Teacher cannot see email address', teacherView.emailNormalized === undefined);
check('Teacher cannot see cnicHash', teacherView.cnicHash === undefined);
check('Teacher sees fully masked CNIC', teacherView.cnicMasked === '•••••-•••••-•');

const coordView = maskStudentPII(testStudent, coord);
check('Coordinator sees student phone', coordView.phoneNormalized === '+923001234567');
check('Coordinator does NOT receive raw cnicHash', coordView.cnicHash === undefined);

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
