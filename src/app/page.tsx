import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Launchpad</h1>
        <p className="text-gray-500">Next.js · Supabase · Mistral AI</p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-5 py-2.5 text-sm transition-colors"
        >
          Sign in
        </Link>
        <Link
          href="/dashboard"
          className="border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium rounded-lg px-5 py-2.5 text-sm transition-colors"
        >
          Dashboard
        </Link>
      </div>
    </main>
  );
}
