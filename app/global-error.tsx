'use client';

import { SystemErrorDialog } from '@/components/system-error-dialog';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en"><body><SystemErrorDialog error={{ title: 'BanoQabil One is temporarily unavailable', message: 'The application encountered a critical error. Reload the workspace or try again.', reference: error.digest }} onRetry={reset} /></body></html>;
}
