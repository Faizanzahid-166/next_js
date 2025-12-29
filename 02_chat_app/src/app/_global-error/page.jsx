"use client"; // Needed for hooks like useContext or client-only logic

export default function GlobalError({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong</h1>
      <p className="text-lg mb-6">{error?.message || "Unknown error occurred."}</p>
      {reset && (
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
