'use client';

import { RoleDashboard, dashboardIcons, type RoleDashboardConfig } from '@/components/role-dashboard';

const config: RoleDashboardConfig = {
  role: 'Teacher', userName: 'Sara Nawaz', title: 'Teacher Dashboard', description: 'Manage today’s classes, student progress and teaching workload', greeting: 'Good morning, Sara',
  metrics: [
    { label: 'Active Batches', value: '6', change: '8.1%', icon: dashboardIcons.Layers3, tone: 'blue', note: '162 active students' },
    { label: 'Today’s Classes', value: '3', change: '12.0%', icon: dashboardIcons.CalendarCheck, tone: 'green', note: 'Next class at 2:00 PM' },
    { label: 'Attendance Pending', value: '1', change: '3.2%', icon: dashboardIcons.Clock3, tone: 'amber', note: 'WD-11 Morning' },
    { label: 'At-Risk Learners', value: '14', change: '5.4%', icon: dashboardIcons.CircleAlert, tone: 'violet', note: '4 high priority' },
  ],
  primaryTitle: 'Today’s Teaching Plan', primarySubtitle: 'Classes and follow-up actions for May 24',
  activities: [
    { name: 'WD-11 Morning', detail: 'Web Development · Lab 2 · 30 students', status: 'Complete', meta: 'Attendance submitted' },
    { name: 'DM-10 Evening', detail: 'Digital Marketing · Room 101 · 28 students', status: 'Upcoming', meta: 'Starts 2:00 PM' },
    { name: 'GD-09 Evening', detail: 'Graphic Design · Lab 4 · 24 students', status: 'Upcoming', meta: 'Starts 5:30 PM' },
    { name: 'Student Follow-ups', detail: 'Hassan Ali, Maham Shahid + 2 others', status: 'Pending', meta: 'Complete before 6:00 PM' },
  ],
  progressTitle: 'Batch Progress',
  progress: [
    { label: 'WD-11 Morning', value: 76, meta: 'Module 7 of 10' },
    { label: 'DM-10 Evening', value: 63, meta: 'Module 5 of 8' },
    { label: 'GD-09 Evening', value: 81, meta: 'Module 9 of 12' },
    { label: 'UX-06 Morning', value: 52, meta: 'Module 4 of 9' },
  ],
  quickLinks: [
    { label: 'Mark Attendance', description: 'Record attendance for your active classes.', href: '/attendance', icon: dashboardIcons.CalendarCheck },
    { label: 'Student Follow-ups', description: 'Resolve attendance and performance flags.', href: '/follow-ups', icon: dashboardIcons.UsersRound },
    { label: 'My Workload', description: 'Review assigned hours and capacity.', href: '/trainers/workload', icon: dashboardIcons.Clock3 },
    { label: 'My Batches', description: 'Open batch rosters and lesson plans.', href: '/batches', icon: dashboardIcons.Layers3 },
  ],
  notice: 'Attendance for WD-11 Morning is ready to submit.',
};

export default function TeacherDashboard() { return <RoleDashboard config={config} />; }
