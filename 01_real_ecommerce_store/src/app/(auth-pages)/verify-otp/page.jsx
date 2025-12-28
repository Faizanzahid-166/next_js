// /app/(auth-pages)/verify-otp/page.js
import VerifyOTPClient from './VerifyOTPClient';

export default function VerifyOTPPage({ searchParams }) {
  const email = decodeURIComponent(searchParams?.email || '');

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-center text-lg">Error: email missing.</p>
      </div>
    );
  }

  return <VerifyOTPClient email={email} />;
}
