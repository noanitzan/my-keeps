"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-turquoise-50 to-turquoise-100">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-turquoise-800 mb-4">Something went wrong!</h2>
        <p className="text-lg text-turquoise-600 mb-8">{error?.message || "An unexpected error occurred"}</p>
        <button
          onClick={reset}
          className="bg-turquoise-600 text-white px-6 py-3 rounded-lg hover:bg-turquoise-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

