"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface PaySettings {
  overtimeThresholdHours: number;
  overtimeMultiplier: number;
  nightStartHour: number;
  nightEndHour: number;
  nightMultiplier: number;
  holidayMultiplier: number;
  currency: string;
}

const defaultSettings: PaySettings = {
  overtimeThresholdHours: 40,
  overtimeMultiplier: 1.5,
  nightStartHour: 22,
  nightEndHour: 6,
  nightMultiplier: 1.2,
  holidayMultiplier: 2.0,
  currency: "USD",
};

export default function SettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<PaySettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings/pay-rules")
      .then((r) => r.json())
      .then((data) => {
        setSettings({
          overtimeThresholdHours: data.overtimeThresholdHours,
          overtimeMultiplier: data.overtimeMultiplier,
          nightStartHour: data.nightStartHour,
          nightEndHour: data.nightEndHour,
          nightMultiplier: data.nightMultiplier,
          holidayMultiplier: data.holidayMultiplier,
          currency: data.currency,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const set = (field: keyof PaySettings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: field === "currency" ? value : parseFloat(value) || 0,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/settings/pay-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const user = session?.user;

  const planColors: Record<string, string> = {
    FREE: "bg-gray-100 text-gray-700",
    PRO: "bg-blue-100 text-blue-700",
    ADVANCED: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Configure pay rules and account settings</p>
      </div>

      {/* Pay Rules */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-5">Pay Rules</h2>

        {loading ? (
          <div className="text-gray-400 text-sm">Loading…</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            {saved && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
                ✅ Settings saved successfully!
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                  Overtime Threshold (hrs/week)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={settings.overtimeThresholdHours}
                  onChange={(e) => set("overtimeThresholdHours", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                  Overtime Multiplier (×)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={settings.overtimeMultiplier}
                  onChange={(e) => set("overtimeMultiplier", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                  Night Start Hour (0–23)
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={settings.nightStartHour}
                  onChange={(e) => set("nightStartHour", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                  Night End Hour (0–23)
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={settings.nightEndHour}
                  onChange={(e) => set("nightEndHour", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                  Night Multiplier (×)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={settings.nightMultiplier}
                  onChange={(e) => set("nightMultiplier", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                  Holiday Multiplier (×)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={settings.holidayMultiplier}
                  onChange={(e) => set("holidayMultiplier", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                Currency
              </label>
              <input
                value={settings.currency}
                onChange={(e) => set("currency", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="USD"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Pay Rules"}
            </button>
          </form>
        )}
      </div>

      {/* Account */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-5">Account</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {user?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt="avatar" className="w-12 h-12 rounded-full" />
            )}
            <div>
              <p className="font-semibold text-gray-900">{user?.name ?? "—"}</p>
              <p className="text-sm text-gray-500">{user?.email ?? "—"}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Plan</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                planColors["FREE"]
              }`}
            >
              FREE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
