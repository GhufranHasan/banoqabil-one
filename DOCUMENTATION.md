# Bano Qabil One Frontend Documentation

## 1. Project overview

Bano Qabil One is a frontend-only operations dashboard prototype based on the supplied PRD and Bano Qabil visual identity. It provides role-based dashboards and operational workflows for students, teachers, coordinators, regional managers, and super administrators.

The implementation uses dummy data and local React state so every screen can be explored without a backend.

PRD reference: [Analyze UI Screens Epics](https://chatgpt.com/share/6a96e408-b044-83e8-bb03-fbdcfccd52b1)

## 2. Technology stack

- Next.js-compatible App Router through Vinext
- React 19 and TypeScript
- Tailwind CSS
- shadcn-style reusable UI components
- Lucide icons
- Recharts
- Frontend-only state and interactions

## 3. Running the project

Requirements:

- Node.js 22.13 or newer
- npm

Commands:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production validation:

```bash
npm run build
npm run start
```

## 4. Demo authentication

The login screen supports four selectable demo roles. Select a role, enter the password, and choose **Sign In**.

| Role | Dashboard route |
|---|---|
| Student | `/dashboard/student` |
| Teacher | `/dashboard/teacher` |
| Coordinator | `/dashboard/coordinator` |
| Super Admin | `/dashboard/admin` |

Demo password: `1234`

Demo contact-verification OTP: `123456`

The selected role is stored in `sessionStorage`. Shared screens use that value to retain role-appropriate navigation and enforce the frontend route boundary. A user who enters an out-of-role route is returned to their own dashboard with an explanatory toast. This is a UI demonstration only and must be backed by server-side authorization in production.

## 5. Role access model

| Role | Available areas |
|---|---|
| Student | Student dashboard, personal attendance history, transfer requests |
| Teacher | Teacher dashboard, assigned batches, attendance marking, follow-ups, workload, teaching settings |
| Coordinator | Coordinator dashboard, students, batches, trainers, admissions, communications, imports, seats, security fees, reports, campus settings |
| Super Admin | Super Admin dashboard, allocation, imports, optimisation, duplicate resolution, audit, network seats, system settings |
| Regional Manager | Regional dashboard, regional seat availability, workload, reports |

The Student attendance route is `/student/attendance` and is deliberately separate from the Teacher attendance-marking route `/attendance`.

## 6. PRD screen coverage audit

The PRD explicitly lists 18 screens. It also specifies a Trainer Dashboard outside the numbered S1–S18 inventory. The implementation therefore audits against **19 major UI surfaces**: 18 named screens plus the Trainer Dashboard. The persistent AI Assistant is a drawer rather than a separate route.

### P0 — MVP screens

| ID | PRD screen | Implementation | Status |
|---|---|---|---|
| S1 | Login / Role Switcher | `/` and `/login` | Complete |
| S2 | Import Upload + AI Mapping Review | `/imports` | Complete |
| S3 | Allocation Proposal Review | `/allocation` | Complete |
| S4 | Coordinator Dashboard | `/dashboard/coordinator` | Complete |
| S5 | Follow-up Worklist | `/follow-ups` | Complete |
| S6 | Network Seat Availability | `/seat-availability` | Complete |
| S7 | AI Assistant | Persistent drawer in the application shell | Complete |
| S8 | Seat Recovery + Waitlist Matching | `/seat-recovery` | Complete |
| S9 | Super Admin Dashboard | `/dashboard/admin` | Complete |
| S10 | Attendance Marking | `/attendance` | Complete |
| S11 | Student Read-only View | `/dashboard/student` | Complete |
| S12 | Audit Log Viewer | `/audit` | Complete |

P0 coverage: **12 of 12 screens/surfaces**.

### P1 — Extended screens

| ID | PRD screen | Implementation | Status |
|---|---|---|---|
| S13 | Batch Re-optimisation Proposal | `/re-optimisation` | Complete |
| S14 | Transfer Request + Options | `/transfers` | Complete |
| S15 | Duplicate Resolution | `/duplicates` | Complete |
| S16 | Trainer Workload | `/trainers/workload` | Complete |
| Extra | Trainer Dashboard specified by F11 | `/dashboard/teacher`; `/dashboard/trainer` redirects here | Complete |

P1 coverage: **4 of 4 listed screens plus the missing Trainer Dashboard**.

### P2 — Future screens

| ID | PRD screen | Implementation | Status |
|---|---|---|---|
| S17 | Rich Student Dashboard | `/dashboard/student/rich` | Complete |
| S18 | Regional Manager Dashboard | `/dashboard/regional` | Complete |

P2 coverage: **2 of 2 screens**.

### Audit conclusion

- Explicit PRD screens completed: **18 of 18**
- Additional Trainer Dashboard completed: **1 of 1**
- Total major UI surfaces completed: **19 of 19**
- Separate Campus Seat Map: **not required by the PRD and removed as requested**
- Notification behavior: included in the global header; no separate notification page is required by the PRD

“Complete” in this audit means the frontend screen exists, follows the shared theme, contains representative dummy data, and supports demonstrable client-side interactions. It does not mean backend services or production security have been implemented.

## 7. Supporting application routes

The application also includes reusable operational placeholder screens for secondary navigation:

- `/students`
- `/batches`
- `/trainers`
- `/admissions`
- `/reports`
- `/communications`
- `/settings`
- `/security-fees`
- `/student/attendance`

These routes are outside the PRD’s 19 major UI surfaces but make the sidebar navigation complete for the frontend demonstration.

## 8. Implemented frontend interactions

- Role selection and role-specific dashboard routing
- Demo password validation
- Role-aware sidebar navigation
- Profile Settings dialog available from the navbar profile menu
- Male, female, initials, and local image-upload profile-picture options
- Role-specific editable profile information
- Six-digit OTP confirmation when email or mobile number changes
- Frontend route guards and role-specific navigation boundaries
- Teacher teaching settings, Coordinator campus settings, and Super Admin system settings
- Super Admin-only Add Setting workflow
- Responsive desktop and mobile navigation
- BanoQabil-themed scrollbars for page, sidebar, modal, table, and assistant overflow areas
- Global search result preview
- Notifications popover
- Persistent AI Assistant drawer with simulated responses
- Screen-level filters and search
- Row-level detail dialogs populated from the respective selected record
- Section-specific add forms for students, applications, batches, trainers, reports, messages, and settings
- Select controls for Coordinator Program, Campus, Timing, Weekly Capacity, Preferred Course, and Preferred Campus fields
- Two-hour batch timing slots
- PKR 3,000 student security-fee recording and attendance-based refund eligibility
- Branded dummy PDF report generation and browser download
- Branded system-error dialogs for route errors, runtime exceptions, failed promises, and handled action failures
- Loading and completion toasts for simulated slow API requests
- Record review and completion states
- Allocation and mapping approval simulations
- Attendance submission simulation
- Waitlist offer and seat recovery interactions
- Export/report feedback
- Dashboard quick links and route navigation
- Responsive cards, tables, badges, progress bars, and charts

## 9. Profile and settings workflows

Profile Settings is opened from the navbar profile dropdown. Shared contact fields include email and mobile number. Changing either contact value opens a six-digit OTP step before the update is accepted. Additional fields are role-specific:

- Student: student ID, program, campus, batch, guardian contact
- Teacher: employee ID, specialization, campus, weekly capacity, qualification
- Coordinator: employee ID, assigned campus, region, operational contact
- Super Admin: administrator ID, access level, department, office location
- Regional Manager: employee ID, assigned region, managed campuses

Settings are intentionally scoped:

- Teachers manage teaching preferences and notifications.
- Coordinators manage campus operations and refund eligibility preferences.
- Super Admins manage system-wide defaults and can add new settings.
- Students and Regional Managers do not receive a Settings route.

## 10. Security fee and refund workflow

The Coordinator-only `/security-fees` screen records the standard PKR 3,000 student security fee. A paid student becomes refund-eligible only when the course is completed and attendance is at least 80%. The demo supports recording a payment and processing an eligible refund with status feedback.

## 11. PDF report workflow

Report actions generate a frontend-only PDF download with a BanoQabil One header, report title, prepared-by information, dummy report rows, footer, and page number. The implementation uses a browser Blob and does not require an API. A verified sample is stored under `output/pdf`.

## 12. Shared architecture

Important reusable components:

| Component | Responsibility |
|---|---|
| `components/app-shell.tsx` | Header, role navigation, notifications, global search, AI Assistant, and responsive shell |
| `components/profile-settings-dialog.tsx` | Role-specific profile editing, image selection/upload, contact OTP verification |
| `components/error-handling-provider.tsx` | Captures browser errors, unhandled promises, and explicitly reported application failures |
| `components/system-error-dialog.tsx` | Shared branded error popup with reference, retry, reload, and dismiss actions |
| `components/dashboard-ui.tsx` | Page headers, statistic cards, panels, and filters |
| `components/role-dashboard.tsx` | Shared structure for Student, Teacher, Super Admin, Regional, and rich learning dashboards |
| `components/operational-screen.tsx` | Reusable search, filters, data table, insights, and demo actions for operational workflows |
| `components/ui/*` | Buttons, tables, dialogs, inputs, badges, progress indicators, charts, and other primitives |
| `lib/pdf-report.ts` | Branded client-side PDF report generation and download |

## 13. Scrollbar and error handling

The dashboard replaces the browser-default scrollbar appearance with a branded teal-to-navy scrollbar. It is applied consistently to the page and overflowing controls. Dark navigation and assistant surfaces use a higher-contrast teal variant. Firefox uses `scrollbar-color` and `scrollbar-width`; Chromium and WebKit browsers use the corresponding `::-webkit-scrollbar` rules.

Error handling is provided at three frontend levels:

- `app/error.tsx` handles recoverable route and render errors and offers **Try again** or **Reload**.
- `app/global-error.tsx` handles critical root-layout failures with a standalone recovery dialog.
- `ErrorHandlingProvider` catches browser runtime errors, unhandled promise rejections, and errors reported by client workflows such as PDF generation.

The popup presents a plain-language message, a support reference, and context-appropriate recovery controls. Existing data is not mutated by the error interface.

## 14. Branding and assets

- Theme: teal, emerald, navy, blue, lime accents, and light dashboard surfaces
- Official logo source: `banoqabil.org`
- Local asset: `public/bano-qabil-official.png`
- Official Hafiz Naeem ur Rehman portrait source: `banoqabil.org/about`
- Local optimized portrait: `public/hafiz-naeem-official.webp`
- No unofficial third-party Bano Qabil imagery is used in the interface

## 15. Frontend-only limitations

The following capabilities are intentionally simulated because the requested scope is frontend only:

- Real authentication, sessions, RBAC, and row-level security
- Database storage and API integration
- Actual CSV/XLSX upload and parsing
- AI mapping, allocation, optimisation, and risk engines
- Real attendance persistence
- Email, SMS, WhatsApp, and push notifications
- Real waitlist offers and seat reservation locking
- Audit-log persistence and tamper protection
- Server-generated, persisted, or digitally signed reports
- Production monitoring, remote error logging, backend recovery, validation, and authorization

These demo interactions are structured so a backend team can later replace local state and dummy arrays with API calls.

## 16. Verification

The project was checked using:

- A successful production build with `npm run build`
- Static role-route and cross-role link audit
- Visual render inspection of the generated sample PDF
- HTTP 200 route checks for all primary screens
- Direct source audit against the PRD screen inventory
- Login role-to-route inspection
- Responsive shared-shell implementation
- Global error-boundary and runtime-error handler compilation
- Cross-browser themed-scrollbar CSS audit

Current implementation status: **frontend screen coverage complete**.
