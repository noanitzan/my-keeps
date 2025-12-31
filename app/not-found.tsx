export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-turquoise-50 to-turquoise-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-turquoise-950 mb-4">404</h1>
        <p className="text-xl text-turquoise-900 mb-8">This page could not be found.</p>
        <a
          href="/"
          className="inline-block bg-turquoise-600 text-white px-6 py-3 rounded-lg hover:bg-turquoise-700 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

