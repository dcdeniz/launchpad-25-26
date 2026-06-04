import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
        <p className="text-gray-600 text-sm">Signed in as {user.email}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-medium text-gray-800 mb-1">Chat</h2>
            <p className="text-sm text-gray-500">POST /api/chat</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-medium text-gray-800 mb-1">Stream</h2>
            <p className="text-sm text-gray-500">POST /api/chat/stream</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-medium text-gray-800 mb-1">Embeddings</h2>
            <p className="text-sm text-gray-500">POST /api/embed</p>
          </div>
        </div>
      </div>
    </main>
  );
}
