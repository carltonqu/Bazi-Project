"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface Employee {
  id: string;
  name: string;
  hourlyRate: number;
}

interface Shift {
  id: string;
  employeeId: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  isHoliday: boolean;
  note: string | null;
  status: string;
  employee: Employee;
}

function getWeekBounds(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day; // Mon start
  const mon = new Date(d);
  mon.setDate(d.getDate() + diff);
  mon.setHours(0, 0, 0, 0);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  sun.setHours(23, 59, 59, 999);
  return { start: mon, end: sun };
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}
function calcHours(start: string, end: string, breakMin: number) {
  const ms = new Date(end).getTime() - new Date(start).getTime() - breakMin * 60000;
  return (ms / 3600000).toFixed(1);
}

const statusStyle: Record<string, string> = {
  SCHEDULED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export default function SchedulePage() {
  const [weekRef, setWeekRef] = useState(new Date());
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  const { start, end } = getWeekBounds(weekRef);

  const fetchShifts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/shifts?start=${start.toISOString()}&end=${end.toISOString()}`
      );
      setShifts(await res.json());
    } finally {
      setLoading(false);
    }
  }, [start.toISOString(), end.toISOString()]);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  const prevWeek = () => {
    const d = new Date(weekRef);
    d.setDate(d.getDate() - 7);
    setWeekRef(d);
  };
  const nextWeek = () => {
    const d = new Date(weekRef);
    d.setDate(d.getDate() + 7);
    setWeekRef(d);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this shift?")) return;
    await fetch(`/api/shifts/${id}`, { method: "DELETE" });
    fetchShifts();
  };

  const weekLabel = `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-500 text-sm mt-0.5">Weekly shift overview</p>
        </div>
        <Link
          href="/dashboard/schedule/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          + Add Shift
        </Link>
      </div>

      {/* Week navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={prevWeek}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          ← Prev
        </button>
        <span className="text-sm font-semibold text-gray-700">{weekLabel}</span>
        <button
          onClick={nextWeek}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          Next →
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading…</div>
        ) : shifts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 text-sm">No shifts this week.</p>
            <Link
              href="/dashboard/schedule/new"
              className="mt-3 inline-block text-blue-600 hover:underline text-sm font-medium"
            >
              Add a shift →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="border-b border-gray-100">
                <tr>
                  {["Employee", "Date", "Start", "End", "Break", "Hours", "Holiday", "Status", ""].map((h) => (
                    <th
                      key={h}
                      className="text-xs text-gray-400 uppercase tracking-wider font-semibold py-3 px-4 text-left"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {shifts.map((shift) => (
                  <tr key={shift.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{shift.employee.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{fmtDate(shift.startTime)}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{fmtTime(shift.startTime)}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{fmtTime(shift.endTime)}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{shift.breakMinutes}m</td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {calcHours(shift.startTime, shift.endTime, shift.breakMinutes)}h
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {shift.isHoliday ? "🎉" : "—"}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          statusStyle[shift.status] ?? statusStyle.SCHEDULED
                        }`}
                      >
                        {shift.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <button
                        onClick={() => handleDelete(shift.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-1.5 rounded-lg text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
