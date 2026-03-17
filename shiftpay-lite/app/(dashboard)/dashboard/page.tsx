import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

const quickActions = [
  { label: "Add Employee", href: "/dashboard/employees/new", icon: "👤", color: "bg-blue-50 text-blue-700" },
  { label: "Create Schedule", href: "/dashboard/schedule/new", icon: "📅", color: "bg-green-50 text-green-700" },
  { label: "View Reports", href: "/dashboard/reports", icon: "📊", color: "bg-purple-50 text-purple-700" },
  { label: "Manage Billing", href: "/pricing", icon: "💳", color: "bg-orange-50 text-orange-700" },
];

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });

  if (!user) redirect("/login");

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const [employeeCount, weekShifts] = await Promise.all([
    prisma.employee.count({ where: { userId: session.user.id, status: "ACTIVE" } }),
    prisma.shift.findMany({
      where: { userId: session.user.id, startTime: { gte: weekStart, lte: weekEnd } },
    }),
  ]);

  const hoursTracked = weekShifts.reduce((sum, s) => {
    const ms =
      new Date(s.endTime).getTime() -
      new Date(s.startTime).getTime() -
      s.breakMinutes * 60000;
    return sum + ms / 3600000;
  }, 0);

  const nextFriday = new Date(now);
  const daysTilFriday = (5 - now.getDay() + 7) % 7 || 7;
  nextFriday.setDate(now.getDate() + daysTilFriday);

  const stats = [
    { label: "Total Employees", value: String(employeeCount), icon: "👥", change: "" },
    { label: "Shifts This Week", value: String(weekShifts.length), icon: "📅", change: "" },
    { label: "Hours Tracked", value: hoursTracked.toFixed(1) + "h", icon: "🕐", change: "" },
    {
      label: "Next Payroll",
      value: nextFriday.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      icon: "💰",
      change: "",
    },
  ];

  const firstName = user.name?.split(" ")[0] ?? "there";
  const plan = user.subscription?.plan ?? "FREE";
  const isAdmin = user.role === "ADMIN";

  const planColors: Record<string, string> = {
    FREE: "bg-gray-100 text-gray-700",
    PRO: "bg-blue-100 text-blue-700",
    ADVANCED: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Good day, {firstName}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your workforce today.</p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${planColors[plan] ?? planColors.FREE}`}>
          {plan} Plan
        </span>
      </div>

      {/* Upgrade banner (only for FREE) */}
      {plan === "FREE" && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg">Unlock the full power of ClockRoster</h3>
              <p className="text-blue-200 text-sm mt-0.5">
                Upgrade to Pro for payroll management, GPS tracking, and reports.
              </p>
            </div>
            <Link
              href="/pricing"
              className="flex-shrink-0 bg-white text-blue-600 font-bold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-sm whitespace-nowrap"
            >
              Upgrade to Pro →
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">This week</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={`flex items-center gap-3 p-4 rounded-xl ${action.color} hover:opacity-80 transition-opacity`}
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="font-semibold text-sm">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Account info */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Account</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p>
              <p className="text-sm text-gray-700 font-medium truncate">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Plan</p>
              <p className={`text-sm font-semibold inline-block px-2 py-0.5 rounded-lg ${planColors[plan] ?? planColors.FREE}`}>
                {plan}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Member since</p>
              <p className="text-sm text-gray-700">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <Link
              href="/pricing"
              className="block mt-4 text-center text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 py-2 rounded-xl transition-colors"
            >
              Manage Subscription
            </Link>
          </div>
        </div>
      </div>

      {/* Admin panel card */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span>🛡️</span>
                <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">Admin</span>
              </div>
              <h3 className="font-bold text-lg">Admin Panel</h3>
              <p className="text-purple-200 text-sm">Manage users, plans, and system-wide settings.</p>
            </div>
            <Link
              href="/admin"
              className="flex-shrink-0 bg-white text-purple-700 font-bold px-5 py-2.5 rounded-xl hover:bg-purple-50 transition-colors text-sm"
            >
              Open Admin →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
