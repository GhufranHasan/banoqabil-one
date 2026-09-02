'use client';

import { RoleDashboard, dashboardIcons, type RoleDashboardConfig } from '@/components/role-dashboard';

const config: RoleDashboardConfig = {
  role: 'Regional Manager', userName: 'Farah Malik', title: 'Regional Manager Dashboard', description: 'Campus performance and capacity across the Lahore region', greeting: 'Good morning, Farah',
  metrics: [
    { label: 'Campuses', value: '62', change: '4.2%', icon: dashboardIcons.School, tone: 'green', note: '58 fully operational' },
    { label: 'Active Learners', value: '224K', change: '9.8%', icon: dashboardIcons.UsersRound, tone: 'blue', note: 'Across 614 batches' },
    { label: 'Average Occupancy', value: '81%', change: '3.6%', icon: dashboardIcons.Layers3, tone: 'lime', note: '4% above target' },
    { label: 'Action Items', value: '19', change: '2.1%', icon: dashboardIcons.CircleAlert, tone: 'amber', note: '6 due today' },
  ],
  primaryTitle: 'Campus Comparison', primarySubtitle: 'Lahore region performance leaderboard',
  activities: [
    { name: 'Iqbal Town Campus', detail: '48 batches · 1,384 students', status: 'Healthy', meta: '88% occupancy' },
    { name: 'Johar Town Campus', detail: '42 batches · 1,126 students', status: 'Healthy', meta: '84% occupancy' },
    { name: 'Model Town Campus', detail: '36 batches · 918 students', status: 'Review', meta: '71% occupancy' },
    { name: 'Shahdara Campus', detail: '24 batches · 602 students', status: 'At risk', meta: '58% occupancy' },
  ],
  progressTitle: 'Regional Targets',
  progress: [
    { label: 'Admissions target', value: 86, meta: '18,420 of 21,400 learners' },
    { label: 'Seat utilization', value: 81, meta: 'Goal: 85%' },
    { label: 'Trainer coverage', value: 93, meta: '11 vacancies remain' },
    { label: 'Follow-up closure', value: 74, meta: '238 open cases' },
  ],
  quickLinks: [
    { label: 'Seat Availability', description: 'Compare capacity across campuses and courses.', href: '/seat-availability', icon: dashboardIcons.School },
    { label: 'Trainer Workload', description: 'Balance delivery capacity between campuses.', href: '/trainers/workload', icon: dashboardIcons.GraduationCap },
    { label: 'Reports', description: 'Open regional performance reports.', href: '/reports', icon: dashboardIcons.BookOpenCheck },
    { label: 'Follow-ups', description: 'Review outstanding campus action items.', href: '/follow-ups', icon: dashboardIcons.CircleAlert },
  ],
  notice: 'Shahdara Campus needs a capacity improvement plan this week.',
};

export default function RegionalDashboard() { return <RoleDashboard config={config} />; }
