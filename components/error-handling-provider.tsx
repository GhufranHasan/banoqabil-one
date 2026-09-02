'use client';

import { useEffect, useState } from 'react';

import { SystemErrorDialog, type SystemError } from '@/components/system-error-dialog';

export const APP_ERROR_EVENT = 'bqone:system-error';

export function reportSystemError(error: unknown, title = 'Action could not be completed') {
  if (typeof window === 'undefined') return;
  const message = error instanceof Error ? error.message : typeof error === 'string' ? error : 'An unexpected system error occurred.';
  window.dispatchEvent(new CustomEvent<SystemError>(APP_ERROR_EVENT, { detail: { title, message } }));
}

export function ErrorHandlingProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<SystemError | null>(null);

  useEffect(() => {
    const show = (value: SystemError) => setError({ ...value, reference: value.reference ?? `BQ-${Date.now().toString(36).toUpperCase()}` });
    const handleError = (event: ErrorEvent) => {
      const msg = event.error instanceof Error ? event.error.message : event.message;
      if (
        msg?.includes('ResizeObserver') ||
        msg?.includes('ResizeObserver loop completed with undelivered notifications') ||
        msg?.includes('ResizeObserver loop limit exceeded')
      ) {
        event.stopImmediatePropagation();
        return;
      }
      event.preventDefault();
      show({ title: 'Unexpected application error', message: msg || 'An unexpected error occurred' });
    };
    const handleRejection = (event: PromiseRejectionEvent) => {
      const msg = event.reason instanceof Error ? event.reason.message : String(event.reason ?? '');
      if (
        msg?.includes('ResizeObserver') ||
        msg?.includes('ResizeObserver loop completed with undelivered notifications') ||
        msg?.includes('ResizeObserver loop limit exceeded')
      ) {
        event.stopImmediatePropagation();
        return;
      }
      event.preventDefault();
      show({ title: 'Request failed', message: msg || 'The request could not be completed.' });
    };
    const handleReportedError = (event: Event) => show((event as CustomEvent<SystemError>).detail);
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    window.addEventListener(APP_ERROR_EVENT, handleReportedError);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
      window.removeEventListener(APP_ERROR_EVENT, handleReportedError);
    };
  }, []);

  return <>{children}{error && <SystemErrorDialog error={error} onDismiss={() => setError(null)} onRetry={() => setError(null)} />}</>;
}
