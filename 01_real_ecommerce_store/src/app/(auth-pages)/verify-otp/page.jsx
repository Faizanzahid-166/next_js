'use client';

export const dynamic = 'force-dynamic';

import { useSearchParams } from 'next/navigation';
import VerifyOTPClient from './VerifyOTPClient';

export default function VerifyOTPPage() {
  const searchParams = useSearchParams();
  const emailParam = searchParams?.get('email') || '';
  const email = decodeURIComponent(emailParam);

  
  // Early return if email is missing
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-center text-lg">
          Error: email is missing from the URL.
        </p>
      </div>
    );
  }

  // Pass email to the client component
  return <VerifyOTPClient email={email} />;
}
