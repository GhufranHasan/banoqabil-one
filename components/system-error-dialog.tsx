'use client';

import { useState } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw, ShieldAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export type SystemError = {
  title?: string;
  message?: string;
  reference?: string;
};

export function SystemErrorDialog({ error, open = true, onDismiss, onRetry }: { error: SystemError; open?: boolean; onDismiss?: () => void; onRetry?: () => void }) {
  const [fallbackReference] = useState(() => `BQ-${Date.now().toString(36).toUpperCase()}`);
  const reference = error.reference ?? fallbackReference;
  return <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onDismiss?.(); }}><DialogContent showCloseButton={Boolean(onDismiss)} className="overflow-hidden border-red-100 p-0 sm:max-w-md">
    <div className="h-1.5 bg-gradient-to-r from-red-500 via-amber-400 to-[#08a987]" />
    <div className="p-6 pt-5"><DialogHeader className="text-left"><div className="mb-2 flex items-center gap-3"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-red-50 text-red-600"><ShieldAlert className="size-6" /></span><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-red-500">System error</p><DialogTitle className="mt-1 text-[#0b1f4d]">{error.title ?? 'Something went wrong'}</DialogTitle></div></div><DialogDescription className="pt-2 leading-6">{error.message ?? 'The requested action could not be completed. Your existing data has not been changed.'}</DialogDescription></DialogHeader>
      <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5 text-xs text-amber-800"><AlertTriangle className="mt-0.5 size-4 shrink-0" /><span>If the issue continues, share reference <b>{reference}</b> with your administrator.</span></div>
      <DialogFooter className="mt-5 gap-2 sm:justify-between">{onDismiss && <Button variant="outline" onClick={onDismiss}>Dismiss</Button>}<div className="flex gap-2">{onRetry && <Button variant="outline" onClick={onRetry}><RotateCcw />Try again</Button>}<Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-[#08a987] to-[#073b83] text-white"><RefreshCw />Reload</Button></div></DialogFooter>
    </div>
  </DialogContent></Dialog>;
}
