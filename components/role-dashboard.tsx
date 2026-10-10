'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BellRing,
  BookOpen,
  BookOpenCheck,
  CalendarCheck,
  CheckCircle2,
  CircleAlert,
  Clock3,
  ExternalLink,
  FileText,
  GraduationCap,
  Layers3,
  MapPinned,
  PlayCircle,
  RotateCcw,
  School,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UsersRound,
} from 'lucide-react';

import { AppShell, type AppRole } from '@/components/app-shell';
import { PageHeader, Panel, StatCard } from '@/components/dashboard-ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/toast';
import { downloadBanoQabilReport } from '@/lib/pdf-report';

type Metric = { label: string; value: string; change: string; icon: LucideIcon; tone: 'green' | 'blue' | 'amber' | 'lime' | 'violet'; note?: string };
export type Activity = { name: string; detail: string; status: string; meta: string };

export type RoleDashboardConfig = {
  role: AppRole;
  userName: string;
  title: string;
  description: string;
  greeting: string;
  metrics: Metric[];
  primaryTitle: string;
  primarySubtitle: string;
  activities: Activity[];
  progressTitle: string;
  progress: { label: string; value: number; meta: string }[];
  quickLinks: { label: string; description: string; href: string; icon: LucideIcon }[];
  notice: string;
};

const statusTone: Record<string, string> = {
  'On track': 'bg-emerald-50 text-emerald-700',
  Complete: 'bg-emerald-50 text-emerald-700',
  Healthy: 'bg-emerald-50 text-emerald-700',
  Upcoming: 'bg-blue-50 text-blue-700',
  Pending: 'bg-amber-50 text-amber-700',
  Review: 'bg-amber-50 text-amber-700',
  'At risk': 'bg-red-50 text-red-600',
};

function getActivityMetadata(name: string, role: AppRole) {
  const metadataMap: Record<string, {
    description: string;
    topics: string[];
    duration: string;
    resources: string[];
    instructor?: string;
  }> = {
    'Responsive Web Interfaces': {
      description: 'Master modern responsive layout techniques using CSS Grid, Flexbox, media queries, and mobile-first design principles.',
      topics: [
        'CSS Flexbox alignments & flex-grow / flex-shrink properties',
        'CSS Grid 2D layout systems & grid-template-areas',
        'Mobile-first responsive media queries & container queries',
        'Fluid typography and layout scaling using clamp()',
      ],
      duration: '4 hours · 6 lessons · 4 interactive labs',
      resources: ['Module 6 Slides.pdf', 'Flexbox Cheat Sheet', 'Grid Code Sandbox'],
      instructor: 'Engr. Sara Nawaz',
    },
    'JavaScript Foundations': {
      description: 'Core JavaScript fundamentals covering ES6+ syntax, arrays, objects, functions, loops, and Document Object Model (DOM) manipulation.',
      topics: [
        'Variables (let/const), primitive data types, and scope',
        'Array methods: map(), filter(), reduce(), and find()',
        'Object manipulation, destructuring, and spread operator',
        'DOM manipulation, event listeners, and dynamic UI updates',
      ],
      duration: '6 hours · 10 lessons · 8 exercises · 1 quiz',
      resources: ['JS Syntax Handbook.pdf', 'Array Practice Problems', 'Sandbox Lab'],
      instructor: 'Muhammad Tariq',
    },
    'Portfolio Project': {
      description: 'Build and deploy an industry-standard developer portfolio site showcasing your projects, technical skills, and credentials.',
      topics: [
        'Portfolio wireframing & UX layout architecture',
        'Interactive project showcase cards & live demo modals',
        'Contact form with client-side validation',
        'Live deployment on Vercel / GitHub Pages',
      ],
      duration: '8 hours · Milestone 2 of 3 · Mentor Review',
      resources: ['Portfolio Spec.pdf', 'Design Assets.zip', 'Deployment Checklist'],
      instructor: 'Engr. Sara Nawaz',
    },
    'Career Readiness': {
      description: 'Prepare for software industry interviews, LinkedIn profile optimization, tech resume writing, and soft skills needed in IT teams.',
      topics: [
        'Crafting an ATS-friendly tech resume & portfolio link',
        'Optimizing LinkedIn & GitHub profiles for recruiters',
        'Common frontend coding interview questions & answers',
        'Mock behavioral interview session & salary negotiation basics',
      ],
      duration: '2-hour interactive workshop · Live Q&A',
      resources: ['Resume Template.docx', 'Tech Interview Question Bank.pdf'],
      instructor: 'Industry Career Mentors',
    },
    'HTML Foundations': {
      description: 'Semantic HTML5 structure, web accessibility standards (WCAG 2.1), accessible forms, SEO metadata, and media elements.',
      topics: [
        'Semantic HTML elements: article, section, nav, header, main',
        'Accessible form controls, labels, and aria attributes',
        'Image optimization, picture tag, and lazy loading',
        'SEO metadata, OpenGraph tags, and document head',
      ],
      duration: '5 hours · 6 lessons · 4 exercises · 1 project',
      resources: ['HTML5 Reference.pdf', 'WCAG Accessibility Checklist'],
      instructor: 'Bilal Tariq',
    },
    'Modern CSS': {
      description: 'Deep dive into modern CSS features including CSS variables, transitions, animations, pseudo-classes, and Tailwind utility classes.',
      topics: [
        'CSS Custom Properties (Variables) and dark/light theming',
        'CSS Transitions & Keyframe animations for micro-interactions',
        'Modern selectors (:is, :where, :has)',
        'Utility-first CSS patterns and responsive design tokens',
      ],
      duration: '6 hours · 8 lessons · 6 exercises · 1 project',
      resources: ['Modern CSS Guide.pdf', 'Animation Keyframe Sandbox'],
      instructor: 'Engr. Sara Nawaz',
    },
    'JavaScript Essentials': {
      description: 'Asynchronous JavaScript concepts including Promises, async/await, fetch API, LocalStorage, and modular ES modules.',
      topics: [
        'Asynchronous JS & JavaScript Event Loop architecture',
        'Promises, async/await, and REST API data fetching',
        'Browser Web Storage (LocalStorage & SessionStorage)',
        'ES Modules import/export architecture and error handling',
      ],
      duration: '8 hours · 10 lessons · 8 exercises · 2 projects',
      resources: ['Async JS Handbook.pdf', 'API Fetching Code Lab'],
      instructor: 'Muhammad Tariq',
    },
    'React Foundations': {
      description: 'Introduction to component-driven frontend architecture with React 19, JSX syntax, state management, and essential React hooks.',
      topics: [
        'React JSX syntax and component composition hierarchy',
        'Props passing, state management, and conditional rendering',
        'useState & useEffect hooks for reactive data flow',
        'Component lifecycle, side effects, and cleanups',
      ],
      duration: '10 hours · 9 lessons · 5 exercises · 1 project',
      resources: ['React 19 Essentials.pdf', 'Vite React Starter Template'],
      instructor: 'Engr. Sara Nawaz',
    },
    'Career Portfolio': {
      description: 'Final technical capstone review of your full portfolio repository with senior software mentors.',
      topics: [
        'Code quality audit and lighthouse performance audit',
        'Cross-browser and responsive testing across mobile & desktop',
        'Mentor feedback review and revisions',
        'Final certificate endorsement preparation',
      ],
      duration: '3 milestones · Final review phase',
      resources: ['Portfolio Rubric.pdf', 'Submission Portal Link'],
      instructor: 'Lead Evaluator Panel',
    },
  };

  if (metadataMap[name]) {
    return metadataMap[name];
  }

  return {
    description: `Detailed operational overview and guidelines for ${name}. Review action items, requirements, and completion status.`,
    topics: [
      `Review key parameters and operational schedule for ${name}`,
      'Verify requirements and coordinate with relevant stakeholders',
      'Track progress towards target outcomes',
      'Log completion and submit status update',
    ],
    duration: 'Active operational item',
    resources: ['Operational Guidelines.pdf', 'Summary Notes.docx'],
    instructor: role === 'Teacher' ? 'Assigned Faculty' : 'Platform Operations',
  };
}

export function RoleDashboard({ config }: { config: RoleDashboardConfig }) {
  const [notice, setNotice] = useState(config.notice);
  const [completed, setCompleted] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  function toggleComplete(name: string) {
    if (completed.includes(name)) {
      setCompleted((current) => current.filter((item) => item !== name));
      setNotice(`${name} was marked as in progress.`);
      toast.add({ title: 'Status updated', description: `${name} marked as in progress.`, type: 'info' });
    } else {
      setCompleted((current) => [...current, name]);
      setNotice(`${name} was marked complete in this frontend demo.`);
      toast.add({ title: 'Completed!', description: `${name} marked as complete.`, type: 'success' });
    }
  }

  function generateReport() {
    downloadBanoQabilReport({
      title: config.title,
      subtitle: config.description,
      preparedBy: `${config.userName} - ${config.role}`,
      sections: [
        ...config.metrics.map((metric) => ({ label: metric.label, value: metric.value })),
        ...config.progress.map((item) => ({ label: item.label, value: `${item.value}% - ${item.meta}` })),
      ],
    });
    setNotice('A BanoQabil One PDF report was generated and downloaded.');
    toast.add({ title: 'Report ready', description: 'The branded PDF report was downloaded.', type: 'success' });
  }

  const filteredActivities = useMemo(() => {
    return config.activities.filter((item) => {
      const isDone = completed.includes(item.name);
      const effectiveStatus = isDone ? 'Complete' : item.status;

      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meta.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === 'all') return true;
      if (statusFilter === 'complete') return isDone || item.status === 'Complete';
      if (statusFilter === 'ontrack') return !isDone && item.status === 'On track';
      if (statusFilter === 'pending') return !isDone && (item.status === 'Pending' || item.status === 'Review');

      return effectiveStatus.toLowerCase() === statusFilter.toLowerCase();
    });
  }, [config.activities, completed, searchQuery, statusFilter]);

  const selectedMeta = selectedActivity ? getActivityMetadata(selectedActivity.name, config.role) : null;
  const isSelectedDone = selectedActivity ? completed.includes(selectedActivity.name) || selectedActivity.status === 'Complete' : false;

  return (
    <AppShell role={config.role} userName={config.userName}>
      <PageHeader
        title={config.title}
        description={config.description}
        actions={
          <>
            <Button variant="outline" className="bg-white">
              <CalendarCheck />
              This week
            </Button>
            <Button onClick={generateReport} className="bg-gradient-to-r from-[#08aa87] to-[#083b85] text-white">
              <TrendingUp />
              Generate report
            </Button>
          </>
        }
      />

      <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-xs text-emerald-800">
        <span className="flex items-center gap-2">
          <BellRing className="size-4" />
          {notice}
        </span>
        <button onClick={() => setNotice('You are all caught up.')} className="font-semibold text-emerald-700 hover:underline">
          Dismiss
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {config.metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,.8fr)]">
        <Panel
          title={config.primaryTitle}
          subtitle={config.primarySubtitle}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewAllOpen(true)}
              className="h-8 text-xs font-semibold hover:border-emerald-300 hover:text-emerald-700"
            >
              View all
            </Button>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">Item</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next step</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {config.activities.map((item) => {
                const isDone = completed.includes(item.name);
                return (
                  <TableRow key={item.name} className="hover:bg-slate-50/60">
                    <TableCell className="px-4 py-3">
                      <p className="text-xs font-semibold text-[#14325f]">{item.name}</p>
                      <p className="mt-1 text-[9px] text-slate-400">{item.meta}</p>
                    </TableCell>
                    <TableCell className="text-[10px] text-slate-500">{item.detail}</TableCell>
                    <TableCell>
                      <Badge className={isDone ? statusTone.Complete : statusTone[item.status] ?? 'bg-slate-100 text-slate-600'}>
                        {isDone ? 'Complete' : item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[10px] text-slate-500">
                      {isDone ? 'Completed' : item.meta}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => setSelectedActivity(item)}
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 text-xs font-medium text-[#14325f] hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700"
                      >
                        {isDone ? <CheckCircle2 className="size-3.5 text-emerald-600" /> : <ArrowRight className="size-3.5" />}
                        {isDone ? 'Review' : 'Open'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Panel>

        <Panel title={config.progressTitle} subtitle="Live dummy data for this demo">
          <div className="space-y-5 p-5">
            {config.progress.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-medium text-[#17345f]">{item.label}</span>
                  <b className="text-[#0b1f4d]">{item.value}%</b>
                </div>
                <Progress
                  value={item.value}
                  className="[&_[data-slot=progress-indicator]]:bg-gradient-to-r [&_[data-slot=progress-indicator]]:from-emerald-500 [&_[data-slot=progress-indicator]]:to-blue-700"
                />
                <p className="mt-1.5 text-[9px] text-slate-400">{item.meta}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {config.quickLinks.map(({ label, description, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-xl border border-slate-200 bg-white p-4 shadow-[0_4px_18px_rgb(15_23_42/3%)] transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <Icon className="size-5" />
            </span>
            <p className="mt-4 text-sm font-bold text-[#0b1f4d]">{label}</p>
            <p className="mt-1 text-[10px] leading-4 text-slate-500">{description}</p>
            <span className="mt-4 flex items-center gap-1 text-[10px] font-semibold text-blue-600">
              Open <ArrowRight className="size-3 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>

      {/* 1. ITEM / MODULE DETAIL DIALOG (Opened via "Open" button) */}
      <Dialog open={Boolean(selectedActivity)} onOpenChange={(open) => !open && setSelectedActivity(null)}>
        {selectedActivity && selectedMeta && (
          <DialogContent className="sm:max-w-xl bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto bq-scroll">
            <DialogHeader className="gap-1 border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between gap-3 pr-6">
                <Badge
                  className={
                    isSelectedDone
                      ? statusTone.Complete
                      : statusTone[selectedActivity.status] ?? 'bg-slate-100 text-slate-600'
                  }
                >
                  {isSelectedDone ? 'Complete' : selectedActivity.status}
                </Badge>
                <span className="text-[11px] font-medium text-slate-400">{selectedMeta.duration}</span>
              </div>
              <DialogTitle className="text-lg font-bold text-[#0b1f4d] mt-2">
                {selectedActivity.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                {selectedActivity.detail} · {config.primarySubtitle}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="rounded-xl bg-slate-50/80 p-3.5 border border-slate-100">
                <p className="text-xs text-slate-700 leading-relaxed">{selectedMeta.description}</p>
                {selectedMeta.instructor && (
                  <p className="mt-2 text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
                    <GraduationCap className="size-3.5" />
                    Instructor / Evaluator: {selectedMeta.instructor}
                  </p>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#14325f] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="size-3.5 text-blue-600" />
                  Key Curriculum Topics & Objectives
                </h4>
                <div className="space-y-2">
                  {selectedMeta.topics.map((topic, i) => (
                    <div key={i} className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-white p-2.5 text-xs text-slate-700">
                      <CheckCircle2 className={`size-4 shrink-0 mt-0.5 ${isSelectedDone ? 'text-emerald-500' : 'text-blue-500'}`} />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium text-blue-700 uppercase tracking-wider">Next Step & Milestone</p>
                  <p className="text-xs font-semibold text-[#0b1f4d] mt-0.5">{selectedActivity.meta}</p>
                </div>
                <Badge variant="outline" className="bg-white text-blue-700 border-blue-200 text-[10px]">
                  {selectedActivity.status}
                </Badge>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
                  <FileText className="size-3.5 text-slate-400" />
                  Associated Learning Resources
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedMeta.resources.map((res, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600 hover:bg-slate-100 cursor-pointer transition"
                      onClick={() => toast.add({ title: 'Resource Downloaded', description: `${res} downloaded for offline study.`, type: 'info' })}
                    >
                      <FileText className="size-3 text-slate-400" />
                      {res}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-2 border-t border-slate-100 pt-4 flex-row items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toggleComplete(selectedActivity.name)}
                className={
                  completed.includes(selectedActivity.name)
                    ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                    : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                }
              >
                {completed.includes(selectedActivity.name) ? (
                  <>
                    <RotateCcw className="size-3.5 mr-1" />
                    Mark Incomplete
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3.5 mr-1 text-emerald-600" />
                    Mark as Completed
                  </>
                )}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    toast.add({
                      title: 'Continuing Module',
                      description: `Launching workspace for ${selectedActivity.name}...`,
                      type: 'success',
                    });
                    setSelectedActivity(null);
                  }}
                  className="bg-gradient-to-r from-[#08aa87] to-[#083b85] text-white"
                >
                  <PlayCircle className="size-3.5 mr-1" />
                  Continue Lesson
                </Button>
                <DialogClose render={<Button variant="ghost" size="sm">Close</Button>} />
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* 2. VIEW ALL ACTIVITIES / MODULES DIALOG (Opened via "View all" button) */}
      <Dialog open={viewAllOpen} onOpenChange={setViewAllOpen}>
        <DialogContent className="sm:max-w-2xl bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 max-h-[88vh] overflow-y-auto bq-scroll">
          <DialogHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between pr-6">
              <DialogTitle className="text-lg font-bold text-[#0b1f4d]">
                {config.primaryTitle} — Full Overview
              </DialogTitle>
              <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50 text-[10px]">
                {config.activities.length} Total Items
              </Badge>
            </div>
            <DialogDescription className="text-xs text-slate-500">
              {config.primarySubtitle} · Explore and review all modules, milestones, and assignments for {config.userName}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* Search & filter row */}
            <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
                <Input
                  placeholder="Search modules, lessons, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8 text-xs bg-slate-50 border-slate-200"
                />
              </div>
              <div className="flex gap-1">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'ontrack', label: 'On Track' },
                  { id: 'pending', label: 'Pending' },
                  { id: 'complete', label: 'Complete' },
                ].map((tab) => (
                  <Button
                    key={tab.id}
                    variant={statusFilter === tab.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(tab.id)}
                    className={`h-7 px-2.5 text-[11px] ${
                      statusFilter === tab.id
                        ? 'bg-[#0f3460] text-white hover:bg-[#1a4a82]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Activities Table */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="px-4 text-[10px] uppercase">Module / Item</TableHead>
                    <TableHead className="text-[10px] uppercase">Details</TableHead>
                    <TableHead className="text-[10px] uppercase">Status</TableHead>
                    <TableHead className="text-[10px] uppercase">Next Step</TableHead>
                    <TableHead className="text-right text-[10px] uppercase pr-4">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-xs text-slate-400">
                        No modules found matching &ldquo;{searchQuery}&rdquo;.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredActivities.map((item) => {
                      const isDone = completed.includes(item.name);
                      return (
                        <TableRow key={item.name} className="hover:bg-slate-50/70">
                          <TableCell className="px-4 py-3">
                            <p className="text-xs font-semibold text-[#14325f]">{item.name}</p>
                            <p className="text-[9px] text-slate-400 mt-0.5">{item.meta}</p>
                          </TableCell>
                          <TableCell className="text-[11px] text-slate-500">{item.detail}</TableCell>
                          <TableCell>
                            <Badge className={isDone ? statusTone.Complete : statusTone[item.status] ?? 'bg-slate-100 text-slate-600'}>
                              {isDone ? 'Complete' : item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-[10px] text-slate-500">
                            {isDone ? 'Completed' : item.meta}
                          </TableCell>
                          <TableCell className="text-right pr-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setViewAllOpen(false);
                                setSelectedActivity(item);
                              }}
                              className="h-7 text-xs gap-1 hover:border-emerald-300 hover:text-emerald-700"
                            >
                              <ArrowRight className="size-3" />
                              Open
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Cross-navigation banner for Students */}
            {config.role === 'Student' && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
                    <GraduationCap className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#0b1f4d]">Explore Full Pathway & Certificates</p>
                    <p className="text-[10px] text-slate-500">View complete competency milestones and credential readiness</p>
                  </div>
                </div>
                <Link href="/dashboard/student/rich" onClick={() => setViewAllOpen(false)}>
                  <Button size="sm" className="bg-[#0f3460] text-white hover:bg-[#1a4a82] text-xs h-8">
                    My Learning Journey <ArrowRight className="size-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <DialogFooter className="border-t border-slate-100 pt-3">
            <DialogClose render={<Button variant="outline" size="sm">Close</Button>} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

export const dashboardIcons = { UsersRound, GraduationCap, BookOpenCheck, CalendarCheck, Clock3, CircleAlert, Layers3, School, ShieldCheck, MapPinned };
