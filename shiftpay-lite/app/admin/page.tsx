import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");

  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      include: { subscription: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
  ]);

  const planCounts = {
    FREE: users.filter((u) => !u.subscription || u.subscription.plan === "FREE").length,
    PRO: users.filter((u) => u.subscription?.plan === "PRO").length,
    ADVANCED: users.filter((u) => u.subscription?.plan === "ADVANCED").length,
  };

  const adminCount = users.filter((u) => u.role === "ADMIN").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 text-sm transition-colors">
                ← Dashboard
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              🛡️ Admin Panel
            </h1>
            <p className="text-gray-500 mt-1">Manage users and subscriptions</p>
          </div>
          <span className="bg-purple-100 text-purple-700 font-bold text-sm px-4 py-2 rounded-xl">
            Admin Access
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Users", value: totalUsers, icon: "👥", color: "bg-blue-50 text-blue-700" },
            { label: "Admins", value: adminCount, icon: "🛡️", color: "bg-purple-50 text-purple-700" },
            { label: "Free Plan", value: planCounts.FREE, icon: "🎁", color: "bg-gray-50 text-gray-700" },
            { label: "Pro Plan", value: planCounts.PRO, icon: "⚡", color: "bg-blue-50 text-blue-700" },
            { label: "Advanced", value: planCounts.ADVANCED, icon: "🚀", color: "bg-indigo-50 text-indigo-700" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} rounded-2xl p-5 border border-white/50 shadow-sm`}>
              <span className="text-2xl block mb-2">{stat.icon}</span>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm font-medium opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Users table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">All Users ({totalUsers})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["User", "Email", "Role", "Plan", "Status", "Joined"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => {
                  const plan = user.subscription?.plan ?? "FREE";
                  const status = user.subscription?.status ?? "ACTIVE";

                  const planColors: Record<string, string> = {
                    FREE: "bg-gray-100 text-gray-600",
                    PRO: "bg-blue-100 text-blue-700",
                    ADVANCED: "bg-purple-100 text-purple-700",
                  };
                  const statusColors: Record<string, string> = {
                    ACTIVE: "bg-green-100 text-green-700",
                    CANCELED: "bg-red-100 text-red-700",
                    PAST_DUE: "bg-orange-100 text-orange-700",
                    TRIALING: "bg-yellow-100 text-yellow-700",
                  };

                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">
                              {(user.name ?? user.email)[0].toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{user.name ?? "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${planColors[plan] ?? planColors.FREE}`}>
                          {plan}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[status] ?? statusColors.ACTIVE}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-2">👥</p>
                <p>No users yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
