'use client';

import { useEffect } from 'react';

import { SystemErrorDialog } from '@/components/system-error-dialog';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('BanoQabil route error', error); }, [error]);
  return <SystemErrorDialog error={{ title: 'This screen could not be loaded', message: 'A problem interrupted this dashboard screen. Try loading it again.', reference: error.digest }} onRetry={reset} />;
}
