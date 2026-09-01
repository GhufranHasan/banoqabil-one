'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, GraduationCap, ShieldCheck, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';

const roles = [
  { id: 'coordinator', label: 'Coordinator', icon: Users, description: 'Manage allocation and student operations' },
  { id: 'admin', label: 'Super Admin', icon: ShieldCheck, description: 'Monitor network-wide performance' },
  { id: 'trainer', label: 'Trainer', icon: GraduationCap, description: 'Attendance and batch management' },
] as const;

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f4f8fb] lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(520px,.95fr)]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#061d49] px-16 py-14 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full border-[72px] border-[#10ad87]/15" />
        <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-[#86c440]/10 blur-2xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-[#10ad87] shadow-lg shadow-[#10ad87]/20">
            <GraduationCap className="size-7" />
          </div>
          <div>
            <p className="text-[22px] font-bold leading-none tracking-tight">Bano Qabil</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[.26em] text-[#8ee2cc]">One Platform</p>
          </div>
        </div>

        <div className="relative z-10 max-w-xl pb-8">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-blue-100 backdrop-blur">
            <span className="size-2 rounded-full bg-[#8cc63f] shadow-[0_0_0_5px_rgb(140_198_63_/_0.12)]" />
            Empowering Pakistan through technology
          </div>
          <h1 className="max-w-lg text-5xl font-bold leading-[1.08] tracking-[-.04em] xl:text-6xl">
            One view of every learner, seat and opportunity.
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-blue-100/70">
            Make faster, fairer decisions across the Bano Qabil network with intelligent allocation and real-time operations.
          </p>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            {[
              ['25K+', 'Learners'],
              ['38', 'Campuses'],
              ['96%', 'Seat usage'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[.06] p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="mt-1 text-xs text-blue-100/60">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-blue-100/45">Alkhidmat Karachi · Education for everyone</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:px-16">
        <div className="w-full max-w-[480px]">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="grid size-11 place-items-center rounded-xl bg-[#0a3a78] text-white"><GraduationCap className="size-6" /></div>
            <div><p className="text-xl font-bold text-[#061d49]">Bano Qabil</p><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#099977]">One Platform</p></div>
          </div>

          <div className="mb-8">
            <p className="text-sm font-semibold text-[#099977]">Welcome back</p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-.03em] text-[#061d49]">Choose your workspace</h2>
            <p className="mt-3 text-[15px] leading-6 text-slate-500">Select a demo role to explore the operations platform.</p>
          </div>

          <div className="space-y-3">
            {roles.map(({ id, label, icon: Icon, description }, index) => (
              <button
                key={id}
                type="button"
                onClick={() => router.push(id === 'coordinator' ? '/dashboard/coordinator' : `/dashboard/${id}`)}
                className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_8px_30px_rgb(15_23_42/4%)] transition hover:-translate-y-0.5 hover:border-[#10ad87]/50 hover:shadow-[0_14px_35px_rgb(9_153_119/10%)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#10ad87]/20"
              >
                <span className={`grid size-12 shrink-0 place-items-center rounded-xl ${index === 0 ? 'bg-[#e3f7f1] text-[#07866a]' : 'bg-[#edf3fb] text-[#0a3a78]'}`}>
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 font-semibold text-[#0b2347]">
                    {label}
                    {index === 0 && <span className="rounded-full bg-[#eaf5da] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#598c1b]">Recommended</span>}
                  </span>
                  <span className="mt-1 block text-sm text-slate-500">{description}</span>
                </span>
                <ArrowRight className="size-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#099977]" />
              </button>
            ))}
          </div>

          <div className="my-7 flex items-center gap-3 text-xs font-medium uppercase tracking-[.13em] text-slate-400"><span className="h-px flex-1 bg-slate-200" />Secure demo access<span className="h-px flex-1 bg-slate-200" /></div>

          <Button onClick={() => router.push('/dashboard/coordinator')} className="h-12 w-full rounded-xl bg-[#0a3a78] text-base font-semibold text-white shadow-lg shadow-blue-950/10 hover:bg-[#082f64]">
            Continue as coordinator <ArrowRight data-icon="inline-end" />
          </Button>

          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400"><CheckCircle2 className="size-4 text-[#10ad87]" />Role-based access · Activity is securely logged</p>
        </div>
      </section>
    </main>
  );
}
