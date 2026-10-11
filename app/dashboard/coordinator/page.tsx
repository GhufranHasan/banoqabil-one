'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileSpreadsheet,
  GraduationCap,
  Layers3,
  MoreVertical,
  Send,
  Upload,
  UsersRound,
} from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import { AppShell } from '@/components/app-shell';
import { PageHeader, Panel, StatCard } from '@/components/dashboard-ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CampusDashboardData {
  campusName: string;
  cityName: string;
  registeredStudents: string;
  studentsChange: string;
  activeBatches: string;
  batchesChange: string;
  atRiskStudents: string;
  riskChange: string;
  seatsRecovered: string;
  recoveryChange: string;
  followups: Array<[string, string, string, string]>;
  trainers: Array<[string, string, string, number]>;
  fillRate: Array<{ week: string; rate: number }>;
  aiSummary: string;
}

const campusData: Record<string, CampusDashboardData> = {
  'campus-gulshan': {
    campusName: 'Gulshan Campus, Karachi',
    cityName: 'Karachi',
    registeredStudents: '1,248',
    studentsChange: '12.5%',
    activeBatches: '24',
    batchesChange: '8.1%',
    atRiskStudents: '38',
    riskChange: '6.3%',
    seatsRecovered: '56',
    recoveryChange: '15.7%',
    followups: [
      ['Ahmed Raza', 'Consecutive Absence (3 classes)', 'High', 'Today'],
      ['Fatima Zahra', 'Attendance 42% (Cert at risk)', 'High', 'Today'],
      ['Muhammad Bilal', 'Fee confirmation pending', 'Medium', 'Tomorrow'],
      ['Zainab Fatima', 'Inactive (7+ days)', 'Medium', 'Tomorrow'],
      ['Safeer Ahmed', 'Batch timing change req.', 'Low', 'May 26'],
      ['Laiba Noor', 'Contact not reachable', 'Low', 'May 26'],
    ],
    trainers: [
      ['AM', 'Ali Mehmood', '4 Batches', 75],
      ['SN', 'Sara Nawaz', '4 Batches (Standard)', 70],
      ['BT', 'Bilal Tariq', '3 Batches', 55],
      ['KB', 'Kiran Batool', '3 Batches', 50],
      ['FA', 'Faisal Ahmed', '2 Batches', 40],
    ],
    fillRate: [
      { week: 'Mar 30', rate: 62 }, { week: 'Apr 6', rate: 78 }, { week: 'Apr 13', rate: 66 }, { week: 'Apr 20', rate: 73 },
      { week: 'Apr 27', rate: 67 }, { week: 'May 4', rate: 60 }, { week: 'May 11', rate: 58 }, { week: 'May 18', rate: 68 },
    ],
    aiSummary: '38 at-risk students need coordinator contact in Gulshan. 15 dead seats can be recovered from no-shows.',
  },
  'campus-nazimabad-girls': {
    campusName: 'Nazimabad Girls Campus, Karachi',
    cityName: 'Karachi',
    registeredStudents: '980',
    studentsChange: '9.8%',
    activeBatches: '18',
    batchesChange: '5.5%',
    atRiskStudents: '24',
    riskChange: '4.2%',
    seatsRecovered: '41',
    recoveryChange: '11.2%',
    followups: [
      ['Ayesha Siddiqui', 'Attendance 48% (Slip risk)', 'High', 'Today'],
      ['Hafsa Noor', 'Document verification pending', 'Medium', 'Tomorrow'],
      ['Khadija Khan', 'Morning shift transfer', 'Low', 'May 28'],
      ['Sadia Parveen', 'Inactive (5 days)', 'Low', 'May 29'],
    ],
    trainers: [
      ['SN', 'Sara Nawaz', '4 Batches', 80],
      ['FN', 'Farah Naz', '4 Batches', 72],
      ['MA', 'Maria Aslam', '3 Batches', 58],
      ['ZM', 'Zoya Malik', '2 Batches', 45],
    ],
    fillRate: [
      { week: 'Mar 30', rate: 70 }, { week: 'Apr 6', rate: 82 }, { week: 'Apr 13', rate: 74 }, { week: 'Apr 20', rate: 79 },
      { week: 'Apr 27', rate: 75 }, { week: 'May 4', rate: 68 }, { week: 'May 11', rate: 64 }, { week: 'May 18', rate: 76 },
    ],
    aiSummary: 'Nazimabad Girls Campus has 24 at-risk students. Female-only batches have 92% retention rate.',
  },
  'campus-lahore-township': {
    campusName: 'Lahore Township Campus',
    cityName: 'Lahore',
    registeredStudents: '1,150',
    studentsChange: '11.4%',
    activeBatches: '20',
    batchesChange: '7.3%',
    atRiskStudents: '31',
    riskChange: '5.1%',
    seatsRecovered: '48',
    recoveryChange: '14.0%',
    followups: [
      ['Bilal Hussain', 'Consecutive Absence (4 classes)', 'High', 'Today'],
      ['Zeeshan Ali', 'Midterm project missed', 'High', 'Today'],
      ['Omer Farooq', 'Document verification', 'Medium', 'Tomorrow'],
      ['Hassan Raza', 'Fee clearance pending', 'Low', 'May 27'],
    ],
    trainers: [
      ['ZU', 'Zubair Usman', '4 Batches', 82],
      ['AR', 'Asim Rauf', '3 Batches', 65],
      ['MR', 'Mian Rashid', '3 Batches', 58],
      ['TH', 'Tariq Habib', '2 Batches', 42],
    ],
    fillRate: [
      { week: 'Mar 30', rate: 65 }, { week: 'Apr 6', rate: 80 }, { week: 'Apr 13', rate: 72 }, { week: 'Apr 20', rate: 76 },
      { week: 'Apr 27', rate: 70 }, { week: 'May 4', rate: 64 }, { week: 'May 11', rate: 62 }, { week: 'May 18', rate: 71 },
    ],
    aiSummary: '31 at-risk students flagged in Lahore Township. Web Dev batch evening has 8 recoverable seats.',
  },
  'campus-iqbal-lahore': {
    campusName: 'Iqbal Campus, Lahore',
    cityName: 'Lahore',
    registeredStudents: '620',
    studentsChange: '8.2%',
    activeBatches: '12',
    batchesChange: '6.0%',
    atRiskStudents: '19',
    riskChange: '3.8%',
    seatsRecovered: '25',
    recoveryChange: '9.5%',
    followups: [
      ['Hamza Javed', 'Attendance below 65%', 'High', 'Today'],
      ['Usman Sheikh', 'Exam registration issue', 'Medium', 'Tomorrow'],
      ['Aliyan Butt', 'Batch reschedule req.', 'Low', 'May 28'],
    ],
    trainers: [
      ['KN', 'Kamran Niaz', '3 Batches', 68],
      ['SR', 'Salman Rafiq', '3 Batches', 62],
      ['WA', 'Waqas Ali', '2 Batches', 48],
    ],
    fillRate: [
      { week: 'Mar 30', rate: 58 }, { week: 'Apr 6', rate: 72 }, { week: 'Apr 13', rate: 64 }, { week: 'Apr 20', rate: 69 },
      { week: 'Apr 27', rate: 63 }, { week: 'May 4', rate: 59 }, { week: 'May 11', rate: 57 }, { week: 'May 18', rate: 66 },
    ],
    aiSummary: 'Iqbal Campus shows stable attendance across 12 batches with 19 students in follow-up queue.',
  },
  'campus-isb-i8': {
    campusName: 'I-8 Campus (Jamia Masjid Al Furqan)',
    cityName: 'Islamabad',
    registeredStudents: '480',
    studentsChange: '7.5%',
    activeBatches: '10',
    batchesChange: '4.8%',
    atRiskStudents: '14',
    riskChange: '2.9%',
    seatsRecovered: '18',
    recoveryChange: '8.0%',
    followups: [
      ['Usman Tariq', 'Consecutive Absence (2 classes)', 'High', 'Today'],
      ['Hamza Abbasi', 'Attendance below 60%', 'High', 'Today'],
      ['Maryam Bibi', 'Laptop requirement aid', 'Medium', 'Tomorrow'],
      ['Saad Rehman', 'Shift change inquiry', 'Low', 'May 28'],
    ],
    trainers: [
      ['MA', 'Muhammad Asim', '3 Batches', 65],
      ['SZ', 'Syed Zohaib', '3 Batches', 60],
      ['FK', 'Farhan Khan', '2 Batches', 45],
    ],
    fillRate: [
      { week: 'Mar 30', rate: 68 }, { week: 'Apr 6', rate: 75 }, { week: 'Apr 13', rate: 70 }, { week: 'Apr 20', rate: 74 },
      { week: 'Apr 27', rate: 72 }, { week: 'May 4', rate: 66 }, { week: 'May 11', rate: 65 }, { week: 'May 18', rate: 73 },
    ],
    aiSummary: 'I-8 Campus has 14 follow-up cases. Graphic Design morning batch has 5 available seats.',
  },
  'campus-isb-h8': {
    campusName: 'H-8 Campus (Jamia Tafheem-ul-Quran)',
    cityName: 'Islamabad',
    registeredStudents: '340',
    studentsChange: '6.1%',
    activeBatches: '7',
    batchesChange: '3.5%',
    atRiskStudents: '9',
    riskChange: '2.1%',
    seatsRecovered: '12',
    recoveryChange: '6.5%',
    followups: [
      ['Danish Ali', 'Attendance below 65%', 'High', 'Today'],
      ['Shoaib Khan', 'Laptop setup assistance', 'Medium', 'Tomorrow'],
      ['Farhan Malik', 'Batch timing conflict', 'Low', 'May 27'],
    ],
    trainers: [
      ['SZ', 'Syed Zohaib', '3 Batches', 62],
      ['AN', 'Asad Naeem', '2 Batches', 44],
    ],
    fillRate: [
      { week: 'Mar 30', rate: 64 }, { week: 'Apr 6', rate: 71 }, { week: 'Apr 13', rate: 67 }, { week: 'Apr 20', rate: 70 },
      { week: 'Apr 27', rate: 68 }, { week: 'May 4', rate: 63 }, { week: 'May 11', rate: 61 }, { week: 'May 18', rate: 69 },
    ],
    aiSummary: 'H-8 Campus reports 9 at-risk cases with high attendance discipline in technical tracks.',
  },
  'campus-isb-g12': {
    campusName: 'G-12 Campus (Lahore Leads Univ)',
    cityName: 'Islamabad',
    registeredStudents: '290',
    studentsChange: '5.8%',
    activeBatches: '6',
    batchesChange: '3.2%',
    atRiskStudents: '8',
    riskChange: '1.9%',
    seatsRecovered: '11',
    recoveryChange: '5.8%',
    followups: [
      ['Waqar Younas', 'Attendance below 60%', 'High', 'Today'],
      ['Nabeel Akhtar', 'Document verification', 'Medium', 'Tomorrow'],
      ['Zubair Qazi', 'Shift change request', 'Low', 'May 28'],
    ],
    trainers: [
      ['MA', 'Muhammad Asim', '3 Batches', 60],
      ['RK', 'Rehan Khattak', '2 Batches', 42],
    ],
    fillRate: [
      { week: 'Mar 30', rate: 60 }, { week: 'Apr 6', rate: 68 }, { week: 'Apr 13', rate: 63 }, { week: 'Apr 20', rate: 67 },
      { week: 'Apr 27', rate: 65 }, { week: 'May 4', rate: 61 }, { week: 'May 11', rate: 59 }, { week: 'May 18', rate: 66 },
    ],
    aiSummary: 'G-12 Campus has 8 at-risk students. Overall batch fill rate is 66% with capacity for new enrollments.',
  },
  'campus-isb-kyani': {
    campusName: 'Kyani Road Campus (Bharakhu)',
    cityName: 'Islamabad',
    registeredStudents: '210',
    studentsChange: '4.9%',
    activeBatches: '5',
    batchesChange: '2.5%',
    atRiskStudents: '6',
    riskChange: '1.5%',
    seatsRecovered: '8',
    recoveryChange: '4.2%',
    followups: [
      ['Junaid Safdar', 'Attendance 55%', 'High', 'Today'],
      ['Adnan Khan', 'Transportation issue', 'Medium', 'Tomorrow'],
    ],
    trainers: [
      ['FK', 'Farhan Khan', '2 Batches', 50],
      ['TM', 'Tahir Mehmood', '2 Batches', 45],
    ],
    fillRate: [
      { week: 'Mar 30', rate: 55 }, { week: 'Apr 6', rate: 65 }, { week: 'Apr 13', rate: 61 }, { week: 'Apr 20', rate: 64 },
      { week: 'Apr 27', rate: 62 }, { week: 'May 4', rate: 58 }, { week: 'May 11', rate: 56 }, { week: 'May 18', rate: 63 },
    ],
    aiSummary: 'Kyani Road Campus has 6 students needing follow-up due to transportation difficulties.',
  },
  'campus-isb-cbr': {
    campusName: 'CBR Town Campus, Islamabad',
    cityName: 'Islamabad',
    registeredStudents: '195',
    studentsChange: '4.5%',
    activeBatches: '4',
    batchesChange: '2.1%',
    atRiskStudents: '5',
    riskChange: '1.2%',
    seatsRecovered: '7',
    recoveryChange: '3.9%',
    followups: [
      ['Mohsin Raza', 'Attendance 58%', 'High', 'Today'],
      ['Fahad Qureshi', 'Fee verification', 'Low', 'May 29'],
    ],
    trainers: [
      ['SZ', 'Syed Zohaib', '2 Batches', 48],
      ['HA', 'Haris Aziz', '2 Batches', 42],
    ],
    fillRate: [
      { week: 'Mar 30', rate: 58 }, { week: 'Apr 6', rate: 66 }, { week: 'Apr 13', rate: 62 }, { week: 'Apr 20', rate: 65 },
      { week: 'Apr 27', rate: 63 }, { week: 'May 4', rate: 60 }, { week: 'May 11', rate: 58 }, { week: 'May 18', rate: 64 },
    ],
    aiSummary: 'CBR Town Campus operations are steady across 4 active batches with 5 students under monitoring.',
  },
  'campus-isb-kahuta': {
    campusName: 'Kahuta Road Campus (Alkhidmat IT)',
    cityName: 'Islamabad',
    registeredStudents: '180',
    studentsChange: '4.2%',
    activeBatches: '4',
    batchesChange: '2.0%',
    atRiskStudents: '5',
    riskChange: '1.1%',
    seatsRecovered: '6',
    recoveryChange: '3.5%',
    followups: [
      ['Sarmad Ali', 'Attendance below 65%', 'High', 'Today'],
      ['Kamran Shah', 'Equipment access aid', 'Medium', 'Tomorrow'],
    ],
    trainers: [
      ['MA', 'Muhammad Asim', '2 Batches', 46],
      ['IM', 'Irfan Masood', '2 Batches', 40],
    ],
    fillRate: [
      { week: 'Mar 30', rate: 56 }, { week: 'Apr 6', rate: 64 }, { week: 'Apr 13', rate: 60 }, { week: 'Apr 20', rate: 63 },
      { week: 'Apr 27', rate: 61 }, { week: 'May 4', rate: 57 }, { week: 'May 11', rate: 55 }, { week: 'May 18', rate: 62 },
    ],
    aiSummary: 'Kahuta Road Campus has 180 learners in vocational IT tracks with 5 follow-up cases.',
  },
  'campus-isb-burma': {
    campusName: 'Burma Town Campus, Islamabad',
    cityName: 'Islamabad',
    registeredStudents: '165',
    studentsChange: '3.9%',
    activeBatches: '3',
    batchesChange: '1.8%',
    atRiskStudents: '4',
    riskChange: '0.9%',
    seatsRecovered: '5',
    recoveryChange: '3.1%',
    followups: [
      ['Noman Ijaz', 'Attendance 52%', 'High', 'Today'],
      ['Rizwan Tariq', 'Document submission', 'Low', 'May 30'],
    ],
    trainers: [
      ['FK', 'Farhan Khan', '2 Batches', 44],
      ['SM', 'Sajid Mehmood', '1 Batch', 35],
    ],
    fillRate: [
      { week: 'Mar 30', rate: 54 }, { week: 'Apr 6', rate: 62 }, { week: 'Apr 13', rate: 58 }, { week: 'Apr 20', rate: 61 },
      { week: 'Apr 27', rate: 59 }, { week: 'May 4', rate: 55 }, { week: 'May 11', rate: 54 }, { week: 'May 18', rate: 60 },
    ],
    aiSummary: 'Burma Town Campus shows 3 active batches with 4 students needing coordinator outreach.',
  },
  'campus-rwp-rcc': {
    campusName: 'Rawalpindi College of Commerce (Hub)',
    cityName: 'Rawalpindi',
    registeredStudents: '310',
    studentsChange: '5.9%',
    activeBatches: '6',
    batchesChange: '3.4%',
    atRiskStudents: '10',
    riskChange: '2.4%',
    seatsRecovered: '13',
    recoveryChange: '7.1%',
    followups: [
      ['Yasir Mehmood', 'Attendance below 60%', 'High', 'Today'],
      ['Shahzaib Khan', 'Quiz submission pending', 'Medium', 'Tomorrow'],
      ['Babar Azam', 'Shift change request', 'Low', 'May 28'],
    ],
    trainers: [
      ['AT', 'Akram Tahir', '3 Batches', 64],
      ['MR', 'Mudassar Rauf', '2 Batches', 46],
    ],
    fillRate: [
      { week: 'Mar 30', rate: 62 }, { week: 'Apr 6', rate: 70 }, { week: 'Apr 13', rate: 65 }, { week: 'Apr 20', rate: 68 },
      { week: 'Apr 27', rate: 66 }, { week: 'May 4', rate: 61 }, { week: 'May 11', rate: 59 }, { week: 'May 18', rate: 67 },
    ],
    aiSummary: 'Rawalpindi College of Commerce hub monitors 10 at-risk cases across 6 vocational batches.',
  },
  'campus-rwp-satellite': {
    campusName: 'Govt College Satellite Town, RWP',
    cityName: 'Rawalpindi',
    registeredStudents: '260',
    studentsChange: '5.2%',
    activeBatches: '5',
    batchesChange: '2.8%',
    atRiskStudents: '8',
    riskChange: '1.8%',
    seatsRecovered: '10',
    recoveryChange: '5.4%',
    followups: [
      ['Zeeshan Haider', 'Attendance 54%', 'High', 'Today'],
      ['Imran Abbasi', 'Fee confirmation', 'Medium', 'Tomorrow'],
    ],
    trainers: [
      ['AT', 'Akram Tahir', '2 Batches', 52],
      ['KH', 'Kashif Hussain', '2 Batches', 44],
    ],
    fillRate: [
      { week: 'Mar 30', rate: 60 }, { week: 'Apr 6', rate: 68 }, { week: 'Apr 13', rate: 64 }, { week: 'Apr 20', rate: 67 },
      { week: 'Apr 27', rate: 65 }, { week: 'May 4', rate: 60 }, { week: 'May 11', rate: 58 }, { week: 'May 18', rate: 65 },
    ],
    aiSummary: 'Satellite Town Rawalpindi has 8 at-risk students with active follow-ups scheduled.',
  },
  'all': {
    campusName: 'All Campuses (Network-wide)',
    cityName: 'Pakistan Network',
    registeredStudents: '6,478',
    studentsChange: '14.2%',
    activeBatches: '128',
    batchesChange: '9.8%',
    atRiskStudents: '182',
    riskChange: '7.1%',
    seatsRecovered: '269',
    recoveryChange: '18.4%',
    followups: [
      ['Ahmed Raza (Gulshan)', 'Consecutive Absence (3 classes)', 'High', 'Today'],
      ['Bilal Hussain (Lahore)', 'Consecutive Absence (4 classes)', 'High', 'Today'],
      ['Ayesha Siddiqui (Nazimabad)', 'Attendance 48% (Slip risk)', 'High', 'Today'],
      ['Usman Tariq (Islamabad I-8)', 'Attendance below 60%', 'High', 'Today'],
      ['Zainab Fatima (Gulshan)', 'Inactive (7+ days)', 'Medium', 'Tomorrow'],
      ['Yasir Mehmood (Rawalpindi)', 'Fee clearance pending', 'Low', 'May 28'],
    ],
    trainers: [
      ['AM', 'Ali Mehmood (Karachi)', '8 Batches', 85],
      ['SN', 'Sara Nawaz (Karachi)', '7 Batches (Imbalanced)', 82],
      ['ZU', 'Zubair Usman (Lahore)', '6 Batches', 76],
      ['MA', 'Muhammad Asim (Islamabad)', '5 Batches', 68],
      ['AT', 'Akram Tahir (Rawalpindi)', '4 Batches', 58],
    ],
    fillRate: [
      { week: 'Mar 30', rate: 63 }, { week: 'Apr 6', rate: 76 }, { week: 'Apr 13', rate: 68 }, { week: 'Apr 20', rate: 73 },
      { week: 'Apr 27', rate: 69 }, { week: 'May 4', rate: 63 }, { week: 'May 11', rate: 61 }, { week: 'May 18', rate: 70 },
    ],
    aiSummary: 'Network-wide: 6,478 learners enrolled across 14 campuses and 128 batches. 182 require coordinator follow-up.',
  },
};

const chartConfig = { rate: { label: 'Average fill rate', color: '#1268ea' } } satisfies ChartConfig;

export default function CoordinatorDashboard() {
  // Coordinator Ahmad Saeed is strictly bound to H-8 Campus, Islamabad under RBAC isolation
  const assignedCampus = 'campus-isb-h8';
  const [selectedCampus, setSelectedCampus] = useState<string>(assignedCampus);
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiResult, setAiResult] = useState<{ english: string; urdu?: string } | null>(null);

  useEffect(() => {
    // Strictly lock and persist H-8 Campus, Islamabad for Coordinator
    sessionStorage.setItem('bqone-demo-campus', assignedCampus);
    setSelectedCampus(assignedCampus);
  }, []);

  const currentData = campusData[assignedCampus];

  useEffect(() => {
    setAnswer(currentData.aiSummary);
  }, [currentData.aiSummary]);

  async function ask(text = prompt) {
    const value = text.trim();
    if (!value || loadingAi) return;
    setPrompt(value);
    setLoadingAi(true);

    try {
      const res = await fetch('/api/assistant/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-demo-role': 'Coordinator',
          'x-demo-campus': assignedCampus,
        },
        body: JSON.stringify({ question: value }),
      });
      const data = (await res.json()) as any;
      if (data.success && data.result) {
        const eng = data.result.answer;
        const urdu = data.result.answerUrdu;
        setAnswer(eng);
        setAiResult({ english: eng, urdu });
      } else {
        const fallbackAns = `Found ${currentData.atRiskStudents} at-risk students in ${currentData.campusName}. ${currentData.activeBatches} active batches are currently running.`;
        setAnswer(fallbackAns);
        setAiResult({ english: fallbackAns, urdu: `${currentData.campusName} mein ${currentData.atRiskStudents} talba ko foran follow-up ki zaroorat hai.` });
      }
    } catch {
      const fallbackAns = `For ${currentData.campusName}: ${currentData.atRiskStudents} students need attention, ${currentData.seatsRecovered} seats recovered to date.`;
      setAnswer(fallbackAns);
      setAiResult({ english: fallbackAns, urdu: `${currentData.campusName} ke liye ${currentData.atRiskStudents} talba monitoring mein hain.` });
    } finally {
      setLoadingAi(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="Coordinator Dashboard"
        description={`${currentData.campusName} — Operations overview & risk queue`}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/imports">
              <Button size="sm" className="bg-[#08aa87] hover:bg-[#078f72] text-white gap-1.5 shadow-sm">
                <Upload className="size-3.5" />
                Upload Excel Sheet
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mb-4 rounded-lg border border-emerald-200/80 bg-gradient-to-r from-emerald-50/80 via-white to-blue-50/60 p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#0a2540]">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#08aa87] text-white shadow-sm">
            <FileSpreadsheet className="size-5" />
          </div>
          <div>
            <div className="font-semibold text-[#16325d] text-sm">Upload Applicant Registration Spreadsheet</div>
            <p className="text-[11px] text-slate-500">
              Bulk intake new candidate applications via Excel (.xlsx, .xls) or CSV. Includes AI column mapping and duplicate detection.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/imports">
            <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs h-8 px-3 gap-1.5">
              <Upload className="size-3.5" />
              Upload Excel Sheet (.xlsx)
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_250px]">
        <div className="min-w-0">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Registered Students"
              value={currentData.registeredStudents}
              change={currentData.studentsChange}
              icon={UsersRound}
              tone="green"
            />
            <StatCard
              label="Active Batches"
              value={currentData.activeBatches}
              change={currentData.batchesChange}
              icon={Layers3}
              tone="blue"
            />
            <StatCard
              label="At-Risk Students"
              value={currentData.atRiskStudents}
              change={currentData.riskChange}
              icon={AlertTriangle}
              tone="amber"
            />
            <StatCard
              label="Seats Recovered"
              value={currentData.seatsRecovered}
              change={currentData.recoveryChange}
              icon={GraduationCap}
              tone="lime"
            />
          </div>

          <div className="mt-4">
            <Panel
              title={`Follow-up Queue (${currentData.campusName})`}
              action={
                <Link href="/follow-ups" className="text-[10px] font-semibold text-blue-600">
                  View All
                </Link>
              }
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4 text-[10px]">Student</TableHead>
                    <TableHead className="text-[10px]">Issue</TableHead>
                    <TableHead className="text-[10px]">Priority</TableHead>
                    <TableHead className="text-[10px]">Due</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.followups.map(([name, issue, priority, due]) => (
                    <TableRow key={name}>
                      <TableCell className="px-4 py-2.5 text-[10px] font-medium text-[#16325d]">
                        {name}
                      </TableCell>
                      <TableCell className="py-2.5 text-[9px] text-slate-500">
                        {issue}
                      </TableCell>
                      <TableCell className="py-2.5">
                        <Badge
                          variant="secondary"
                          className={
                            priority === 'High'
                              ? 'bg-red-50 text-red-600'
                              : priority === 'Medium'
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-emerald-50 text-emerald-600'
                          }
                        >
                          {priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2.5 text-[9px] text-slate-500">
                        {due}
                      </TableCell>
                      <TableCell>
                        <MoreVertical className="size-3.5 text-slate-400" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Panel>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <Panel title={`Batch Fill Rate Trend — ${currentData.cityName}`} action={<Button variant="outline" size="sm">Last 8 Weeks</Button>}>
              <ChartContainer config={chartConfig} className="h-[230px] w-full aspect-auto p-3">
                <LineChart accessibilityLayer data={currentData.fillRate} margin={{ top: 16, right: 14, left: -20, bottom: 5 }}>
                  <CartesianGrid vertical={false} strokeDasharray="4 4" />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={9} />
                  <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={9} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="rate" stroke="var(--color-rate)" strokeWidth={2.5} dot={{ r: 3, fill: 'white', strokeWidth: 2 }} />
                </LineChart>
              </ChartContainer>
            </Panel>
            <Panel title={`Trainer Workload — ${currentData.cityName}`} action={<Link href="/trainers" className="text-[10px] font-semibold text-blue-600">View All</Link>}>
              <div className="space-y-3 p-4">
                {currentData.trainers.map(([initials, name, batches, value], index) => (
                  <div key={String(name)} className="grid grid-cols-[32px_1fr_74px_34px] items-center gap-2 text-[10px]">
                    <span
                      className={`grid size-8 place-items-center rounded-full ${[
                          'bg-emerald-50 text-emerald-700',
                          'bg-blue-50 text-blue-700',
                          'bg-red-50 text-red-600',
                          'bg-lime-50 text-lime-700',
                          'bg-cyan-50 text-cyan-700',
                        ][index % 5]
                        }`}
                    >
                      {initials}
                    </span>
                    <span className="font-medium text-[#17345f]">{name}</span>
                    <Progress
                      value={Number(value)}
                      className="gap-0 [&_[data-slot=progress-indicator]]:bg-gradient-to-r [&_[data-slot=progress-indicator]]:from-emerald-500 [&_[data-slot=progress-indicator]]:to-blue-700"
                    />
                    <b className="text-[#17345f]">{value}%</b>
                    <span />
                    <span className="col-span-3 -mt-2 text-[8px] text-slate-400">{batches}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>

        <aside className="rounded-xl border border-slate-200 bg-white shadow-[0_4px_18px_rgb(15_23_42/3%)]">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0a1e4b]">
              <Bot className="size-5 text-emerald-600" />
              BanoQabil AI <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[8px] text-blue-600">BETA</span>
            </div>
          </div>
          <div className="p-4">
            <h2 className="text-sm font-bold text-[#0a1e4b]">Hello Ahmad! 👋</h2>
            <p className="mt-1 text-[10px] text-slate-500 leading-relaxed">{answer}</p>
            <div className="mt-4 space-y-3">
              {[
                [UsersRound, 'At-Risk Students', `${currentData.atRiskStudents} students need attention.`, '/follow-ups', 'View list'],
                [Layers3, 'Active Batches', `${currentData.activeBatches} active batches running in ${currentData.cityName}.`, '/seat-availability', 'View details'],
                [CalendarDays, 'Seats Recovered', `${currentData.seatsRecovered} seats recovered to date.`, '/seat-recovery', 'Open queue'],
              ].map(([Icon, title, text, href, label]) => {
                const CardIcon = Icon as typeof UsersRound;
                return (
                  <div key={String(title)} className="rounded-xl border border-slate-200 p-3">
                    <div className="flex gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                        <CardIcon className="size-4" />
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold text-[#17345f]">{String(title)}</p>
                        <p className="mt-1 text-[9px] leading-4 text-slate-500">{String(text)}</p>
                        <Link href={String(href)} className="mt-2 flex items-center gap-1 text-[9px] font-medium text-blue-600">
                          {String(label)} <ArrowRight className="size-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              ask();
            }}
            className="mt-auto border-t border-slate-100 p-4"
          >
            <div className="relative">
              <Input
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Ask anything about students, batches, or attendance…"
                className="h-14 pr-10 text-xs"
                disabled={loadingAi}
              />
              <button
                type="submit"
                disabled={loadingAi || !prompt.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0a1e4b] hover:text-emerald-700 disabled:opacity-40 transition-colors"
                aria-label="Send prompt"
              >
                <Send className="size-5" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['Show at-risk students', 'Top low fill-rate batches', 'Weekly admissions trend'].map((text) => (
                <button
                  type="button"
                  key={text}
                  onClick={() => ask(text)}
                  disabled={loadingAi}
                  className="rounded border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-[9px] font-medium text-slate-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition-colors disabled:opacity-50"
                >
                  {text}
                </button>
              ))}
            </div>

            {loadingAi && (
              <div className="mt-3.5 flex items-center gap-2 rounded-xl border border-emerald-300/80 bg-emerald-50/70 p-3 text-xs text-emerald-800 animate-pulse">
                <Bot className="size-4 animate-spin text-emerald-600 shrink-0" />
                <span>Querying {currentData.campusName} intelligence engine...</span>
              </div>
            )}

            {aiResult && !loadingAi && (
              <div className="mt-3.5 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/90 via-teal-50/60 to-blue-50/80 p-3.5 shadow-sm text-xs transition-all">
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2 mb-2">
                  <span className="flex items-center gap-1.5 font-bold text-[#0a1e4b]">
                    <Bot className="size-4 text-emerald-600" />
                    BanoQabil AI Response
                  </span>
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-300">
                    {currentData.cityName} Scoped
                  </span>
                </div>
                <p className="font-semibold text-slate-800 leading-relaxed text-[11px]">{aiResult.english}</p>
                {aiResult.urdu && (
                  <div className="mt-2 text-[10px] text-emerald-950 font-medium bg-white/80 p-2 rounded-lg border border-emerald-100/80 leading-relaxed">
                    <span className="font-bold text-emerald-800 block mb-0.5">Roman Urdu:</span>
                    {aiResult.urdu}
                  </div>
                )}
              </div>
            )}

            <p className="mt-4 flex items-center gap-1 text-[8px] text-slate-400">
              <CheckCircle2 className="size-3" />
              Real-time scoped data for {currentData.campusName}.
            </p>
          </form>
        </aside>
      </div>
    </AppShell>
  );
}
