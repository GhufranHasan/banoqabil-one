'use client';

import { RoleDashboard, dashboardIcons, type RoleDashboardConfig } from '@/components/role-dashboard';

const config: RoleDashboardConfig = {
  role: 'Student', userName: 'Ayesha Khan', title: 'Student Dashboard', description: 'Your classes, progress, attendance and support in one place', greeting: 'Welcome back, Ayesha',
  metrics: [
    { label: 'Course Progress', value: '68%', change: '8.0%', icon: dashboardIcons.BookOpenCheck, tone: 'green', note: 'Web Development' },
    { label: 'Attendance', value: '92%', change: '2.5%', icon: dashboardIcons.CalendarCheck, tone: 'blue', note: '23 of 25 sessions' },
    { label: 'Assignments', value: '7 / 9', change: '14.2%', icon: dashboardIcons.Layers3, tone: 'violet', note: '2 due this week' },
    { label: 'Learning Hours', value: '84h', change: '11.4%', icon: dashboardIcons.Clock3, tone: 'amber', note: 'This term' },
  ],
  primaryTitle: 'My Learning Plan', primarySubtitle: 'Web Development · WD-11 Morning',
  activities: [
    { name: 'Responsive Web Interfaces', detail: 'Module 6 · CSS Grid and Flexbox', status: 'On track', meta: 'Continue lesson 6.4' },
    { name: 'JavaScript Foundations', detail: 'Module 4 · Arrays and objects', status: 'Pending', meta: 'Quiz due May 24' },
    { name: 'Portfolio Project', detail: 'Milestone 2 · Interactive prototype', status: 'Review', meta: 'Submit by May 27' },
    { name: 'Career Readiness', detail: 'Workshop · Interview basics', status: 'Upcoming', meta: 'May 29 · 10:00 AM' },
  ],
  progressTitle: 'Skill Progress',
  progress: [
    { label: 'HTML & accessibility', value: 90, meta: 'Advanced' },
    { label: 'CSS & responsive design', value: 76, meta: 'Intermediate' },
    { label: 'JavaScript', value: 58, meta: 'Developing' },
    { label: 'Portfolio readiness', value: 44, meta: '2 milestones remaining' },
  ],
  quickLinks: [
    { label: 'Rich Learning View', description: 'See modules, certificates and detailed progress.', href: '/dashboard/student/rich', icon: dashboardIcons.GraduationCap },
    { label: 'My Attendance', description: 'Review attendance and session history.', href: '/student/attendance', icon: dashboardIcons.CalendarCheck },
    { label: 'Transfer Request', description: 'Explore another campus, batch or timing.', href: '/transfers', icon: dashboardIcons.MapPinned },
    { label: 'Learning Support', description: 'Ask the AI assistant for course guidance.', href: '/dashboard/student', icon: dashboardIcons.CircleAlert },
  ],
  notice: 'Your JavaScript quiz is due Friday at 6:00 PM.',
};

export default function StudentDashboard() { return <RoleDashboard config={config} />; }
