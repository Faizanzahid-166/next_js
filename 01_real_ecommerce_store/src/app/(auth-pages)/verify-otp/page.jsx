import VerifyOTPClient from './VerifyOTPClient';

export default function VerifyOTPPage({ searchParams }) {
  const email = searchParams?.get?.('email'); // fallback if searchParams exists

  if (!email) return <p className="text-center pt-10 text-red-500">Error: email missing.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <VerifyOTPClient email={email} />
    </div>
  );
}
