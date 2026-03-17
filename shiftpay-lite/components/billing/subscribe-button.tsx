"use client";

import { useState } from "react";
import { toast } from "sonner";

interface SubscribeButtonProps {
  priceId: string | null;
  planName: string;
  isCurrent?: boolean;
  isFree?: boolean;
}

export function SubscribeButton({ priceId, planName, isCurrent = false, isFree = false }: SubscribeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (isCurrent) {
    return (
      <button
        disabled
        className="w-full py-3 rounded-xl font-semibold text-sm bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200"
      >
        ✓ Current Plan
      </button>
    );
  }

  if (isFree) {
    return (
      <button
        disabled
        className="w-full py-3 rounded-xl font-semibold text-sm bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200"
      >
        Free Plan
      </button>
    );
  }

  const handleSubscribe = async () => {
    if (!priceId) {
      toast.error("This plan is not yet available.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Failed to create checkout session");
      }

      const data = await res.json() as { url?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={isLoading}
      className="w-full py-3 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <>
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Redirecting...
        </>
      ) : (
        `Upgrade to ${planName}`
      )}
    </button>
  );
}
