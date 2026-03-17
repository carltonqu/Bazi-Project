import Link from "next/link";

const features = [
  {
    icon: "🕐",
    title: "Smart Time Tracking",
    description: "GPS-powered clock-in/out with automatic overtime detection and real-time visibility.",
  },
  {
    icon: "📅",
    title: "Drag & Drop Scheduling",
    description: "Build and publish schedules in minutes. Employees get instant notifications.",
  },
  {
    icon: "💰",
    title: "Automated Payroll",
    description: "Sync hours directly to payroll. Supports multiple pay rates and deductions.",
  },
  {
    icon: "📊",
    title: "Analytics & Reports",
    description: "Understand labor costs, attendance trends, and workforce productivity at a glance.",
  },
  {
    icon: "🔔",
    title: "Smart Notifications",
    description: "Automated reminders for shifts, approvals, and schedule changes via SMS or email.",
  },
  {
    icon: "🔒",
    title: "Role-Based Access",
    description: "Granular permissions for managers, HR, and employees. Keep sensitive data secure.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: ["Up to 5 employees", "Basic scheduling", "Time tracking", "Email support"],
    cta: "Get started free",
    href: "/signup?plan=FREE",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For growing teams",
    features: [
      "Up to 50 employees",
      "Advanced scheduling",
      "Payroll management",
      "GPS attendance tracking",
      "Reports & analytics",
      "Priority support",
    ],
    cta: "Start Pro trial",
    href: "/signup?plan=PRO",
    highlighted: true,
  },
  {
    name: "Advanced",
    price: "$79",
    period: "per month",
    description: "Enterprise-grade management",
    features: [
      "Unlimited employees",
      "All Pro features",
      "Multi-location support",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    cta: "Contact sales",
    href: "/signup?plan=ADVANCED",
    highlighted: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CR</span>
              </div>
              <span className="font-bold text-xl text-gray-900">ClockRoster</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 font-medium text-sm px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                Get started free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-600 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 text-sm text-blue-300 mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            Trusted by 2,000+ businesses worldwide
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Workforce management
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              made effortless
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            ClockRoster combines smart scheduling, GPS time tracking, and automated payroll
            into one beautiful platform your team will actually use.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
            >
              Start for free — no credit card
            </Link>
            <Link
              href="/login"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all border border-white/20"
            >
              Sign in to your account
            </Link>
          </div>
          <p className="mt-4 text-slate-400 text-sm">Free forever · No credit card required · Setup in 5 minutes</p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need to manage your workforce</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              From scheduling to payroll, ClockRoster handles the complexity so you can focus on your business.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-gray-500">Start free, scale as you grow. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.highlighted
                    ? "bg-blue-600 text-white shadow-2xl shadow-blue-500/30 scale-105"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-4 ${plan.highlighted ? "text-blue-200" : "text-gray-500"}`}>
                    {plan.description}
                  </p>
                  <div className="flex items-end gap-1">
                    <span className={`text-5xl font-extrabold ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm pb-2 ${plan.highlighted ? "text-blue-200" : "text-gray-500"}`}>
                      /{plan.period}
                    </span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className={`text-lg ${plan.highlighted ? "text-blue-200" : "text-blue-500"}`}>✓</span>
                      <span className={`text-sm ${plan.highlighted ? "text-blue-100" : "text-gray-600"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center font-semibold py-3 rounded-xl transition-all ${
                    plan.highlighted
                      ? "bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4">Ready to transform your workforce management?</h2>
          <p className="text-xl text-blue-200 mb-8">Join thousands of businesses already saving hours every week.</p>
          <Link
            href="/signup"
            className="inline-block bg-white text-blue-600 font-bold px-10 py-4 rounded-xl text-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Get started for free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">CR</span>
              </div>
              <span className="text-white font-bold">ClockRoster</span>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <Link href="/login" className="hover:text-white transition-colors">Sign in</Link>
              <Link href="/signup" className="hover:text-white transition-colors">Sign up</Link>
            </div>
            <p className="text-sm">© {new Date().getFullYear()} ClockRoster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
