import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-600">Success!</h1>

        <p className="text-gray-700 mt-3">
          Your operation was completed successfully.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
