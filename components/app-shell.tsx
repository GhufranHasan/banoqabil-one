'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import {
  Bell,
  Bot,
  Building2,
  CalendarCheck2,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  FileClock,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Send,
  Sparkles,
  UserRoundCog,
  UsersRound,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navigation = [
  { label: 'Overview', href: '/dashboard/coordinator', icon: LayoutDashboard },
  { label: 'Imports', href: '#imports', icon: ClipboardList, badge: '3' },
  { label: 'Allocations', href: '#allocations', icon: UsersRound },
  { label: 'Follow-ups', href: '#follow-ups', icon: CalendarCheck2, badge: '18' },
  { label: 'Seat availability', href: '/seat-availability', icon: Building2 },
  { label: 'Attendance', href: '#attendance', icon: FileClock },
] as const;

const management = [
  { label: 'Users & roles', href: '#users', icon: UserRoundCog },
  { label: 'Audit log', href: '#audit', icon: FileClock },
] as const;

function Brand() {
  return (
    <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-5">
      <div className="grid size-10 place-items-center rounded-xl bg-[#10ad87] text-white shadow-lg shadow-black/10">
        <GraduationCap className="size-6" />
      </div>
      <div>
        <p className="text-lg font-bold leading-none tracking-tight text-white">Bano Qabil</p>
        <p className="mt-1 text-[9px] font-semibold uppercase tracking-[.22em] text-[#8ee2cc]">One Platform</p>
      </div>
    </div>
  );
}

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const renderItems = (items: typeof navigation | typeof management) =>
    items.map((item) => {
      const active = item.href === pathname;
      const Icon = item.icon;
      return (
        <Link
          key={item.label}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            'group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition',
            active
              ? 'bg-[#10ad87] text-white shadow-lg shadow-black/10'
              : 'text-blue-100/65 hover:bg-white/[.07] hover:text-white',
          )}
        >
          <Icon className="size-[18px]" />
          <span className="flex-1">{item.label}</span>
          {'badge' in item && item.badge ? (
            <span className={cn('grid min-w-5 place-items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold', active ? 'bg-white/20 text-white' : 'bg-[#8cc63f]/20 text-[#b8eb75]')}>
              {item.badge}
            </span>
          ) : null}
        </Link>
      );
    });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-blue-100/35">Workspace</p>
        <div className="space-y-1">{renderItems(navigation)}</div>
        <p className="mb-2 mt-7 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-blue-100/35">Management</p>
        <div className="space-y-1">{renderItems(management)}</div>
      </nav>
      <div className="border-t border-white/10 p-3">
        <Link href="#help" className="flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium text-blue-100/55 transition hover:bg-white/[.07] hover:text-white"><CircleHelp className="size-[18px]" />Help & support</Link>
        <Link href="/" className="flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium text-blue-100/55 transition hover:bg-white/[.07] hover:text-white"><LogOut className="size-[18px]" />Sign out</Link>
      </div>
    </div>
  );
}

function AssistantPanel() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Assalam-o-Alaikum! I can help you explore capacity, allocations, follow-ups and attendance.' },
  ]);

  function sendQuestion(text = question) {
    const clean = text.trim();
    if (!clean) return;
    setMessages((current) => [
      ...current,
      { role: 'user', text: clean },
      { role: 'assistant', text: 'I found 7 batches under 75% occupancy. Gulshan and North Nazimabad have the strongest opportunity to consolidate seats.' },
    ]);
    setQuestion('');
  }

  return (
    <Sheet>
      <SheetTrigger
        render={<Button className="hidden h-10 rounded-xl bg-[#0a3a78] px-4 text-white hover:bg-[#082f64] sm:inline-flex" />}
      >
        <Sparkles className="size-4 text-[#9bd34e]" /> Ask BQ One
      </SheetTrigger>
      <SheetContent className="w-[min(440px,92vw)] border-l-0 bg-[#f7fafc] p-0 sm:max-w-[440px]">
        <SheetHeader className="border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-[#e3f7f1] text-[#07866a]"><Bot className="size-6" /></span>
            <div><SheetTitle className="text-lg font-bold text-[#061d49]">BQ One Assistant</SheetTitle><SheetDescription className="mt-0.5">Secure, scope-aware operational help</SheetDescription></div>
          </div>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={cn('max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6', message.role === 'user' ? 'ml-auto rounded-br-md bg-[#0a3a78] text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-600 shadow-sm')}>
              {message.text}
            </div>
          ))}
          {messages.length === 1 && (
            <div className="grid gap-2">
              {['Which campuses have open seats?', 'Show batches below 75% occupancy', 'Who needs follow-up today?'].map((prompt) => (
                <button key={prompt} onClick={() => sendQuestion(prompt)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-xs font-medium text-[#0a3a78] transition hover:border-[#10ad87]/50 hover:bg-[#f2fbf8]">{prompt}</button>
              ))}
            </div>
          )}
        </div>
        <form onSubmit={(event) => { event.preventDefault(); sendQuestion(); }} className="flex gap-2 border-t border-slate-200 bg-white p-4">
          <Input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about your operations…" className="h-11 rounded-xl bg-slate-50" aria-label="Ask BQ One" />
          <Button type="submit" size="icon-lg" className="size-11 rounded-xl bg-[#10ad87] hover:bg-[#0e9676]" aria-label="Send question"><Send /></Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export function AppShell({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f8fb] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[244px] flex-col bg-[#061d49] lg:flex">
        <Brand />
        <NavContent />
      </aside>

      <div className="lg:pl-[244px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center gap-3 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur sm:px-6 xl:px-8">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon-lg" className="lg:hidden" aria-label="Open navigation" />}><Menu /></SheetTrigger>
            <SheetContent side="left" className="w-[280px] gap-0 border-r-0 bg-[#061d49] p-0 text-white" showCloseButton={false}>
              <Brand />
              <NavContent />
            </SheetContent>
          </Sheet>

          <div className="hidden min-w-0 flex-1 md:block">
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#099977]">{eyebrow}</p>
            <p className="truncate text-lg font-bold tracking-tight text-[#061d49]">{title}</p>
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
            <button className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-600 transition hover:bg-white md:flex">
              Karachi Central <ChevronDown className="size-4 text-slate-400" />
            </button>
            <AssistantPanel />
            <button className="relative grid size-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100" aria-label="Notifications">
              <Bell className="size-5" /><span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-[#f97316]" />
            </button>
            <button className="flex items-center gap-2 rounded-xl p-1.5 pr-2 transition hover:bg-slate-100" aria-label="Open user menu">
              <span className="grid size-8 place-items-center rounded-lg bg-[#e2edfa] text-xs font-bold text-[#0a3a78]">GH</span>
              <span className="hidden text-left xl:block"><span className="block text-xs font-semibold text-[#0b2347]">Ghufran Hasan</span><span className="block text-[10px] text-slate-400">Coordinator</span></span>
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] p-4 sm:p-6 xl:p-8">{children}</main>
      </div>
    </div>
  );
}

export function PageSearch({ value, onChange, placeholder = 'Search' }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-10 rounded-xl bg-white pl-9" />
    </div>
  );
}
