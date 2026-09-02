'use client';

import { RoleDashboard, dashboardIcons, type RoleDashboardConfig } from '@/components/role-dashboard';

const config: RoleDashboardConfig = {
  role: 'Super Admin', userName: 'Ahmad Saeed', title: 'Super Admin Dashboard', description: 'Network-wide performance, governance and system operations', greeting: 'Good morning, Ahmad',
  metrics: [
    { label: 'Active Campuses', value: '356', change: '4.2%', icon: dashboardIcons.School, tone: 'green', note: 'Across 12 regions' },
    { label: 'Platform Users', value: '1.33M', change: '12.5%', icon: dashboardIcons.UsersRound, tone: 'blue', note: 'Learners, staff and trainers' },
    { label: 'System Availability', value: '99.98%', change: '0.2%', icon: dashboardIcons.ShieldCheck, tone: 'violet', note: 'All core services healthy' },
    { label: 'Approvals Pending', value: '37', change: '3.1%', icon: dashboardIcons.CircleAlert, tone: 'amber', note: 'Governance and access requests' },
  ],
  primaryTitle: 'Super Admin Approval Queue', primarySubtitle: 'Network-wide governance, access and policy decisions',
  activities: [
    { name: 'Regional access request', detail: 'Farah Malik · Lahore Region', status: 'Review', meta: 'Verify expanded reporting scope' },
    { name: 'New campus activation', detail: 'Sargodha 47 Pull Campus', status: 'Pending', meta: 'Infrastructure verification complete' },
    { name: 'Allocation run approval', detail: 'ALLOC-2026-0902 · 1,086 learners', status: 'Review', meta: '126 proposals need attention' },
    { name: 'Refund policy update', detail: 'Security fee attendance threshold', status: 'Pending', meta: 'Proposed eligibility: 80%' },
    { name: 'Data retention review', detail: 'Audit and import records', status: 'Upcoming', meta: 'Policy review due Sep 5' },
  ],
  progressTitle: 'Platform Governance Health',
  progress: [
    { label: 'Role verification', value: 96, meta: '42 accounts pending review' },
    { label: 'Data quality', value: 94, meta: '84 duplicate pairs open' },
    { label: 'Policy compliance', value: 91, meta: '12 exceptions require action' },
    { label: 'Platform availability', value: 99, meta: 'All core services operational' },
  ],
  quickLinks: [
    { label: 'Allocation Runs', description: 'Review AI-assisted student-to-batch proposals.', href: '/allocation', icon: dashboardIcons.Layers3 },
    { label: 'System Settings', description: 'Manage network policies, eligibility and defaults.', href: '/settings', icon: dashboardIcons.ShieldCheck },
    { label: 'Data Quality', description: 'Resolve possible duplicate learner profiles.', href: '/duplicates', icon: dashboardIcons.UsersRound },
    { label: 'Audit & Security', description: 'Inspect sensitive actions and governance events.', href: '/audit', icon: dashboardIcons.BookOpenCheck },
  ],
  notice: '37 governance items and 12 regional approvals need review today.',
};

export default function AdminDashboard() { return <RoleDashboard config={config} />; }
