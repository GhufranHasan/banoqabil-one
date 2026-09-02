import type React from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowUp, CalendarDays, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { cn } from '@/lib/utils';

export function PageHeader({ title, description, actions }: { title: string; description: string; actions?: React.ReactNode }) {
  return <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><h1 className="text-[26px] font-bold tracking-[-.035em] text-[#0a1e4b] sm:text-[30px]">{title}</h1><p className="mt-1 text-[13px] text-slate-500">{description}</p></div><div className="flex flex-wrap gap-2">{actions ?? <><Button variant="outline" className="h-10 bg-white"><CalendarDays />May 18 – May 24, 2025</Button><Button variant="outline" className="h-10 bg-white"><Download />Export</Button></>}</div></div>;
}

const tones = {
  green: 'bg-emerald-50 text-emerald-600',
  blue: 'bg-blue-50 text-blue-600',
  amber: 'bg-amber-50 text-amber-500',
  lime: 'bg-lime-50 text-lime-600',
  violet: 'bg-violet-50 text-violet-600',
} as const;

export function StatCard({ label, value, change, icon: Icon, tone = 'green', note = 'vs. May 11 – May 17' }: { label: string; value: string; change: string; icon: LucideIcon; tone?: keyof typeof tones; note?: string }) {
  return <article className="flex min-h-[116px] items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_4px_18px_rgb(15_23_42/3%)]"><span className={cn('grid size-12 shrink-0 place-items-center rounded-full', tones[tone])}><Icon className="size-5" /></span><div><p className="text-[11px] text-slate-500">{label}</p><div className="mt-1 flex items-end gap-2"><p className="text-2xl font-bold tracking-[-.04em] text-[#0a1e4b]">{value}</p><span className="mb-0.5 flex items-center text-[10px] font-semibold text-emerald-600"><ArrowUp className="size-3" />{change}</span></div><p className="mt-2 text-[9px] text-slate-400">{note}</p></div></article>;
}

export function Panel({ title, subtitle, action, children, className }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return <section className={cn('rounded-xl border border-slate-200 bg-white shadow-[0_4px_18px_rgb(15_23_42/3%)]', className)}><div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3.5"><div><h2 className="text-[13px] font-bold text-[#0a1e4b]">{title}</h2>{subtitle && <p className="mt-1 text-[10px] text-slate-400">{subtitle}</p>}</div>{action}</div>{children}</section>;
}

export function FilterSelect({ label, options }: { label?: string; options: string[] }) {
  return <label className="block min-w-[120px] flex-1"><span className="mb-1 block text-[9px] font-semibold text-slate-500">{label}</span><NativeSelect className="w-full [&_select]:h-9 [&_select]:bg-white [&_select]:text-xs">{options.map((option) => <NativeSelectOption key={option}>{option}</NativeSelectOption>)}</NativeSelect></label>;
}
