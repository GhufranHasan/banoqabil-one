'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  GraduationCap,
  HelpCircle,
  LockKeyhole,
  Mail,
  School,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const roles = [
  { label: 'Student', description: 'Access courses and learning materials', icon: UserRound, tone: 'emerald' },
  { label: 'Teacher', description: 'Manage classes and support learners', icon: GraduationCap, tone: 'blue' },
  { label: 'Coordinator', description: 'Oversee campus operations and performance', icon: Building2, tone: 'amber' },
  { label: 'Super Admin', description: 'Manage platform, users and settings', icon: ShieldCheck, tone: 'violet' },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('ahmad@banoqabil.pk');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Coordinator');
  const [message, setMessage] = useState('');

  function signIn(event: React.FormEvent) {
    event.preventDefault();
    if (password !== '1234') {
      setMessage('Incorrect demo password. Use 1234.');
      return;
    }
    sessionStorage.setItem('bqone-demo-role', selectedRole);
    sessionStorage.setItem('bqone-demo-email', email || 'demo@banoqabil.pk');
    const roleRoutes: Record<string, string> = {
      Student: '/dashboard/student',
      Teacher: '/dashboard/teacher',
      Coordinator: '/dashboard/coordinator',
      'Super Admin': '/dashboard/admin',
    };
    router.push(roleRoutes[selectedRole] ?? '/dashboard/coordinator');
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-[#007a6c] via-[#03566e] to-[#052b78] px-[8vw] py-12 text-white lg:flex lg:flex-col">
        <div className="absolute -right-44 top-16 size-[460px] rounded-full border-[80px] border-cyan-200/[.04]" />
        <div className="absolute bottom-0 right-0 h-1/2 w-1/2 bg-[radial-gradient(circle_at_center,rgb(75_229_192_/_0.13),transparent_68%)]" />
        <div className="relative z-10 flex items-center gap-3">
          <span className="grid size-16 place-items-center overflow-hidden rounded-2xl bg-white/95 p-1.5 shadow-lg"><img src="/bano-qabil-official.png" alt="Bano Qabil official logo" className="size-full object-contain" /></span>
          <div><p className="text-2xl font-bold tracking-[-.04em]">BanoQabil</p><span className="rounded bg-[#c5ef34] px-2 py-0.5 text-[9px] font-black uppercase text-[#064c5a]">One</span></div>
        </div>

        <div className="relative z-10 my-auto max-w-2xl py-10">
          <h1 className="text-[clamp(42px,4vw,66px)] font-bold leading-[1.08] tracking-[-.05em]">Empowering Pakistan<br /><span className="text-[#08c49a]">Through Digital Skills</span></h1>
          <p className="mt-6 max-w-xl text-[16px] leading-7 text-blue-50/75">Bano Qabil One is Pakistan’s leading operations platform for digital skills training—bringing learners, educators and campuses together.</p>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-4">
            {[[UsersRound, '1.2M+', 'Students'], [GraduationCap, '82K+', 'Trainers'], [School, '350+', 'Campuses']].map(([Icon, value, label]) => {
              const StatIcon = Icon as typeof UsersRound;
              return <div key={String(label)} className="rounded-xl border border-white/15 bg-white/[.06] p-4 backdrop-blur"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-emerald-400/10 text-[#26d5a7]"><StatIcon className="size-5" /></span><div><p className="text-xl font-bold">{String(value)}</p><p className="text-xs text-[#38d5ae]">{String(label)}</p></div></div></div>;
            })}
          </div>

          <div className="mt-8 max-w-xl rounded-2xl border border-white/15 bg-[#042d69]/65 p-5 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Coordinator overview</p><p className="mt-1 text-[10px] text-blue-100/50">Live demo workspace preview</p></div><span className="grid size-8 place-items-center rounded-full bg-white/10 text-xs">AS</span></div>
            <div className="mt-5 grid grid-cols-3 gap-3">{[['Students', '1,248'], ['Batches', '86'], ['Recovered', '217']].map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 bg-white/[.05] p-3"><p className="text-[10px] text-blue-100/50">{label}</p><p className="mt-1 text-lg font-bold">{value}</p><p className="mt-1 text-[9px] text-[#48d59d]">↑ 12.5%</p></div>)}</div>
            <div className="mt-4 grid grid-cols-[1.4fr_1fr] gap-3"><div className="h-20 rounded-xl border border-white/10 bg-[linear-gradient(170deg,transparent_48%,rgb(24_198_167_/_0.3)_49%,transparent_51%)]" /><div className="space-y-2 rounded-xl border border-white/10 p-3">{[74, 58, 84].map((width) => <span key={width} className="block h-2 rounded-full bg-white/10" style={{ width: `${width}%` }} />)}</div></div>
          </div>

          <div className="relative mt-6 min-h-[138px] max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-[#042d69]/70 py-5 pl-[165px] pr-5 shadow-xl backdrop-blur">
            <Sparkles className="size-5 text-[#c6ef33]" />
            <p className="mt-3 text-sm font-medium leading-6 text-white">“Future through accessible IT education.”</p>
            <p className="mt-3 text-xs font-bold text-white">Hafiz Naeem ur Rehman</p>
            <p className="mt-1 text-[10px] text-blue-100/55">Patron-in-Chief · Bano Qabil Pakistan</p>
            <div className="absolute inset-y-0 left-0 w-[150px] bg-gradient-to-r from-white/15 to-transparent" />
            <img src="/hafiz-naeem-official.webp" alt="Hafiz Naeem ur Rehman, Patron-in-Chief of Bano Qabil Pakistan" className="absolute bottom-0 left-1 h-[136px] w-[142px] rounded-tr-[50px] object-cover object-top" />
          </div>
        </div>
        <p className="relative z-10 text-xs text-blue-100/45">Education for everyone · Powered by opportunity</p>
      </section>

      <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 xl:px-[7vw]">
        <div className="flex justify-end"><Button variant="outline" className="bg-white text-slate-600"><HelpCircle />Need help?</Button></div>
        <div className="my-auto w-full max-w-[650px] self-center py-8">
          <form onSubmit={signIn} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgb(15_23_42/10%)] sm:p-9">
            <div className="text-center"><h2 className="text-3xl font-bold tracking-[-.04em] text-[#0a1e4b]">Welcome Back</h2><p className="mt-2 text-sm text-slate-500">Sign in to continue to <span className="font-semibold text-[#08a987]">Bano Qabil One</span></p></div>
            <div className="mt-8 space-y-5">
              <label className="block"><span className="mb-2 block text-xs font-semibold text-[#18315c]">Email Address</span><div className="relative"><Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required className="h-12 rounded-lg pl-11" placeholder="Enter your email" /></div></label>
              <label className="block"><span className="mb-2 flex items-center justify-between text-xs font-semibold text-[#18315c]">Password<button type="button" onClick={() => { setPassword('1234'); setMessage('Demo password filled in.'); }} className="font-medium text-blue-600 hover:underline">Forgot password?</button></span><div className="relative"><LockKeyhole className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input value={password} onChange={(event) => { setPassword(event.target.value); setMessage(''); }} type={showPassword ? 'text' : 'password'} required className="h-12 rounded-lg px-11" placeholder="Enter your password" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></label>
              <div className="flex items-center justify-between gap-4"><label className="flex items-center gap-2 text-xs text-slate-500"><Checkbox />Remember me</label><span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">Demo password: 1234</span></div>
              {message && <p className={cn('rounded-lg px-3 py-2 text-xs', message.startsWith('Incorrect') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700')}>{message}</p>}
              <Button type="submit" className="h-12 w-full rounded-lg bg-gradient-to-r from-[#08af8b] via-[#08777c] to-[#073281] text-sm font-semibold text-white shadow-lg hover:opacity-95">Sign In <ArrowRight /></Button>
            </div>

            <div className="my-6 flex items-center gap-3 text-[11px] text-slate-400"><span className="h-px flex-1 bg-slate-200" />or continue with<span className="h-px flex-1 bg-slate-200" /></div>
            <div className="grid gap-3 sm:grid-cols-2"><Button type="button" variant="outline" className="h-11" onClick={() => setMessage('Google sign-in is simulated in this demo.')}><span className="font-bold text-blue-600">G</span>Sign in with Google</Button><Button type="button" variant="outline" className="h-11" onClick={() => setMessage('Microsoft sign-in is simulated in this demo.')}><span className="grid grid-cols-2 gap-px">{['bg-red-500','bg-green-500','bg-blue-500','bg-amber-400'].map((color) => <i key={color} className={`size-1.5 ${color}`} />)}</span>Sign in with Microsoft</Button></div>

            <div className="-mx-6 -mb-6 mt-7 border-t border-slate-200 bg-slate-50/70 p-6 sm:-mx-9 sm:-mb-9 sm:p-8">
              <p className="mb-4 text-xs font-medium text-slate-500">Login as a different role (Demo)</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {roles.map(({ label, description, icon: Icon, tone }) => {
                  const color = { emerald: 'border-emerald-300 text-emerald-600', blue: 'border-blue-300 text-blue-600', amber: 'border-amber-300 text-amber-500', violet: 'border-violet-300 text-violet-600' }[tone];
                  return <button key={label} type="button" onClick={() => setSelectedRole(label)} className={cn('min-h-[132px] rounded-xl border bg-white p-3 text-center transition hover:-translate-y-0.5 hover:shadow-md', color, selectedRole === label && 'ring-2 ring-current ring-offset-2')}><Icon className="mx-auto size-6" /><span className="mt-3 block text-xs font-bold text-[#0a1e4b]">{label}</span><span className="mt-1 block text-[9px] leading-4 text-slate-400">{description}</span><ArrowRight className="mx-auto mt-2 size-4" /></button>;
                })}
              </div>
            </div>
          </form>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5 text-[10px] text-slate-400"><span>© 2026 Bano Qabil One. Demo frontend.</span><span>Privacy Policy · Terms of Service</span></div>
      </section>
    </main>
  );
}
