'use client';

import { RoleDashboard, dashboardIcons, type RoleDashboardConfig } from '@/components/role-dashboard';

const config: RoleDashboardConfig = {
  role: 'Student', userName: 'Ayesha Khan', title: 'My Learning Journey', description: 'A detailed view of modules, skills, milestones and credentials', greeting: 'Keep going, Ayesha',
  metrics: [
    { label: 'Overall Progress', value: '68%', change: '8.0%', icon: dashboardIcons.GraduationCap, tone: 'green', note: '204 of 300 points' },
    { label: 'Modules Complete', value: '18 / 27', change: '12.5%', icon: dashboardIcons.BookOpenCheck, tone: 'blue', note: '3 courses active' },
    { label: 'Current Streak', value: '12 days', change: '20%', icon: dashboardIcons.CalendarCheck, tone: 'amber', note: 'Personal best: 18' },
    { label: 'Certificates', value: '2', change: '50%', icon: dashboardIcons.ShieldCheck, tone: 'violet', note: '1 nearly unlocked' },
  ],
  primaryTitle: 'Course Modules', primarySubtitle: 'Web Development professional pathway',
  activities: [
    { name: 'HTML Foundations', detail: '6 lessons · 4 exercises · 1 project', status: 'Complete', meta: 'Completed May 2' },
    { name: 'Modern CSS', detail: '8 lessons · 6 exercises · 1 project', status: 'On track', meta: 'Lesson 7 of 8' },
    { name: 'JavaScript Essentials', detail: '10 lessons · 8 exercises · 2 projects', status: 'Pending', meta: 'Quiz due Friday' },
    { name: 'React Foundations', detail: '9 lessons · 5 exercises · 1 project', status: 'Upcoming', meta: 'Unlocks after JavaScript' },
    { name: 'Career Portfolio', detail: '3 milestones · mentor review', status: 'Review', meta: 'Milestone 2 due May 27' },
  ],
  progressTitle: 'Credential Readiness',
  progress: [
    { label: 'Technical assessments', value: 72, meta: 'Average score: 86%' },
    { label: 'Practical projects', value: 67, meta: '2 of 3 submitted' },
    { label: 'Attendance requirement', value: 92, meta: 'Minimum required: 80%' },
    { label: 'Career workshops', value: 50, meta: '2 of 4 completed' },
  ],
  quickLinks: [
    { label: 'Student Home', description: 'Return to your daily overview.', href: '/dashboard/student', icon: dashboardIcons.UsersRound },
    { label: 'Attendance History', description: 'See every class session and attendance mark.', href: '/student/attendance', icon: dashboardIcons.CalendarCheck },
    { label: 'Transfer Options', description: 'Compare suitable batches near you.', href: '/transfers', icon: dashboardIcons.MapPinned },
    { label: 'Certificates', description: 'View earned credentials and requirements.', href: '/dashboard/student/rich', icon: dashboardIcons.ShieldCheck },
  ],
  notice: 'Complete the JavaScript quiz to unlock React Foundations.',
};

export default function RichStudentDashboard() { return <RoleDashboard config={config} />; }
