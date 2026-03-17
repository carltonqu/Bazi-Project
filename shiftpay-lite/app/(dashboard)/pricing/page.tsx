import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/stripe";
import { SubscribeButton } from "@/components/billing/subscribe-button";
import { redirect } from "next/navigation";

export default async function PricingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });

  const currentPlan = user?.subscription?.plan ?? "FREE";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Choose your plan</h1>
        <p className="text-gray-500 text-lg">
          You&apos;re currently on the{" "}
          <span className="font-semibold text-blue-600">{currentPlan}</span> plan.
          {currentPlan !== "FREE" && " Manage your subscription below."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {(Object.entries(PLANS) as [keyof typeof PLANS, (typeof PLANS)[keyof typeof PLANS]][]).map(([key, plan]) => {
          const isCurrent = currentPlan === key;
          const isHighlighted = key === "PRO";

          return (
            <div
              key={key}
              className={`relative rounded-2xl p-6 flex flex-col ${
                isHighlighted
                  ? "bg-blue-600 text-white shadow-2xl shadow-blue-500/20 scale-105"
                  : isCurrent
                  ? "bg-white border-2 border-blue-400 shadow-md"
                  : "bg-white border border-gray-200 shadow-sm"
              }`}
            >
              {isHighlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                    MOST POPULAR
                  </span>
                </div>
              )}
              {isCurrent && !isHighlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    CURRENT PLAN
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className={`text-xl font-bold mb-1 ${isHighlighted ? "text-white" : "text-gray-900"}`}>
                  {plan.name}
                </h2>
                <p className={`text-sm mb-4 ${isHighlighted ? "text-blue-200" : "text-gray-500"}`}>
                  {plan.description}
                </p>
                <div className="flex items-end gap-1">
                  <span className={`text-4xl font-extrabold ${isHighlighted ? "text-white" : "text-gray-900"}`}>
                    {plan.price === 0 ? "Free" : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className={`text-sm pb-1 ${isHighlighted ? "text-blue-200" : "text-gray-500"}`}>
                      /month
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {[...plan.features].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className={`text-sm ${isHighlighted ? "text-blue-200" : "text-blue-500"}`}>✓</span>
                    <span className={`text-sm ${isHighlighted ? "text-blue-100" : "text-gray-600"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <SubscribeButton
                priceId={plan.priceId}
                planName={plan.name}
                isCurrent={isCurrent}
                isFree={key === "FREE"}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-10 text-center text-sm text-gray-500">
        <p>All plans include SSL security, 99.9% uptime SLA, and 24/7 monitoring.</p>
        <p className="mt-1">
          Questions? <a href="mailto:support@clockroster.com" className="text-blue-600 hover:underline">Contact support</a>
        </p>
      </div>
    </div>
  );
}
