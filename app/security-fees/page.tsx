'use client';

import { useState } from 'react';
import { BadgeDollarSign, CheckCircle2, CircleAlert, ReceiptText, RotateCcw } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { PageHeader, Panel, StatCard } from '@/components/dashboard-ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/toast';

const initialStudents = [
  { id:'STU-00564', name:'Ayesha Khan', course:'Web Development', paid:true, attendance:92, completed:true, refunded:false },
  { id:'STU-00621', name:'M. Rehan', course:'Graphic Design', paid:true, attendance:84, completed:true, refunded:false },
  { id:'STU-00695', name:'Sana Naveed', course:'Digital Marketing', paid:true, attendance:76, completed:true, refunded:false },
  { id:'STU-00712', name:'Zain Ali', course:'Cyber Security', paid:false, attendance:68, completed:false, refunded:false },
  { id:'STU-00677', name:'Noor Malik', course:'UI/UX Design', paid:true, attendance:88, completed:true, refunded:true },
];

export default function SecurityFeesPage() {
  const [students,setStudents] = useState(initialStudents);
  function update(id:string, type:'paid'|'refunded') { setStudents((rows) => rows.map((row) => row.id === id ? {...row,[type]:true} : row)); toast.add({ title: type === 'paid' ? 'Payment recorded' : 'Refund processed', description: type === 'paid' ? 'PKR 3,000 security fee was recorded.' : 'The eligible PKR 3,000 refund was marked as processed.', type:'success' }); }
  return <AppShell role="Coordinator"><PageHeader title="Student Security Fees" description="Record PKR 3,000 deposits and process refunds after course completion and attendance eligibility" />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Fees Collected" value="PKR 3.42M" change="8.4%" icon={BadgeDollarSign} tone="green" /><StatCard label="Eligible Refunds" value="184" change="12.1%" icon={RotateCcw} tone="blue" /><StatCard label="Refunded" value="126" change="15.7%" icon={CheckCircle2} tone="lime" /><StatCard label="Payment Pending" value="37" change="3.2%" icon={CircleAlert} tone="amber" /></div>
    <Panel title="Security Fee Register" subtitle="Refund eligibility requires course completion and at least 80% attendance" className="mt-4"><Table><TableHeader><TableRow><TableHead className="px-4">Student</TableHead><TableHead>Course</TableHead><TableHead>Fee</TableHead><TableHead>Attendance</TableHead><TableHead>Completion</TableHead><TableHead>Refund Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader><TableBody>{students.map((student) => { const eligible = student.paid && student.completed && student.attendance >= 80; return <TableRow key={student.id}><TableCell className="px-4"><p className="font-semibold text-[#17345f]">{student.name}</p><p className="text-[9px] text-slate-400">{student.id}</p></TableCell><TableCell>{student.course}</TableCell><TableCell><Badge className={student.paid ? 'bg-emerald-50 text-emerald-700':'bg-red-50 text-red-600'}>{student.paid ? 'PKR 3,000 Paid':'Pending'}</Badge></TableCell><TableCell><div className="flex w-32 items-center gap-2"><Progress value={student.attendance} /><b className="text-xs">{student.attendance}%</b></div></TableCell><TableCell>{student.completed ? 'Completed':'In progress'}</TableCell><TableCell><Badge className={student.refunded ? 'bg-blue-50 text-blue-700':eligible ? 'bg-emerald-50 text-emerald-700':'bg-slate-100 text-slate-600'}>{student.refunded ? 'Refunded':eligible ? 'Eligible':'Not eligible'}</Badge></TableCell><TableCell className="text-right">{!student.paid ? <Button size="sm" onClick={() => update(student.id,'paid')}><ReceiptText />Record PKR 3,000</Button> : <Button size="sm" variant="outline" disabled={!eligible || student.refunded} onClick={() => update(student.id,'refunded')}><RotateCcw />{student.refunded ? 'Refunded':'Process Refund'}</Button>}</TableCell></TableRow>; })}</TableBody></Table></Panel>
  </AppShell>;
}
