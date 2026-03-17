"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Employee {
  id: string;
  name: string;
}

export default function NewShiftPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    employeeId: "",
    date: new Date().toISOString().slice(0, 10),
    startTime: "09:00",
    endTime: "17:00",
    breakMinutes: "0",
    isHoliday: false,
    note: "",
  });

  useEffect(() => {
    fetch("/api/employees")
      .then((r) => r.json())
      .then((data) => {
        setEmployees(data);
        if (data.length > 0) setForm((f) => ({ ...f, employeeId: data[0].id }));
      });
  }, []);

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const startTime = new Date(`${form.date}T${form.startTime}:00`).toISOString();
      const endTime = new Date(`${form.date}T${form.endTime}:00`).toISOString();
      await fetch("/api/shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: form.employeeId,
          startTime,
          endTime,
          breakMinutes: parseInt(form.breakMinutes) || 0,
          isHoliday: form.isHoliday,
          note: form.note || null,
        }),
      });
      router.push("/dashboard/schedule");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Shift</h1>
        <p className="text-gray-500 text-sm mt-0.5">Schedule a new shift</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
            Employee <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={form.employeeId}
            onChange={(e) => set("employeeId", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {employees.length === 0 && <option value="">No employees yet</option>}
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="date"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => set("startTime", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
              End Time
            </label>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => set("endTime", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
            Break (minutes)
          </label>
          <input
            type="number"
            min="0"
            value={form.breakMinutes}
            onChange={(e) => set("breakMinutes", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isHoliday"
            checked={form.isHoliday}
            onChange={(e) => set("isHoliday", e.target.checked)}
            className="rounded"
          />
          <label htmlFor="isHoliday" className="text-sm text-gray-700 font-medium">
            Holiday shift 🎉
          </label>
        </div>

        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
            Note (optional)
          </label>
          <textarea
            value={form.note}
            onChange={(e) => set("note", e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            placeholder="Any notes for this shift…"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || !form.employeeId}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Add Shift"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
