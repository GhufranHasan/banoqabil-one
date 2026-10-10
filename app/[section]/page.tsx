'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Activity,
  ArrowRight,
  FilePlus2,
  Filter,
  GraduationCap,
  Layers3,
  MapPin,
  ShieldCheck,
  UserRoundCheck,
  UsersRound,
} from 'lucide-react';

import { AppShell, PageSearch, type AppRole } from '@/components/app-shell';
import { PageHeader, Panel, StatCard } from '@/components/dashboard-ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/toast';
import { downloadBanoQabilReport } from '@/lib/pdf-report';

export interface EntityRow {
  id: string;
  campusKey: string;
  campusName: string;
  cells: string[];
  details: Record<string, string>;
  status: string;
}

export interface SectionDefinition {
  title: string;
  description: string;
  item: string;
  columns: string[];
  defaultRows: EntityRow[];
  formFields: Array<{ label: string; type?: 'email' | 'number' | 'textarea'; options?: string[] }>;
}

const campusNames: Record<string, string> = {
  'campus-iqbal-lahore': 'Iqbal Campus, Lahore',
  'campus-gulshan': 'Gulshan Campus, Karachi',
  'campus-lahore-township': 'Lahore Township Campus',
  'campus-nazimabad-girls': 'Nazimabad Girls Campus, Karachi',
  'campus-isb-i8': 'I-8 Campus, Islamabad',
  'all': 'All Campuses (Network-wide)',
};

const courses = ['Cyber Security', 'Web Development', 'Graphic Design', 'Digital Marketing', 'UI/UX Design', 'AI & Python', 'Freelancing'];
const campusOptions = ['Iqbal Campus, Lahore', 'Gulshan Campus, Karachi', 'Lahore Township Campus', 'Nazimabad Girls Campus, Karachi', 'I-8 Campus, Islamabad'];

const sectionDefinitions: Record<string, SectionDefinition> = {
  students: {
    title: 'Students',
    description: 'Manage learner profiles, status, enrollment and attendance engagement within assigned campus.',
    item: 'student',
    columns: ['ID', 'Name', 'Program', 'Campus', 'Status', 'Action'],
    formFields: [
      { label: 'Full name' },
      { label: 'Email address', type: 'email' },
      { label: 'Phone number' },
      { label: 'Program', options: courses },
      { label: 'Campus', options: campusOptions },
    ],
    defaultRows: [
      // Iqbal Campus, Lahore (Assigned Coordinator Campus)
      { id: 'BQ-LHR-0101', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['BQ-LHR-0101', 'Muhammad Bilal', 'Cyber Security', 'Iqbal Campus, Lahore', 'Active'], status: 'Active', details: { 'Student ID': 'BQ-LHR-0101', 'Full Name': 'Muhammad Bilal', 'Program': 'Cyber Security', 'Campus': 'Iqbal Campus, Lahore', 'Assigned Batch': 'BQ-LHR-CS-01', 'Attendance Rate': '94%', 'CNIC': '35201-1234567-1', 'Status': 'Active' } },
      { id: 'BQ-LHR-0102', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['BQ-LHR-0102', 'Hamza Tariq', 'Web Development', 'Iqbal Campus, Lahore', 'Active'], status: 'Active', details: { 'Student ID': 'BQ-LHR-0102', 'Full Name': 'Hamza Tariq', 'Program': 'Web Development', 'Campus': 'Iqbal Campus, Lahore', 'Assigned Batch': 'BQ-LHR-WD-01', 'Attendance Rate': '91%', 'CNIC': '35202-9876543-3', 'Status': 'Active' } },
      { id: 'BQ-LHR-0103', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['BQ-LHR-0103', 'Usman Farooq', 'Graphic Design', 'Iqbal Campus, Lahore', 'Follow-up'], status: 'Follow-up', details: { 'Student ID': 'BQ-LHR-0103', 'Full Name': 'Usman Farooq', 'Program': 'Graphic Design', 'Campus': 'Iqbal Campus, Lahore', 'Assigned Batch': 'BQ-LHR-GD-01', 'Attendance Rate': '68% (At Risk)', 'CNIC': '35201-4455667-7', 'Status': 'Follow-up' } },
      { id: 'BQ-LHR-0104', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['BQ-LHR-0104', 'Maryam Bibi', 'Digital Marketing', 'Iqbal Campus, Lahore', 'Active'], status: 'Active', details: { 'Student ID': 'BQ-LHR-0104', 'Full Name': 'Maryam Bibi', 'Program': 'Digital Marketing', 'Campus': 'Iqbal Campus, Lahore', 'Assigned Batch': 'BQ-LHR-DM-01', 'Attendance Rate': '96%', 'CNIC': '35202-3344556-2', 'Status': 'Active' } },
      { id: 'BQ-LHR-0105', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['BQ-LHR-0105', 'Abdullah Khan', 'Cyber Security', 'Iqbal Campus, Lahore', 'Review'], status: 'Review', details: { 'Student ID': 'BQ-LHR-0105', 'Full Name': 'Abdullah Khan', 'Program': 'Cyber Security', 'Campus': 'Iqbal Campus, Lahore', 'Assigned Batch': 'BQ-LHR-CS-01', 'Attendance Rate': '74%', 'CNIC': '35201-7788990-5', 'Status': 'Review' } },
      { id: 'BQ-LHR-0106', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['BQ-LHR-0106', 'Fatima Noor', 'UI/UX Design', 'Iqbal Campus, Lahore', 'Active'], status: 'Active', details: { 'Student ID': 'BQ-LHR-0106', 'Full Name': 'Fatima Noor', 'Program': 'UI/UX Design', 'Campus': 'Iqbal Campus, Lahore', 'Assigned Batch': 'BQ-LHR-UI-01', 'Attendance Rate': '98%', 'CNIC': '35202-6677889-4', 'Status': 'Active' } },
      { id: 'BQ-LHR-0107', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['BQ-LHR-0107', 'Zeeshan Akram', 'Web Development', 'Iqbal Campus, Lahore', 'Active'], status: 'Active', details: { 'Student ID': 'BQ-LHR-0107', 'Full Name': 'Zeeshan Akram', 'Program': 'Web Development', 'Campus': 'Iqbal Campus, Lahore', 'Assigned Batch': 'BQ-LHR-WD-02', 'Attendance Rate': '88%', 'CNIC': '35201-8899001-9', 'Status': 'Active' } },
      { id: 'BQ-LHR-0108', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['BQ-LHR-0108', 'Sadia Rasheed', 'Freelancing', 'Iqbal Campus, Lahore', 'Completed'], status: 'Completed', details: { 'Student ID': 'BQ-LHR-0108', 'Full Name': 'Sadia Rasheed', 'Program': 'Freelancing', 'Campus': 'Iqbal Campus, Lahore', 'Assigned Batch': 'BQ-LHR-FL-01', 'Attendance Rate': '100%', 'CNIC': '35202-1122334-8', 'Status': 'Completed' } },

      // Gulshan Campus, Karachi
      { id: 'BQ-KHI-0201', campusKey: 'campus-gulshan', campusName: 'Gulshan Campus, Karachi', cells: ['BQ-KHI-0201', 'Hassan Ali', 'Web Development', 'Gulshan Campus, Karachi', 'Active'], status: 'Active', details: { 'Student ID': 'BQ-KHI-0201', 'Full Name': 'Hassan Ali', 'Program': 'Web Development', 'Campus': 'Gulshan Campus, Karachi', 'Assigned Batch': 'BQ-GUL-WD-01', 'Attendance Rate': '92%', 'CNIC': '42101-5544332-1', 'Status': 'Active' } },
      { id: 'BQ-KHI-0202', campusKey: 'campus-gulshan', campusName: 'Gulshan Campus, Karachi', cells: ['BQ-KHI-0202', 'Laiba Noor', 'Freelancing', 'Gulshan Campus, Karachi', 'Active'], status: 'Active', details: { 'Student ID': 'BQ-KHI-0202', 'Full Name': 'Laiba Noor', 'Program': 'Freelancing', 'Campus': 'Gulshan Campus, Karachi', 'Assigned Batch': 'BQ-GUL-FL-01', 'Attendance Rate': '89%', 'CNIC': '42101-9988776-6', 'Status': 'Active' } },
      { id: 'BQ-KHI-0203', campusKey: 'campus-gulshan', campusName: 'Gulshan Campus, Karachi', cells: ['BQ-KHI-0203', 'Ahmed Raza', 'Digital Marketing', 'Gulshan Campus, Karachi', 'Active'], status: 'Active', details: { 'Student ID': 'BQ-KHI-0203', 'Full Name': 'Ahmed Raza', 'Program': 'Digital Marketing', 'Campus': 'Gulshan Campus, Karachi', 'Assigned Batch': 'BQ-GUL-DM-01', 'Attendance Rate': '95%', 'CNIC': '42101-3322110-3', 'Status': 'Active' } },
      { id: 'BQ-KHI-0204', campusKey: 'campus-gulshan', campusName: 'Gulshan Campus, Karachi', cells: ['BQ-KHI-0204', 'Dua Fatima', 'UI/UX Design', 'Gulshan Campus, Karachi', 'Review'], status: 'Review', details: { 'Student ID': 'BQ-KHI-0204', 'Full Name': 'Dua Fatima', 'Program': 'UI/UX Design', 'Campus': 'Gulshan Campus, Karachi', 'Assigned Batch': 'BQ-GUL-UI-01', 'Attendance Rate': '72%', 'CNIC': '42101-7766554-2', 'Status': 'Review' } },
      { id: 'BQ-KHI-0205', campusKey: 'campus-gulshan', campusName: 'Gulshan Campus, Karachi', cells: ['BQ-KHI-0205', 'Bilal Siddiqui', 'Cyber Security', 'Gulshan Campus, Karachi', 'Follow-up'], status: 'Follow-up', details: { 'Student ID': 'BQ-KHI-0205', 'Full Name': 'Bilal Siddiqui', 'Program': 'Cyber Security', 'Campus': 'Gulshan Campus, Karachi', 'Assigned Batch': 'BQ-GUL-CS-01', 'Attendance Rate': '62% (At Risk)', 'CNIC': '42101-1122334-9', 'Status': 'Follow-up' } },

      // Lahore Township Campus
      { id: 'BQ-TWN-0301', campusKey: 'campus-lahore-township', campusName: 'Lahore Township Campus', cells: ['BQ-TWN-0301', 'Zainab Fatima', 'Digital Marketing', 'Lahore Township Campus', 'Active'], status: 'Active', details: { 'Student ID': 'BQ-TWN-0301', 'Full Name': 'Zainab Fatima', 'Program': 'Digital Marketing', 'Campus': 'Lahore Township Campus', 'Assigned Batch': 'BQ-TWN-DM-01', 'Attendance Rate': '93%', 'CNIC': '35202-6655443-1', 'Status': 'Active' } },
      { id: 'BQ-TWN-0302', campusKey: 'campus-lahore-township', campusName: 'Lahore Township Campus', cells: ['BQ-TWN-0302', 'Ali Shan', 'Web Development', 'Lahore Township Campus', 'Active'], status: 'Active', details: { 'Student ID': 'BQ-TWN-0302', 'Full Name': 'Ali Shan', 'Program': 'Web Development', 'Campus': 'Lahore Township Campus', 'Assigned Batch': 'BQ-TWN-WD-01', 'Attendance Rate': '90%', 'CNIC': '35201-9988112-4', 'Status': 'Active' } },
      { id: 'BQ-TWN-0303', campusKey: 'campus-lahore-township', campusName: 'Lahore Township Campus', cells: ['BQ-TWN-0303', 'Umair Javed', 'Graphic Design', 'Lahore Township Campus', 'Review'], status: 'Review', details: { 'Student ID': 'BQ-TWN-0303', 'Full Name': 'Umair Javed', 'Program': 'Graphic Design', 'Campus': 'Lahore Township Campus', 'Assigned Batch': 'BQ-TWN-GD-01', 'Attendance Rate': '71%', 'CNIC': '35201-3344998-5', 'Status': 'Review' } },

      // Nazimabad Girls Campus, Karachi
      { id: 'BQ-NZM-0401', campusKey: 'campus-nazimabad-girls', campusName: 'Nazimabad Girls Campus, Karachi', cells: ['BQ-NZM-0401', 'Ayesha Khan', 'Graphic Design', 'Nazimabad Girls Campus, Karachi', 'Active'], status: 'Active', details: { 'Student ID': 'BQ-NZM-0401', 'Full Name': 'Ayesha Khan', 'Program': 'Graphic Design', 'Campus': 'Nazimabad Girls Campus, Karachi', 'Assigned Batch': 'BQ-NZM-GD-01', 'Attendance Rate': '97%', 'CNIC': '42201-4455112-8', 'Status': 'Active' } },
      { id: 'BQ-NZM-0402', campusKey: 'campus-nazimabad-girls', campusName: 'Nazimabad Girls Campus, Karachi', cells: ['BQ-NZM-0402', 'Hira Batool', 'Web Development', 'Nazimabad Girls Campus, Karachi', 'Active'], status: 'Active', details: { 'Student ID': 'BQ-NZM-0402', 'Full Name': 'Hira Batool', 'Program': 'Web Development', 'Campus': 'Nazimabad Girls Campus, Karachi', 'Assigned Batch': 'BQ-NZM-WD-01', 'Attendance Rate': '91%', 'CNIC': '42201-8877665-2', 'Status': 'Active' } },

      // I-8 Campus, Islamabad
      { id: 'BQ-ISB-0501', campusKey: 'campus-isb-i8', campusName: 'I-8 Campus, Islamabad', cells: ['BQ-ISB-0501', 'Saad Qureshi', 'Web Development', 'I-8 Campus, Islamabad', 'Active'], status: 'Active', details: { 'Student ID': 'BQ-ISB-0501', 'Full Name': 'Saad Qureshi', 'Program': 'Web Development', 'Campus': 'I-8 Campus, Islamabad', 'Assigned Batch': 'BQ-ISB-WD-01', 'Attendance Rate': '95%', 'CNIC': '61101-1122998-3', 'Status': 'Active' } },
      { id: 'BQ-ISB-0502', campusKey: 'campus-isb-i8', campusName: 'I-8 Campus, Islamabad', cells: ['BQ-ISB-0502', 'Mahnoor Asif', 'Cyber Security', 'I-8 Campus, Islamabad', 'Active'], status: 'Active', details: { 'Student ID': 'BQ-ISB-0502', 'Full Name': 'Mahnoor Asif', 'Program': 'Cyber Security', 'Campus': 'I-8 Campus, Islamabad', 'Assigned Batch': 'BQ-ISB-CS-01', 'Attendance Rate': '93%', 'CNIC': '61101-7788443-6', 'Status': 'Active' } },
    ],
  },

  trainers: {
    title: 'Trainers',
    description: 'Review trainer allocation, weekly teaching hours, workload balance and availability.',
    item: 'trainer',
    columns: ['Trainer ID', 'Trainer Name', 'Specialization', 'Campus', 'Workload', 'Status', 'Action'],
    formFields: [
      { label: 'Full name' },
      { label: 'Email address', type: 'email' },
      { label: 'Specialization', options: courses },
      { label: 'Campus', options: campusOptions },
      { label: 'Weekly Capacity', options: ['10 hours', '20 hours', '30 hours', '40 hours'] },
    ],
    defaultRows: [
      // Iqbal Campus, Lahore
      { id: 'TR-LHR-01', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['TR-LHR-01', 'Engr. Tariq Mehmood', 'Cyber Security', 'Iqbal Campus, Lahore', '28 hrs/wk', 'Active'], status: 'Active', details: { 'Trainer ID': 'TR-LHR-01', 'Full Name': 'Engr. Tariq Mehmood', 'Specialization': 'Cyber Security & Network Defense', 'Campus': 'Iqbal Campus, Lahore', 'Weekly Workload': '28 hrs/wk (Active)', 'Batches Assigned': 'BQ-LHR-CS-01, BQ-LHR-CS-02', 'Status': 'Active' } },
      { id: 'TR-LHR-02', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['TR-LHR-02', 'M. Arsalan Sheikh', 'Web Development', 'Iqbal Campus, Lahore', '24 hrs/wk', 'Active'], status: 'Active', details: { 'Trainer ID': 'TR-LHR-02', 'Full Name': 'M. Arsalan Sheikh', 'Specialization': 'Full Stack Web (MERN / Next.js)', 'Campus': 'Iqbal Campus, Lahore', 'Weekly Workload': '24 hrs/wk (Optimal)', 'Batches Assigned': 'BQ-LHR-WD-01, BQ-LHR-WD-02', 'Status': 'Active' } },
      { id: 'TR-LHR-03', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['TR-LHR-03', 'Saima Afzal', 'Graphic Design & UI/UX', 'Iqbal Campus, Lahore', '20 hrs/wk', 'Active'], status: 'Active', details: { 'Trainer ID': 'TR-LHR-03', 'Full Name': 'Saima Afzal', 'Specialization': 'Graphic Design, Adobe Creative Suite & Figma', 'Campus': 'Iqbal Campus, Lahore', 'Weekly Workload': '20 hrs/wk', 'Batches Assigned': 'BQ-LHR-GD-01, BQ-LHR-UI-01', 'Status': 'Active' } },
      { id: 'TR-LHR-04', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['TR-LHR-04', 'Kashif Nawaz', 'Digital Marketing', 'Iqbal Campus, Lahore', '16 hrs/wk', 'Review'], status: 'Review', details: { 'Trainer ID': 'TR-LHR-04', 'Full Name': 'Kashif Nawaz', 'Specialization': 'Performance Marketing & SEO', 'Campus': 'Iqbal Campus, Lahore', 'Weekly Workload': '16 hrs/wk (Available for new batch)', 'Batches Assigned': 'BQ-LHR-DM-01', 'Status': 'Review' } },
      { id: 'TR-LHR-05', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['TR-LHR-05', 'Dr. Asadullah', 'AI & Python Foundations', 'Iqbal Campus, Lahore', '32 hrs/wk', 'High Workload'], status: 'High Workload', details: { 'Trainer ID': 'TR-LHR-05', 'Full Name': 'Dr. Asadullah', 'Specialization': 'Python, Machine Learning & Data Science', 'Campus': 'Iqbal Campus, Lahore', 'Weekly Workload': '32 hrs/wk (Near Max Cap)', 'Batches Assigned': 'BQ-LHR-AI-01, BQ-LHR-AI-02', 'Status': 'High Workload' } },

      // Gulshan Campus, Karachi
      { id: 'TR-KHI-01', campusKey: 'campus-gulshan', campusName: 'Gulshan Campus, Karachi', cells: ['TR-KHI-01', 'Sir Farhan Akhtar', 'Web Development (MERN)', 'Gulshan Campus, Karachi', '24 hrs/wk', 'Active'], status: 'Active', details: { 'Trainer ID': 'TR-KHI-01', 'Full Name': 'Sir Farhan Akhtar', 'Specialization': 'MERN Stack & Cloud Engineering', 'Campus': 'Gulshan Campus, Karachi', 'Weekly Workload': '24 hrs/wk', 'Batches Assigned': 'BQ-GUL-WD-01', 'Status': 'Active' } },
      { id: 'TR-KHI-02', campusKey: 'campus-gulshan', campusName: 'Gulshan Campus, Karachi', cells: ['TR-KHI-02', 'Syeda Amna', 'UI/UX & Product Design', 'Gulshan Campus, Karachi', '18 hrs/wk', 'Active'], status: 'Active', details: { 'Trainer ID': 'TR-KHI-02', 'Full Name': 'Syeda Amna', 'Specialization': 'Design Systems, User Research & Prototyping', 'Campus': 'Gulshan Campus, Karachi', 'Weekly Workload': '18 hrs/wk', 'Batches Assigned': 'BQ-GUL-UI-01', 'Status': 'Active' } },
      { id: 'TR-KHI-03', campusKey: 'campus-gulshan', campusName: 'Gulshan Campus, Karachi', cells: ['TR-KHI-03', 'Naveed Hashmi', 'Cyber Security Operations', 'Gulshan Campus, Karachi', '26 hrs/wk', 'Active'], status: 'Active', details: { 'Trainer ID': 'TR-KHI-03', 'Full Name': 'Naveed Hashmi', 'Specialization': 'SOC Analysis & Ethical Hacking', 'Campus': 'Gulshan Campus, Karachi', 'Weekly Workload': '26 hrs/wk', 'Batches Assigned': 'BQ-GUL-CS-01', 'Status': 'Active' } },

      // Lahore Township Campus
      { id: 'TR-TWN-01', campusKey: 'campus-lahore-township', campusName: 'Lahore Township Campus', cells: ['TR-TWN-01', 'Usman Ghani', 'Full Stack Web', 'Lahore Township Campus', '22 hrs/wk', 'Active'], status: 'Active', details: { 'Trainer ID': 'TR-TWN-01', 'Full Name': 'Usman Ghani', 'Specialization': 'Full Stack Web', 'Campus': 'Lahore Township Campus', 'Weekly Workload': '22 hrs/wk', 'Batches Assigned': 'BQ-TWN-WD-01', 'Status': 'Active' } },
      { id: 'TR-TWN-02', campusKey: 'campus-lahore-township', campusName: 'Lahore Township Campus', cells: ['TR-TWN-02', 'Bilal Qasim', 'Digital Marketing', 'Lahore Township Campus', '18 hrs/wk', 'Active'], status: 'Active', details: { 'Trainer ID': 'TR-TWN-02', 'Full Name': 'Bilal Qasim', 'Specialization': 'Social Media & Brand Growth', 'Campus': 'Lahore Township Campus', 'Weekly Workload': '18 hrs/wk', 'Batches Assigned': 'BQ-TWN-DM-01', 'Status': 'Active' } },

      // Nazimabad Girls Campus, Karachi
      { id: 'TR-NZM-01', campusKey: 'campus-nazimabad-girls', campusName: 'Nazimabad Girls Campus, Karachi', cells: ['TR-NZM-01', 'Ms. Rabia Zafar', 'Graphic Design & Multimedia', 'Nazimabad Girls Campus, Karachi', '20 hrs/wk', 'Active'], status: 'Active', details: { 'Trainer ID': 'TR-NZM-01', 'Full Name': 'Ms. Rabia Zafar', 'Specialization': 'Visual Communication & Motion Graphics', 'Campus': 'Nazimabad Girls Campus, Karachi', 'Weekly Workload': '20 hrs/wk', 'Batches Assigned': 'BQ-NZM-GD-01', 'Status': 'Active' } },
      { id: 'TR-NZM-02', campusKey: 'campus-nazimabad-girls', campusName: 'Nazimabad Girls Campus, Karachi', cells: ['TR-NZM-02', 'Sadia Jabeen', 'Frontend Development', 'Nazimabad Girls Campus, Karachi', '16 hrs/wk', 'Active'], status: 'Active', details: { 'Trainer ID': 'TR-NZM-02', 'Full Name': 'Sadia Jabeen', 'Specialization': 'React, HTML5 & Tailwind', 'Campus': 'Nazimabad Girls Campus, Karachi', 'Weekly Workload': '16 hrs/wk', 'Batches Assigned': 'BQ-NZM-WD-01', 'Status': 'Active' } },

      // I-8 Campus, Islamabad
      { id: 'TR-ISB-01', campusKey: 'campus-isb-i8', campusName: 'I-8 Campus, Islamabad', cells: ['TR-ISB-01', 'Dr. Junaid Babar', 'Cyber Security', 'I-8 Campus, Islamabad', '24 hrs/wk', 'Active'], status: 'Active', details: { 'Trainer ID': 'TR-ISB-01', 'Full Name': 'Dr. Junaid Babar', 'Specialization': 'Network Defense & Cryptography', 'Campus': 'I-8 Campus, Islamabad', 'Weekly Workload': '24 hrs/wk', 'Batches Assigned': 'BQ-ISB-CS-01', 'Status': 'Active' } },
      { id: 'TR-ISB-02', campusKey: 'campus-isb-i8', campusName: 'I-8 Campus, Islamabad', cells: ['TR-ISB-02', 'Rashid Minhas', 'Web Development', 'I-8 Campus, Islamabad', '20 hrs/wk', 'Active'], status: 'Active', details: { 'Trainer ID': 'TR-ISB-02', 'Full Name': 'Rashid Minhas', 'Specialization': 'JavaScript & Node.js Ecosystem', 'Campus': 'I-8 Campus, Islamabad', 'Weekly Workload': '20 hrs/wk', 'Batches Assigned': 'BQ-ISB-WD-01', 'Status': 'Active' } },
    ],
  },

  batches: {
    title: 'Batches',
    description: 'Monitor active batches, schedules, allocated rooms and fill rates.',
    item: 'batch',
    columns: ['Batch Code', 'Program', 'Trainer', 'Timings / Slot', 'Fill Rate', 'Status', 'Action'],
    formFields: [
      { label: 'Batch name' },
      { label: 'Program', options: courses },
      { label: 'Campus', options: campusOptions },
      { label: 'Timing', options: ['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM', '04:00 PM - 06:00 PM', '06:00 PM - 08:00 PM'] },
      { label: 'Capacity', type: 'number' },
    ],
    defaultRows: [
      // Iqbal Campus, Lahore
      { id: 'BQ-LHR-CS-01', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['BQ-LHR-CS-01', 'Cyber Security', 'Engr. Tariq Mehmood', 'Mon/Wed/Fri · 04:00 - 06:00 PM', '28/30 (93%)', 'Active'], status: 'Active', details: { 'Batch Code': 'BQ-LHR-CS-01', 'Program': 'Cyber Security', 'Trainer': 'Engr. Tariq Mehmood', 'Timing': 'Mon/Wed/Fri · 04:00 - 06:00 PM', 'Campus': 'Iqbal Campus, Lahore', 'Lab Allocated': 'Lab 1 (30 PCs)', 'Fill Rate': '28/30 (93%)', 'Status': 'Active' } },
      { id: 'BQ-LHR-WD-01', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['BQ-LHR-WD-01', 'Web Development', 'M. Arsalan Sheikh', 'Tue/Thu/Sat · 09:00 - 11:00 AM', '30/30 (100%)', 'Full'], status: 'Full', details: { 'Batch Code': 'BQ-LHR-WD-01', 'Program': 'Web Development', 'Trainer': 'M. Arsalan Sheikh', 'Timing': 'Tue/Thu/Sat · 09:00 - 11:00 AM', 'Campus': 'Iqbal Campus, Lahore', 'Lab Allocated': 'Lab 2 (30 PCs)', 'Fill Rate': '30/30 (100% - Fully Booked)', 'Status': 'Full' } },
      { id: 'BQ-LHR-WD-02', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['BQ-LHR-WD-02', 'Web Development', 'M. Arsalan Sheikh', 'Tue/Thu/Sat · 11:00 AM - 01:00 PM', '26/30 (87%)', 'Active'], status: 'Active', details: { 'Batch Code': 'BQ-LHR-WD-02', 'Program': 'Web Development', 'Trainer': 'M. Arsalan Sheikh', 'Timing': 'Tue/Thu/Sat · 11:00 AM - 01:00 PM', 'Campus': 'Iqbal Campus, Lahore', 'Lab Allocated': 'Lab 2 (30 PCs)', 'Fill Rate': '26/30 (87%)', 'Status': 'Active' } },
      { id: 'BQ-LHR-GD-01', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['BQ-LHR-GD-01', 'Graphic Design', 'Saima Afzal', 'Mon/Wed/Fri · 02:00 - 04:00 PM', '25/30 (83%)', 'Active'], status: 'Active', details: { 'Batch Code': 'BQ-LHR-GD-01', 'Program': 'Graphic Design', 'Trainer': 'Saima Afzal', 'Timing': 'Mon/Wed/Fri · 02:00 - 04:00 PM', 'Campus': 'Iqbal Campus, Lahore', 'Lab Allocated': 'Design Studio A', 'Fill Rate': '25/30 (83%)', 'Status': 'Active' } },
      { id: 'BQ-LHR-DM-01', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['BQ-LHR-DM-01', 'Digital Marketing', 'Kashif Nawaz', 'Weekend · 10:00 AM - 02:00 PM', '22/30 (73%)', 'Active'], status: 'Active', details: { 'Batch Code': 'BQ-LHR-DM-01', 'Program': 'Digital Marketing', 'Trainer': 'Kashif Nawaz', 'Timing': 'Weekend · 10:00 AM - 02:00 PM', 'Campus': 'Iqbal Campus, Lahore', 'Lab Allocated': 'Hall B', 'Fill Rate': '22/30 (73%)', 'Status': 'Active' } },
      { id: 'BQ-LHR-AI-01', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['BQ-LHR-AI-01', 'AI & Python', 'Dr. Asadullah', 'Mon/Wed/Fri · 06:00 - 08:00 PM', '29/30 (97%)', 'Active'], status: 'Active', details: { 'Batch Code': 'BQ-LHR-AI-01', 'Program': 'AI & Python Foundations', 'Trainer': 'Dr. Asadullah', 'Timing': 'Mon/Wed/Fri · 06:00 - 08:00 PM', 'Campus': 'Iqbal Campus, Lahore', 'Lab Allocated': 'AI Advanced Lab', 'Fill Rate': '29/30 (97%)', 'Status': 'Active' } },

      // Gulshan Campus, Karachi
      { id: 'BQ-GUL-WD-01', campusKey: 'campus-gulshan', campusName: 'Gulshan Campus, Karachi', cells: ['BQ-GUL-WD-01', 'Web Development', 'Sir Farhan Akhtar', 'Mon/Wed/Fri · 09:00 - 11:00 AM', '30/30 (100%)', 'Full'], status: 'Full', details: { 'Batch Code': 'BQ-GUL-WD-01', 'Program': 'Web Development', 'Trainer': 'Sir Farhan Akhtar', 'Timing': 'Mon/Wed/Fri · 09:00 - 11:00 AM', 'Campus': 'Gulshan Campus, Karachi', 'Fill Rate': '30/30 (100%)', 'Status': 'Full' } },
      { id: 'BQ-GUL-UI-01', campusKey: 'campus-gulshan', campusName: 'Gulshan Campus, Karachi', cells: ['BQ-GUL-UI-01', 'UI/UX Design', 'Syeda Amna', 'Tue/Thu/Sat · 02:00 - 04:00 PM', '27/30 (90%)', 'Active'], status: 'Active', details: { 'Batch Code': 'BQ-GUL-UI-01', 'Program': 'UI/UX Design', 'Trainer': 'Syeda Amna', 'Timing': 'Tue/Thu/Sat · 02:00 - 04:00 PM', 'Campus': 'Gulshan Campus, Karachi', 'Fill Rate': '27/30 (90%)', 'Status': 'Active' } },
      { id: 'BQ-GUL-CS-01', campusKey: 'campus-gulshan', campusName: 'Gulshan Campus, Karachi', cells: ['BQ-GUL-CS-01', 'Cyber Security', 'Naveed Hashmi', 'Mon/Wed/Fri · 04:00 - 06:00 PM', '25/30 (83%)', 'Active'], status: 'Active', details: { 'Batch Code': 'BQ-GUL-CS-01', 'Program': 'Cyber Security', 'Trainer': 'Naveed Hashmi', 'Timing': 'Mon/Wed/Fri · 04:00 - 06:00 PM', 'Campus': 'Gulshan Campus, Karachi', 'Fill Rate': '25/30 (83%)', 'Status': 'Active' } },

      // Lahore Township Campus
      { id: 'BQ-TWN-WD-01', campusKey: 'campus-lahore-township', campusName: 'Lahore Township Campus', cells: ['BQ-TWN-WD-01', 'Full Stack Web', 'Usman Ghani', 'Tue/Thu/Sat · 11:00 AM - 01:00 PM', '29/30 (97%)', 'Active'], status: 'Active', details: { 'Batch Code': 'BQ-TWN-WD-01', 'Program': 'Full Stack Web', 'Trainer': 'Usman Ghani', 'Timing': 'Tue/Thu/Sat · 11:00 AM - 01:00 PM', 'Campus': 'Lahore Township Campus', 'Fill Rate': '29/30 (97%)', 'Status': 'Active' } },
      { id: 'BQ-TWN-DM-01', campusKey: 'campus-lahore-township', campusName: 'Lahore Township Campus', cells: ['BQ-TWN-DM-01', 'Digital Marketing', 'Bilal Qasim', 'Mon/Wed/Fri · 04:00 - 06:00 PM', '24/30 (80%)', 'Active'], status: 'Active', details: { 'Batch Code': 'BQ-TWN-DM-01', 'Program': 'Digital Marketing', 'Trainer': 'Bilal Qasim', 'Timing': 'Mon/Wed/Fri · 04:00 - 06:00 PM', 'Campus': 'Lahore Township Campus', 'Fill Rate': '24/30 (80%)', 'Status': 'Active' } },

      // Nazimabad Girls Campus, Karachi
      { id: 'BQ-NZM-GD-01', campusKey: 'campus-nazimabad-girls', campusName: 'Nazimabad Girls Campus, Karachi', cells: ['BQ-NZM-GD-01', 'Graphic Design', 'Ms. Rabia Zafar', 'Mon/Wed/Fri · 10:00 AM - 12:00 PM', '30/30 (100%)', 'Full'], status: 'Full', details: { 'Batch Code': 'BQ-NZM-GD-01', 'Program': 'Graphic Design', 'Trainer': 'Ms. Rabia Zafar', 'Timing': 'Mon/Wed/Fri · 10:00 AM - 12:00 PM', 'Campus': 'Nazimabad Girls Campus, Karachi', 'Fill Rate': '30/30 (100%)', 'Status': 'Full' } },
      { id: 'BQ-NZM-WD-01', campusKey: 'campus-nazimabad-girls', campusName: 'Nazimabad Girls Campus, Karachi', cells: ['BQ-NZM-WD-01', 'Frontend Development', 'Sadia Jabeen', 'Tue/Thu/Sat · 02:00 - 04:00 PM', '28/30 (93%)', 'Active'], status: 'Active', details: { 'Batch Code': 'BQ-NZM-WD-01', 'Program': 'Frontend Development', 'Trainer': 'Sadia Jabeen', 'Timing': 'Tue/Thu/Sat · 02:00 - 04:00 PM', 'Campus': 'Nazimabad Girls Campus, Karachi', 'Fill Rate': '28/30 (93%)', 'Status': 'Active' } },

      // I-8 Campus, Islamabad
      { id: 'BQ-ISB-CS-01', campusKey: 'campus-isb-i8', campusName: 'I-8 Campus, Islamabad', cells: ['BQ-ISB-CS-01', 'Cyber Security', 'Dr. Junaid Babar', 'Tue/Thu/Sat · 04:00 - 06:00 PM', '26/30 (87%)', 'Active'], status: 'Active', details: { 'Batch Code': 'BQ-ISB-CS-01', 'Program': 'Cyber Security', 'Trainer': 'Dr. Junaid Babar', 'Timing': 'Tue/Thu/Sat · 04:00 - 06:00 PM', 'Campus': 'I-8 Campus, Islamabad', 'Fill Rate': '26/30 (87%)', 'Status': 'Active' } },
      { id: 'BQ-ISB-WD-01', campusKey: 'campus-isb-i8', campusName: 'I-8 Campus, Islamabad', cells: ['BQ-ISB-WD-01', 'Web Development', 'Rashid Minhas', 'Mon/Wed/Fri · 11:00 AM - 01:00 PM', '28/30 (93%)', 'Active'], status: 'Active', details: { 'Batch Code': 'BQ-ISB-WD-01', 'Program': 'Web Development', 'Trainer': 'Rashid Minhas', 'Timing': 'Mon/Wed/Fri · 11:00 AM - 01:00 PM', 'Campus': 'I-8 Campus, Islamabad', 'Fill Rate': '28/30 (93%)', 'Status': 'Active' } },
    ],
  },

  admissions: {
    title: 'Admissions',
    description: 'Track candidate applications, screening aptitude test scores, and intake allocations.',
    item: 'application',
    columns: ['App ID', 'Applicant Name', 'Program Applied', 'Campus', 'Aptitude Score', 'Status', 'Action'],
    formFields: [
      { label: 'Applicant name' },
      { label: 'Email address', type: 'email' },
      { label: 'Phone number' },
      { label: 'Preferred Course', options: courses },
      { label: 'Preferred Campus', options: campusOptions },
    ],
    defaultRows: [
      // Iqbal Campus, Lahore
      { id: 'ADM-LHR-801', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['ADM-LHR-801', 'Shahzaib Khan', 'Cyber Security', 'Iqbal Campus, Lahore', '92%', 'Accepted'], status: 'Accepted', details: { 'Application ID': 'ADM-LHR-801', 'Applicant Name': 'Shahzaib Khan', 'Program Applied': 'Cyber Security', 'Campus': 'Iqbal Campus, Lahore', 'Aptitude Score': '92% (Top Decile)', 'Seat Allocated': 'BQ-LHR-CS-01', 'Status': 'Accepted' } },
      { id: 'ADM-LHR-802', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['ADM-LHR-802', 'Zubair Ahmed', 'Web Development', 'Iqbal Campus, Lahore', '88%', 'Interview Due'], status: 'Interview Due', details: { 'Application ID': 'ADM-LHR-802', 'Applicant Name': 'Zubair Ahmed', 'Program Applied': 'Web Development', 'Campus': 'Iqbal Campus, Lahore', 'Aptitude Score': '88%', 'Document Status': 'CNIC Verified', 'Status': 'Interview Due' } },
      { id: 'ADM-LHR-803', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['ADM-LHR-803', 'Areeba Tariq', 'UI/UX Design', 'Iqbal Campus, Lahore', '85%', 'Accepted'], status: 'Accepted', details: { 'Application ID': 'ADM-LHR-803', 'Applicant Name': 'Areeba Tariq', 'Program Applied': 'UI/UX Design', 'Campus': 'Iqbal Campus, Lahore', 'Aptitude Score': '85%', 'Seat Allocated': 'BQ-LHR-UI-01', 'Status': 'Accepted' } },
      { id: 'ADM-LHR-804', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['ADM-LHR-804', 'Danish Ali', 'Digital Marketing', 'Iqbal Campus, Lahore', '76%', 'Waitlist'], status: 'Waitlist', details: { 'Application ID': 'ADM-LHR-804', 'Applicant Name': 'Danish Ali', 'Program Applied': 'Digital Marketing', 'Campus': 'Iqbal Campus, Lahore', 'Aptitude Score': '76%', 'Waitlist Rank': '#4 for Morning Slot', 'Status': 'Waitlist' } },
      { id: 'ADM-LHR-805', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['ADM-LHR-805', 'Noman Bashir', 'Freelancing', 'Iqbal Campus, Lahore', '81%', 'Accepted'], status: 'Accepted', details: { 'Application ID': 'ADM-LHR-805', 'Applicant Name': 'Noman Bashir', 'Program Applied': 'Freelancing', 'Campus': 'Iqbal Campus, Lahore', 'Aptitude Score': '81%', 'Seat Allocated': 'BQ-LHR-FL-01', 'Status': 'Accepted' } },

      // Gulshan Campus, Karachi
      { id: 'ADM-GUL-901', campusKey: 'campus-gulshan', campusName: 'Gulshan Campus, Karachi', cells: ['ADM-GUL-901', 'Mohsin Raza', 'Web Development', 'Gulshan Campus, Karachi', '94%', 'Accepted'], status: 'Accepted', details: { 'Application ID': 'ADM-GUL-901', 'Applicant Name': 'Mohsin Raza', 'Program Applied': 'Web Development', 'Campus': 'Gulshan Campus, Karachi', 'Aptitude Score': '94%', 'Seat Allocated': 'BQ-GUL-WD-01', 'Status': 'Accepted' } },
      { id: 'ADM-GUL-902', campusKey: 'campus-gulshan', campusName: 'Gulshan Campus, Karachi', cells: ['ADM-GUL-902', 'Sarah Farooq', 'UI/UX Design', 'Gulshan Campus, Karachi', '89%', 'Accepted'], status: 'Accepted', details: { 'Application ID': 'ADM-GUL-902', 'Applicant Name': 'Sarah Farooq', 'Program Applied': 'UI/UX Design', 'Campus': 'Gulshan Campus, Karachi', 'Aptitude Score': '89%', 'Seat Allocated': 'BQ-GUL-UI-01', 'Status': 'Accepted' } },

      // Lahore Township Campus
      { id: 'ADM-TWN-701', campusKey: 'campus-lahore-township', campusName: 'Lahore Township Campus', cells: ['ADM-TWN-701', 'Adeel Butt', 'Web Development', 'Lahore Township Campus', '87%', 'Accepted'], status: 'Accepted', details: { 'Application ID': 'ADM-TWN-701', 'Applicant Name': 'Adeel Butt', 'Program Applied': 'Web Development', 'Campus': 'Lahore Township Campus', 'Aptitude Score': '87%', 'Seat Allocated': 'BQ-TWN-WD-01', 'Status': 'Accepted' } },

      // Nazimabad Girls Campus, Karachi
      { id: 'ADM-NZM-601', campusKey: 'campus-nazimabad-girls', campusName: 'Nazimabad Girls Campus, Karachi', cells: ['ADM-NZM-601', 'Huma Naz', 'Graphic Design', 'Nazimabad Girls Campus, Karachi', '91%', 'Accepted'], status: 'Accepted', details: { 'Application ID': 'ADM-NZM-601', 'Applicant Name': 'Huma Naz', 'Program Applied': 'Graphic Design', 'Campus': 'Nazimabad Girls Campus, Karachi', 'Aptitude Score': '91%', 'Seat Allocated': 'BQ-NZM-GD-01', 'Status': 'Accepted' } },

      // I-8 Campus, Islamabad
      { id: 'ADM-ISB-501', campusKey: 'campus-isb-i8', campusName: 'I-8 Campus, Islamabad', cells: ['ADM-ISB-501', 'Hamid Ali', 'Cyber Security', 'I-8 Campus, Islamabad', '95%', 'Accepted'], status: 'Accepted', details: { 'Application ID': 'ADM-ISB-501', 'Applicant Name': 'Hamid Ali', 'Program Applied': 'Cyber Security', 'Campus': 'I-8 Campus, Islamabad', 'Aptitude Score': '95%', 'Seat Allocated': 'BQ-ISB-CS-01', 'Status': 'Accepted' } },
    ],
  },

  'follow-ups': {
    title: 'Follow-up Worklist',
    description: 'Prioritize and resolve learner retention issues, attendance alerts and case reviews.',
    item: 'case',
    columns: ['Case ID', 'Student Name', 'Batch', 'Trigger / Issue', 'Priority', 'Status', 'Action'],
    formFields: [
      { label: 'Student name' },
      { label: 'Batch code' },
      { label: 'Trigger / Issue', options: ['3 Consecutive Absences', 'Lab Assessment Incomplete', 'Fee Verification Pending', 'Schedule Conflict'] },
      { label: 'Priority', options: ['High', 'Medium', 'Low'] },
    ],
    defaultRows: [
      // Iqbal Campus, Lahore
      { id: 'FLW-LHR-101', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['FLW-LHR-101', 'Usman Farooq', 'BQ-LHR-GD-01', '3 Consecutive Absences', 'High', 'Follow-up'], status: 'Follow-up', details: { 'Case ID': 'FLW-LHR-101', 'Student Name': 'Usman Farooq', 'Batch': 'BQ-LHR-GD-01', 'Campus': 'Iqbal Campus, Lahore', 'Trigger': '3 Consecutive Absences', 'Guardian Contact': '0301-4455667', 'Resolution Status': 'Call coordinator scheduled', 'Status': 'Follow-up' } },
      { id: 'FLW-LHR-102', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['FLW-LHR-102', 'Abdullah Khan', 'BQ-LHR-CS-01', 'Lab Assessment Incomplete', 'Medium', 'Review'], status: 'Review', details: { 'Case ID': 'FLW-LHR-102', 'Student Name': 'Abdullah Khan', 'Batch': 'BQ-LHR-CS-01', 'Campus': 'Iqbal Campus, Lahore', 'Trigger': 'Lab Assessment Incomplete', 'Guardian Contact': '0302-7788990', 'Resolution Status': 'Trainer tutorial allocated', 'Status': 'Review' } },
      { id: 'FLW-LHR-103', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['FLW-LHR-103', 'Zeeshan Akram', 'BQ-LHR-WD-02', 'Fee Verification Pending', 'Low', 'Pending'], status: 'Pending', details: { 'Case ID': 'FLW-LHR-103', 'Student Name': 'Zeeshan Akram', 'Batch': 'BQ-LHR-WD-02', 'Campus': 'Iqbal Campus, Lahore', 'Trigger': 'Fee Verification Pending', 'Guardian Contact': '0303-8899001', 'Resolution Status': 'Easypaisa TID verification pending', 'Status': 'Pending' } },

      // Gulshan Campus, Karachi
      { id: 'FLW-GUL-201', campusKey: 'campus-gulshan', campusName: 'Gulshan Campus, Karachi', cells: ['FLW-GUL-201', 'Bilal Siddiqui', 'BQ-GUL-CS-01', 'Low Attendance (62%)', 'High', 'Follow-up'], status: 'Follow-up', details: { 'Case ID': 'FLW-GUL-201', 'Student Name': 'Bilal Siddiqui', 'Batch': 'BQ-GUL-CS-01', 'Campus': 'Gulshan Campus, Karachi', 'Trigger': 'Low Attendance (62%)', 'Guardian Contact': '0300-1122334', 'Status': 'Follow-up' } },

      // Lahore Township Campus
      { id: 'FLW-TWN-301', campusKey: 'campus-lahore-township', campusName: 'Lahore Township Campus', cells: ['FLW-TWN-301', 'Umair Javed', 'BQ-TWN-WD-01', 'Shift Transfer Request', 'Medium', 'Review'], status: 'Review', details: { 'Case ID': 'FLW-TWN-301', 'Student Name': 'Umair Javed', 'Batch': 'BQ-TWN-WD-01', 'Campus': 'Lahore Township Campus', 'Trigger': 'Shift Transfer Request', 'Guardian Contact': '0301-3344998', 'Status': 'Review' } },
    ],
  },

  reports: {
    title: 'Reports',
    description: 'Explore campus operational, attendance, trainer workload and admission reports.',
    item: 'report',
    columns: ['Report ID', 'Report Name', 'Period', 'Campus', 'Status', 'Action'],
    formFields: [
      { label: 'Report title' },
      { label: 'Report type', options: ['Campus Performance', 'Admissions Summary', 'Attendance & Risk', 'Seat Utilization', 'Security Fee & Refund'] },
      { label: 'Reporting period', options: ['Current week', 'Current month', 'Current quarter', 'Current intake'] },
      { label: 'Scope', options: ['Campus', 'Region', 'Network'] },
      { label: 'Campus or Region', options: ['Iqbal Campus, Lahore', 'Lahore Region', 'Karachi Region', 'All Network'] },
    ],
    defaultRows: [
      // Iqbal Campus, Lahore
      { id: 'REP-LHR-01', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['REP-LHR-01', 'Monthly Attendance & Retention Audit', 'May 2026', 'Iqbal Campus, Lahore', 'Ready'], status: 'Ready', details: { 'Report ID': 'REP-LHR-01', 'Report Name': 'Monthly Attendance & Retention Audit', 'Period': 'May 2026', 'Campus': 'Iqbal Campus, Lahore', 'Prepared For': 'Campus Operations & Central Audit', 'File Format': 'PDF Report / Excel Dataset', 'Status': 'Ready' } },
      { id: 'REP-LHR-02', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['REP-LHR-02', 'Lab & Classroom Utilization Summary', 'Weekly', 'Iqbal Campus, Lahore', 'Ready'], status: 'Ready', details: { 'Report ID': 'REP-LHR-02', 'Report Name': 'Lab & Classroom Utilization Summary', 'Period': 'Weekly', 'Campus': 'Iqbal Campus, Lahore', 'Prepared For': 'Coordinator Workload Review', 'File Format': 'PDF Report', 'Status': 'Ready' } },
      { id: 'REP-LHR-03', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['REP-LHR-03', 'Trainer Workload & Syllabus Completion', 'Bi-weekly', 'Iqbal Campus, Lahore', 'Ready'], status: 'Ready', details: { 'Report ID': 'REP-LHR-03', 'Report Name': 'Trainer Workload & Syllabus Completion', 'Period': 'Bi-weekly', 'Campus': 'Iqbal Campus, Lahore', 'Prepared For': 'Academic Coordination', 'File Format': 'PDF Report', 'Status': 'Ready' } },
      { id: 'REP-LHR-04', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['REP-LHR-04', 'Intake Admissions & Seat Fill Performance', 'Intake 5.0', 'Iqbal Campus, Lahore', 'Ready'], status: 'Ready', details: { 'Report ID': 'REP-LHR-04', 'Report Name': 'Intake Admissions & Seat Fill Performance', 'Period': 'Intake 5.0', 'Campus': 'Iqbal Campus, Lahore', 'Prepared For': 'National Admissions Board', 'File Format': 'PDF Report', 'Status': 'Ready' } },

      // Gulshan Campus, Karachi
      { id: 'REP-GUL-01', campusKey: 'campus-gulshan', campusName: 'Gulshan Campus, Karachi', cells: ['REP-GUL-01', 'Karachi South Regional Utilization', 'May 2026', 'Gulshan Campus, Karachi', 'Ready'], status: 'Ready', details: { 'Report ID': 'REP-GUL-01', 'Report Name': 'Karachi South Regional Utilization', 'Period': 'May 2026', 'Campus': 'Gulshan Campus, Karachi', 'Prepared For': 'Regional Directorate', 'File Format': 'PDF Report', 'Status': 'Ready' } },
    ],
  },

  communications: {
    title: 'Communications',
    description: 'Manage campus learner announcements, SMS notices and scheduled outreach.',
    item: 'notice',
    columns: ['Notice ID', 'Subject', 'Target Audience', 'Channel', 'Campus', 'Status', 'Action'],
    formFields: [
      { label: 'Message title' },
      { label: 'Audience', options: ['Students', 'Teachers', 'All Campus Staff'] },
      { label: 'Delivery channel', options: ['In-app', 'Email', 'SMS'] },
      { label: 'Message', type: 'textarea' },
    ],
    defaultRows: [
      // Iqbal Campus, Lahore
      { id: 'COM-LHR-91', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['COM-LHR-91', 'Mid-Term Project Submission Guidelines', 'All Students', 'In-App + SMS', 'Iqbal Campus, Lahore', 'Delivered'], status: 'Delivered', details: { 'Notice ID': 'COM-LHR-91', 'Subject': 'Mid-Term Project Submission Guidelines', 'Target Audience': 'All Active Students', 'Channel': 'In-App + SMS Alert', 'Campus': 'Iqbal Campus, Lahore', 'Sent Timestamp': 'May 20, 2026 - 10:30 AM', 'Delivery Rate': '99.4% Delivered', 'Status': 'Delivered' } },
      { id: 'COM-LHR-92', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['COM-LHR-92', 'Faculty Coordination Meeting (Lab 2)', 'Trainers & TAs', 'Email', 'Iqbal Campus, Lahore', 'Delivered'], status: 'Delivered', details: { 'Notice ID': 'COM-LHR-92', 'Subject': 'Faculty Coordination Meeting (Lab 2)', 'Target Audience': 'Trainers & Teaching Assistants', 'Channel': 'Email Broadcast', 'Campus': 'Iqbal Campus, Lahore', 'Sent Timestamp': 'May 18, 2026 - 03:00 PM', 'Delivery Rate': '100% Delivered', 'Status': 'Delivered' } },
      { id: 'COM-LHR-93', campusKey: 'campus-iqbal-lahore', campusName: 'Iqbal Campus, Lahore', cells: ['COM-LHR-93', 'Guest Speaker Session: AI in Industry', 'Cyber & Web Batches', 'In-App', 'Iqbal Campus, Lahore', 'Scheduled'], status: 'Scheduled', details: { 'Notice ID': 'COM-LHR-93', 'Subject': 'Guest Speaker Session: AI in Industry', 'Target Audience': 'Cyber Security & Web Batches', 'Channel': 'In-App Event Invite', 'Campus': 'Iqbal Campus, Lahore', 'Scheduled Time': 'May 25, 2026 - 04:00 PM', 'Status': 'Scheduled' } },

      // Gulshan Campus, Karachi
      { id: 'COM-GUL-81', campusKey: 'campus-gulshan', campusName: 'Gulshan Campus, Karachi', cells: ['COM-GUL-81', 'Power Backup Maintenance Notice', 'All Staff', 'Email', 'Gulshan Campus, Karachi', 'Delivered'], status: 'Delivered', details: { 'Notice ID': 'COM-GUL-81', 'Subject': 'Power Backup Maintenance Notice', 'Target Audience': 'All Campus Staff', 'Channel': 'Email', 'Campus': 'Gulshan Campus, Karachi', 'Status': 'Delivered' } },
    ],
  },
};

function statusBadgeClass(cell: string) {
  const text = cell.toLowerCase();
  if (text.includes('active') || text.includes('accepted') || text.includes('ready') || text.includes('delivered') || text.includes('completed')) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
  if (text.includes('follow') || text.includes('high') || text.includes('full')) {
    return 'bg-rose-50 text-rose-700 border-rose-200';
  }
  if (text.includes('review') || text.includes('waitlist') || text.includes('pending') || text.includes('interview')) {
    return 'bg-amber-50 text-amber-700 border-amber-200';
  }
  return 'bg-blue-50 text-blue-700 border-blue-200';
}

export default function GenericSectionPage() {
  const params = useParams<{ section: string }>();
  const section = params.section ?? 'students';
  const def = sectionDefinitions[section] ?? sectionDefinitions.students;

  const [activeCampus, setActiveCampus] = useState<string>('campus-iqbal-lahore');
  const [currentRole, setCurrentRole] = useState<AppRole | null>(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [detailRow, setDetailRow] = useState<EntityRow | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [customRows, setCustomRows] = useState<Record<string, EntityRow[]>>({});

  useEffect(() => {
    const storedRole = (sessionStorage.getItem('bqone-demo-role') as AppRole | null) ?? 'Coordinator';
    setCurrentRole(storedRole);

    const storedCampus = sessionStorage.getItem('bqone-demo-campus');
    if (storedCampus) {
      setActiveCampus(storedCampus);
    } else {
      setActiveCampus(storedRole === 'Coordinator' || storedRole === 'Teacher' ? 'campus-iqbal-lahore' : 'all');
    }

    const handleCampusChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveCampus(customEvent.detail);
      }
    };
    window.addEventListener('bqone-campus-change', handleCampusChange);
    return () => window.removeEventListener('bqone-campus-change', handleCampusChange);
  }, []);

  const allRows = useMemo(() => {
    const additions = customRows[section] ?? [];
    return [...def.defaultRows, ...additions];
  }, [def.defaultRows, customRows, section]);

  const campusFilteredRows = useMemo(() => {
    if (activeCampus === 'all') return allRows;
    return allRows.filter((r) => r.campusKey === activeCampus);
  }, [allRows, activeCampus]);

  const displayedRows = useMemo(() => {
    if (!search.trim()) return campusFilteredRows;
    const q = search.toLowerCase();
    return campusFilteredRows.filter((row) =>
      row.cells.some((cell) => cell.toLowerCase().includes(q))
    );
  }, [campusFilteredRows, search]);

  const stats = useMemo(() => {
    const total = campusFilteredRows.length;
    const active = campusFilteredRows.filter((r) => {
      const s = r.status.toLowerCase();
      return s.includes('active') || s.includes('accepted') || s.includes('ready') || s.includes('delivered');
    }).length;
    const review = campusFilteredRows.filter((r) => {
      const s = r.status.toLowerCase();
      return s.includes('review') || s.includes('follow') || s.includes('waitlist') || s.includes('pending') || s.includes('interview');
    }).length;
    const completedOrFull = campusFilteredRows.filter((r) => {
      const s = r.status.toLowerCase();
      return s.includes('complete') || s.includes('full') || s.includes('scheduled');
    }).length;

    return { total, active, review, completedOrFull };
  }, [campusFilteredRows]);

  async function viewRecord(row: EntityRow) {
    setLoadingId(row.id);
    const request = new Promise<EntityRow>((resolve) => setTimeout(() => resolve(row), 650));
    const result = await toast.promise(request, {
      loading: { title: 'Loading record', description: `Fetching ${row.id} from the demo API…`, type: 'loading' },
      success: { title: 'Record loaded', description: `${row.id} is ready to view.`, type: 'success' },
      error: { title: 'Unable to load record', description: 'Please try again.', type: 'error' },
    });
    setDetailRow(result);
    setLoadingId(null);
  }

  function submitRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const generatedId = `${section === 'students' ? 'BQ' : section === 'trainers' ? 'TR' : section === 'batches' ? 'BATCH' : 'REC'}-${Math.floor(1000 + Math.random() * 9000)}`;
    const campusLabel = campusNames[activeCampus] ?? 'Iqbal Campus, Lahore';

    const newRow: EntityRow = {
      id: generatedId,
      campusKey: activeCampus === 'all' ? 'campus-iqbal-lahore' : activeCampus,
      campusName: campusLabel,
      cells: [
        generatedId,
        String(formData.get(def.formFields[0]?.label) || 'New Entry'),
        String(formData.get(def.formFields[1]?.label) || courses[0]),
        campusLabel,
        'Active',
      ],
      details: {
        'Record ID': generatedId,
        'Name': String(formData.get(def.formFields[0]?.label) || 'New Entry'),
        'Campus': campusLabel,
        'Status': 'Active (Recently Added)',
      },
      status: 'Active',
    };

    setCustomRows((prev) => ({
      ...prev,
      [section]: [newRow, ...(prev[section] ?? [])],
    }));

    setFormOpen(false);
    setMessage(`New dummy ${def.item} [${generatedId}] created for ${campusLabel}.`);
    toast.add({
      title: `${def.item[0].toUpperCase()}${def.item.slice(1)} created`,
      description: `Saved to ${campusLabel} directory.`,
      type: 'success',
    });

    if (section === 'reports') generatePdf();
  }

  function generatePdf() {
    downloadBanoQabilReport({
      title: `${def.title} Summary · ${campusNames[activeCampus] ?? 'Iqbal Campus, Lahore'}`,
      subtitle: `Verified Operational Report for ${campusNames[activeCampus] ?? 'All Campuses'}`,
      preparedBy: currentRole ?? 'Coordinator',
      sections: [
        { label: 'Campus scope', value: campusNames[activeCampus] ?? 'Iqbal Campus, Lahore' },
        { label: 'Total records', value: String(stats.total) },
        { label: 'Active records', value: String(stats.active) },
        { label: 'Needs review / Follow-up', value: String(stats.review) },
        { label: 'Completed / Capacity full', value: String(stats.completedOrFull) },
        { label: 'Data isolation', value: 'Strict RBAC Campus Partitioning' },
      ],
    });
    toast.add({
      title: 'PDF report generated',
      description: `The BanoQabil One report for ${campusNames[activeCampus] ?? 'campus'} was downloaded.`,
      type: 'success',
    });
  }

  const activeCampusName = campusNames[activeCampus] ?? 'Iqbal Campus, Lahore';

  return (
    <AppShell>
      <PageHeader
        title={def.title}
        description={def.description}
        actions={
          <>
            {section === 'reports' && (
              <Button variant="outline" className="bg-white" onClick={generatePdf}>
                Generate PDF
              </Button>
            )}
            {(currentRole === 'Coordinator' || currentRole === 'Admin' || (currentRole as any) === 'Super Admin') && (
              <Button
                onClick={() => setFormOpen(true)}
                className="bg-gradient-to-r from-[#08af8b] to-[#07558a] text-white"
              >
                <FilePlus2 />
                Add {def.item}
              </Button>
            )}
          </>
        }
      />

      {message && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
          {message}
        </div>
      )}

      {/* Campus Isolation Banner */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200/90 bg-gradient-to-r from-emerald-50/95 via-teal-50/70 to-blue-50/90 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <MapPin className="size-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#093554]">
                Campus Scope: <span className="text-emerald-700">{activeCampusName}</span>
              </h2>
              <Badge className="bg-emerald-100 text-[10px] font-semibold text-emerald-800 border-emerald-200">
                {activeCampus === 'campus-iqbal-lahore'
                  ? 'Assigned Campus (Ahmad Saeed)'
                  : activeCampus === 'all'
                  ? 'Global Network View'
                  : 'Demo Switcher View'}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-slate-600">
              {currentRole === 'Coordinator'
                ? activeCampus === 'campus-iqbal-lahore'
                  ? 'Campus Coordinator Ahmad Saeed is assigned to Iqbal Campus, Lahore. All records below belong exclusively to this campus.'
                  : `Currently viewing ${activeCampusName}. In production, coordinators only access their assigned jurisdiction.`
                : `Viewing operational records filtered to ${activeCampusName}.`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            RBAC Isolated
          </span>
        </div>
      </div>

      {/* Dynamic Stat Cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={`Total ${def.title}`}
          value={String(stats.total)}
          change={`${stats.total > 0 ? '+12.5%' : '0%'}`}
          icon={UsersRound}
          tone="green"
        />
        <StatCard
          label="Active"
          value={String(stats.active)}
          change={`${stats.active > 0 ? '+8.1%' : '0%'}`}
          icon={Activity}
          tone="blue"
        />
        <StatCard
          label="Needs Review / Follow-up"
          value={String(stats.review)}
          change={`${stats.review > 0 ? '+6.3%' : '0%'}`}
          icon={Layers3}
          tone="amber"
        />
        <StatCard
          label="Completed / Capacity Full"
          value={String(stats.completedOrFull)}
          change={`${stats.completedOrFull > 0 ? '+15.7%' : '0%'}`}
          icon={UserRoundCheck}
          tone="lime"
        />
      </div>

      {/* Entity Directory Panel */}
      <Panel
        title={`${def.title} Directory · ${activeCampusName}`}
        subtitle={`Displaying records isolated to ${activeCampusName}.`}
        className="mt-4"
        action={
          <div className="w-64">
            <PageSearch
              value={search}
              onChange={setSearch}
              placeholder={`Search ${def.title.toLowerCase()}…`}
            />
          </div>
        }
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              {def.columns.map((col, index) => (
                <TableHead key={col} className={index === 0 ? 'px-4' : ''}>
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={def.columns.length} className="h-32 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Filter className="size-6 text-slate-300" />
                    <p className="text-sm font-medium">No {def.title.toLowerCase()} found for {activeCampusName}.</p>
                    <p className="text-xs text-slate-400">Switch to another campus or click &quot;Add {def.item}&quot; to create one.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              displayedRows.map((row) => (
                <TableRow key={row.id}>
                  {row.cells.map((cell, index) => {
                    const isStatusCol = index === row.cells.length - 1;
                    if (isStatusCol) {
                      return (
                        <TableCell key={`${row.id}-${cell}`}>
                          <Badge className={statusBadgeClass(cell)}>{cell}</Badge>
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell
                        key={`${row.id}-${cell}`}
                        className={index === 0 ? 'px-4 font-medium text-[#17345f]' : ''}
                      >
                        {cell}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <Button
                      onClick={() => viewRecord(row)}
                      variant="outline"
                      size="sm"
                      disabled={loadingId === row.id}
                      className="gap-1.5 hover:border-emerald-300 hover:text-emerald-700"
                    >
                      {loadingId === row.id ? 'Loading…' : 'View'}
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Panel>

      {/* Add Item Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Add {def.item}</DialogTitle>
            <DialogDescription>
              Complete the fields below to add a new {def.item} scoped to {activeCampusName}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitRecord}>
            <div className="grid gap-4 py-2 sm:grid-cols-2">
              {def.formFields.map((field, index) => (
                <label
                  key={field.label}
                  className={field.type === 'textarea' ? 'sm:col-span-2' : ''}
                >
                  <span className="mb-1.5 block text-xs font-semibold text-[#17345f]">
                    {field.label}
                  </span>
                  {field.options ? (
                    <NativeSelect
                      name={field.label}
                      defaultValue={field.label === 'Campus' ? activeCampusName : field.options[0]}
                      className="w-full [&_select]:h-10 [&_select]:bg-white"
                    >
                      {field.options.map((option) => (
                        <NativeSelectOption key={option}>{option}</NativeSelectOption>
                      ))}
                    </NativeSelect>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      required
                      name={field.label}
                      rows={4}
                      className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-emerald-400"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  ) : (
                    <Input
                      required
                      name={field.label}
                      type={field.type ?? 'text'}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      autoFocus={index === 0}
                    />
                  )}
                </label>
              ))}
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#08af8b] to-[#07558a] text-white"
              >
                {section === 'reports' ? 'Create & Download PDF' : `Create ${def.item}`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Record Details Dialog */}
      <Dialog open={Boolean(detailRow)} onOpenChange={(open) => !open && setDetailRow(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {def.item[0].toUpperCase()}{def.item.slice(1)} Details
            </DialogTitle>
            <DialogDescription>
              Verified record information scoped to {detailRow?.campusName ?? activeCampusName}.
            </DialogDescription>
          </DialogHeader>
          {detailRow && (
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(detailRow.details).map(([label, value], idx) => (
                <div
                  key={label}
                  className={
                    idx === 1
                      ? 'sm:col-span-2 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4'
                      : 'rounded-xl bg-slate-50 p-4'
                  }
                >
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                    {label}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-[#17345f]">{value}</p>
                </div>
              ))}
            </div>
          )}
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
