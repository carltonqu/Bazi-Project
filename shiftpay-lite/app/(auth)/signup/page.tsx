import Link from "next/link";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

interface SignupPageProps {
  searchParams: { plan?: string };
}

const planDetails: Record<string, { name: string; price: string; color: string; features: string[] }> = {
  FREE: {
    name: "Free",
    price: "$0/forever",
    color: "text-green-400",
    features: ["Up to 5 employees", "Basic scheduling", "Time tracking", "Email support"],
  },
  PRO: {
    name: "Pro",
    price: "$29/month",
    color: "text-blue-400",
    features: ["Up to 50 employees", "Advanced scheduling", "Payroll management", "GPS tracking", "Priority support"],
  },
  ADVANCED: {
    name: "Advanced",
    price: "$79/month",
    color: "text-purple-400",
    features: ["Unlimited employees", "All Pro features", "Multi-location", "Custom integrations", "Dedicated manager"],
  },
};

const valueProps = [
  { icon: "⚡", title: "Set up in 5 minutes", desc: "Import your team, configure schedules, and go live fast." },
  { icon: "🔄", title: "No credit card required", desc: "Start with the Free plan. Upgrade when you're ready." },
  { icon: "🛡️", title: "Enterprise-grade security", desc: "SOC 2 compliant. Your data is always encrypted and safe." },
  { icon: "🌍", title: "Works anywhere", desc: "Mobile-first design. Manage your team from anywhere." },
];

export default function SignupPage({ searchParams }: SignupPageProps) {
  const planKey = (searchParams?.plan?.toUpperCase() ?? "FREE") as keyof typeof planDetails;
  const selectedPlan = planDetails[planKey] ?? planDetails.FREE;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4 py-12">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-4xl">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column — value props */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">CR</span>
              </div>
              <span className="text-white font-bold text-xl">ClockRoster</span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              The smarter way to manage your team
            </h2>
            <p className="text-slate-400 mb-8">
              Join thousands of businesses using ClockRoster for scheduling, time tracking, and payroll.
            </p>

            {/* Value props */}
            <div className="space-y-5 mb-8">
              {valueProps.map((vp) => (
                <div key={vp.title} className="flex gap-3">
                  <span className="text-2xl">{vp.icon}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{vp.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{vp.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected plan */}
            <div className="bg-white/10 border border-white/20 rounded-xl p-4">
              <p className="text-slate-400 text-xs uppercase font-semibold mb-2 tracking-wider">Selected Plan</p>
              <div className="flex items-center justify-between mb-3">
                <span className={`font-bold text-lg ${selectedPlan.color}`}>{selectedPlan.name}</span>
                <span className="text-white font-semibold">{selectedPlan.price}</span>
              </div>
              <ul className="space-y-1.5">
                {selectedPlan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-slate-300 text-sm">
                    <span className="text-green-400 text-xs">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/#pricing" className="block mt-3 text-blue-400 text-xs hover:text-blue-300 transition-colors">
                Change plan →
              </Link>
            </div>
          </div>

          {/* Right column — sign up */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl flex flex-col justify-center">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white">Create your account</h1>
              <p className="text-slate-400 text-sm mt-1">
                Get started with ClockRoster in seconds
              </p>
            </div>

            <GoogleSignInButton
              label="Continue with Google"
              callbackUrl="/dashboard"
            />

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-6 border-t border-white/10 pt-6 text-center">
              <p className="text-slate-500 text-xs leading-relaxed">
                By creating an account, you agree to our{" "}
                <span className="text-slate-400 underline cursor-pointer">Terms of Service</span>
                {" "}and{" "}
                <span className="text-slate-400 underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div>

            {/* Trust indicators */}
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[
                { label: "2,000+", sub: "businesses" },
                { label: "50k+", sub: "employees" },
                { label: "99.9%", sub: "uptime" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 rounded-xl p-3">
                  <p className="text-white font-bold text-lg">{stat.label}</p>
                  <p className="text-slate-400 text-xs">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
