'use client';

import { useEffect, useState } from 'react';
import { Camera, CheckCircle2, Mail, Phone, ShieldCheck, Upload } from 'lucide-react';

import type { AppRole } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

export type AvatarChoice = 'male' | 'female' | 'initials';

const details: Record<AppRole, Array<{ label: string; value: string; options?: string[] }>> = {
  Student: [
    { label: 'Student ID', value: 'STU-00564' }, { label: 'Course', value: 'Web Development', options: ['Web Development', 'Graphic Design', 'Digital Marketing'] },
    { label: 'Campus', value: 'Iqbal Town Campus', options: ['Iqbal Town Campus', 'Johar Town Campus', 'Model Town Campus'] }, { label: 'Batch', value: 'WD-11 Morning', options: ['WD-11 Morning', 'WD-13 Evening'] },
    { label: 'Guardian Contact', value: '0301 7654321' },
  ],
  Teacher: [
    { label: 'Employee ID', value: 'TR-0082' }, { label: 'Specialization', value: 'Digital Marketing', options: ['Digital Marketing', 'Web Development', 'Graphic Design'] },
    { label: 'Assigned Campus', value: 'Iqbal Town Campus', options: ['Iqbal Town Campus', 'Johar Town Campus'] }, { label: 'Weekly Capacity', value: '30 hours', options: ['10 hours', '20 hours', '30 hours', '40 hours'] },
    { label: 'Qualification', value: 'BS Computer Science' },
  ],
  Coordinator: [
    { label: 'Employee ID', value: 'CO-0018' }, { label: 'Job Title', value: 'Campus Coordinator' },
    { label: 'Campus', value: 'Iqbal Town Campus', options: ['Iqbal Town Campus', 'Johar Town Campus', 'Model Town Campus'] }, { label: 'Region', value: 'Lahore', options: ['Lahore', 'Karachi', 'Faisalabad'] },
    { label: 'Operational Contact', value: '042 111 262 111' },
  ],
  Admin: [
    { label: 'Admin ID', value: 'ADM-0001' }, { label: 'Department', value: 'Platform Operations', options: ['Platform Operations', 'Governance', 'Data Quality'] },
    { label: 'Access Scope', value: 'National Network', options: ['National Network', 'Regional Network'] }, { label: 'Security Level', value: 'Level 4' },
    { label: 'Office Location', value: 'Karachi Head Office' },
  ],
  'Super Admin': [
    { label: 'Admin ID', value: 'ADM-0001' }, { label: 'Department', value: 'Platform Operations', options: ['Platform Operations', 'Governance', 'Data Quality'] },
    { label: 'Access Scope', value: 'National Network', options: ['National Network', 'Regional Network'] }, { label: 'Security Level', value: 'Level 4' },
    { label: 'Office Location', value: 'Karachi Head Office' },
  ],
  'Regional Manager': [
    { label: 'Manager ID', value: 'RM-0012' }, { label: 'Region', value: 'Lahore', options: ['Lahore', 'Karachi', 'Islamabad'] },
    { label: 'Regional Office', value: 'Lahore Central' }, { label: 'Managed Campuses', value: '62' },
  ],
};

export function ProfileSettingsDialog({ open, onOpenChange, role, userName, avatar, photoUrl, onAvatarChange, onPhotoChange }: {
  open: boolean; onOpenChange: (open: boolean) => void; role: AppRole; userName: string; avatar: AvatarChoice; photoUrl?: string;
  onAvatarChange: (avatar: AvatarChoice) => void; onPhotoChange: (url: string) => void;
}) {
  const defaultEmail = role === 'Student' ? 'ayesha@banoqabil.pk' : role === 'Teacher' ? 'sara@banoqabil.pk' : (role === 'Admin' || role === 'Super Admin') ? 'tariq@banoqabil.pk' : 'ahmad@banoqabil.pk';
  const [email, setEmail] = useState(defaultEmail);
  const [mobile, setMobile] = useState('0300 1234567');
  const [verifiedEmail, setVerifiedEmail] = useState(defaultEmail);
  const [verifiedMobile, setVerifiedMobile] = useState('0300 1234567');
  const [otp, setOtp] = useState('');
  const [otpOpen, setOtpOpen] = useState(false);

  useEffect(() => { if (!open) { setOtpOpen(false); setOtp(''); } }, [open]);
  useEffect(() => {
    setEmail(defaultEmail);
    setVerifiedEmail(defaultEmail);
    setMobile('0300 1234567');
    setVerifiedMobile('0300 1234567');
  }, [defaultEmail]);

  function handlePhoto(file?: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.add({ title: 'Unsupported file', description: 'Please select a JPG, PNG, or WebP image.', type: 'error' }); return; }
    const reader = new FileReader();
    reader.onload = () => { onPhotoChange(String(reader.result)); toast.add({ title: 'Picture updated', description: 'Your local profile preview is ready.', type: 'success' }); };
    reader.readAsDataURL(file);
  }

  function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    if (email !== verifiedEmail || mobile !== verifiedMobile) {
      setOtpOpen(true);
      setOtp('');
      toast.add({ title: 'OTP sent', description: 'A 6-digit verification code was sent to the updated contact details.', type: 'info' });
      return;
    }
    toast.add({ title: 'Profile updated', description: `${role} profile information was saved.`, type: 'success' });
    onOpenChange(false);
  }

  function verifyOtp() {
    if (otp !== '123456') { toast.add({ title: 'Invalid OTP', description: 'Enter the 6-digit demo OTP: 123456.', type: 'error' }); return; }
    setVerifiedEmail(email); setVerifiedMobile(mobile); setOtpOpen(false);
    toast.add({ title: 'Contact verified', description: 'Email and mobile number were verified successfully.', type: 'success' });
    onOpenChange(false);
  }

  const initials = userName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>{otpOpen ? 'Verify contact changes' : 'Profile Settings'}</DialogTitle><DialogDescription>{otpOpen ? 'Enter the six-digit code to confirm the updated email address or mobile number.' : `Update information relevant to your ${role} account.`}</DialogDescription></DialogHeader>
    {otpOpen ? <div className="py-6"><div className="mx-auto max-w-sm rounded-2xl border border-blue-100 bg-blue-50/60 p-5 text-center"><span className="mx-auto grid size-12 place-items-center rounded-full bg-white text-blue-600 shadow-sm"><ShieldCheck /></span><p className="mt-4 text-sm font-semibold text-[#17345f]">Verification required</p><p className="mt-2 text-xs leading-5 text-slate-500">We sent a code to <b>{email}</b> and <b>{mobile}</b>.</p><InputOTP maxLength={6} value={otp} onChange={setOtp} containerClassName="mt-5 justify-center"><InputOTPGroup>{Array.from({ length: 6 }, (_, index) => <InputOTPSlot key={index} index={index} className="size-11 bg-white text-base" />)}</InputOTPGroup></InputOTP><p className="mt-3 text-[10px] font-semibold text-blue-600">Demo OTP: 123456</p></div><DialogFooter className="mt-5"><Button variant="outline" onClick={() => setOtpOpen(false)}>Back</Button><Button onClick={verifyOtp} disabled={otp.length !== 6} className="bg-gradient-to-r from-[#08aa87] to-[#083b85] text-white"><CheckCircle2 />Verify OTP</Button></DialogFooter></div> : <form onSubmit={saveProfile}>
      <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-cyan-100 to-blue-200 text-xl font-bold text-[#123774] shadow">{photoUrl ? <img src={photoUrl} alt="Profile preview" className="size-full object-cover" /> : avatar === 'male' ? <span className="text-5xl">👨</span> : avatar === 'female' ? <span className="text-5xl">👩</span> : initials}</div><div className="flex-1"><p className="text-sm font-bold text-[#0b1f4d]">Profile picture</p><p className="mt-1 text-[10px] text-slate-500">Choose an avatar or upload a local image.</p><div className="mt-3 flex flex-wrap gap-2">{([['male','Male'],['female','Female'],['initials','Initials']] as const).map(([value,label]) => <button type="button" key={value} onClick={() => onAvatarChange(value)} className={cn('rounded-lg border bg-white px-3 py-2 text-xs', avatar === value && !photoUrl ? 'border-emerald-400 text-emerald-700 ring-1 ring-emerald-300' : 'border-slate-200 text-slate-600')}>{label}</button>)}<label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 hover:border-emerald-300"><Upload className="size-3.5" />Upload photo<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => handlePhoto(event.target.files?.[0])} /></label></div></div></div></section>
      <div className="mt-4 grid gap-4 sm:grid-cols-2"><label><span className="mb-1.5 block text-xs font-semibold text-[#17345f]">Full name</span><Input defaultValue={userName} /></label>{details[role].map((field) => <label key={field.label}><span className="mb-1.5 block text-xs font-semibold text-[#17345f]">{field.label}</span>{field.options ? <NativeSelect className="w-full [&_select]:h-10 [&_select]:bg-white">{field.options.map((option) => <NativeSelectOption key={option}>{option}</NativeSelectOption>)}</NativeSelect> : <Input defaultValue={field.value} />}</label>)}<label><span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#17345f]"><Mail className="size-3.5" />Email address</span><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label><span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#17345f]"><Phone className="size-3.5" />Mobile number</span><Input value={mobile} onChange={(event) => setMobile(event.target.value)} required /></label></div>
      <p className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-[10px] text-amber-700"><Camera className="size-3.5" />Changing email or mobile number requires OTP verification.</p><DialogFooter className="mt-5"><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" className="bg-gradient-to-r from-[#08aa87] to-[#083b85] text-white">Save changes</Button></DialogFooter>
    </form>}
  </DialogContent></Dialog>;
}
