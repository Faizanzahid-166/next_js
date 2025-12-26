'use client';

import { useSearchParams } from 'next/navigation';
import VerifyOTPClient from './VerifyOTPClient';

export default function VerifyOTPPage() {
  const searchParams = useSearchParams();
  const emailParam = searchParams?.get('email') || '';
  const email = decodeURIComponent(emailParam);

  if (!email) {
    return <p className="text-center pt-10 text-red-500">Error: email missing.</p>;
  }

  return <VerifyOTPClient email={email} />;
}
