"use client";

import { useEffect, useState } from "react";

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
  employee: Employee;
}

interface EmployeeSummary {
  id: string;
  name: string;
  totalHours: number;
  grossPay: number;
}

function getWeekBounds() {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const mon = new Date(now);
  mon.setDate(now.getDate() + diff);
  mon.setHours(0, 0, 0, 0);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  sun.setHours(23, 59, 59, 999);
  return {
    start: mon.toISOString().slice(0, 10),
    end: sun.toISOString().slice(0, 10),
  };
}

export default function ReportsPage() {
  const defaultBounds = getWeekBounds();
  const [startDate, setStartDate] = useState(defaultBounds.start);
  const [endDate, setEndDate] = useState(defaultBounds.end);
  const [summaries, setSummaries] = useState<EmployeeSummary[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const start = new Date(startDate + "T00:00:00").toISOString();
      const end = new Date(endDate + "T23:59:59").toISOString();
      const res = await fetch(`/api/shifts?start=${start}&end=${end}`);
      const shifts: Shift[] = await res.json();

      const map: Record<string, EmployeeSummary> = {};
      for (const shift of shifts) {
        const ms =
          new Date(shift.endTime).getTime() -
          new Date(shift.startTime).getTime() -
          shift.breakMinutes * 60000;
        const hours = Math.max(0, ms / 3600000);
        const emp = shift.employee;
        if (!map[emp.id]) {
          map[emp.id] = { id: emp.id, name: emp.name, totalHours: 0, grossPay: 0 };
        }
        map[emp.id].totalHours += hours;
        map[emp.id].grossPay += hours * emp.hourlyRate;
      }
      setSummaries(Object.values(map).sort((a, b) => a.name.localeCompare(b.name)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalHours = summaries.reduce((s, e) => s + e.totalHours, 0);
  const totalPay = summaries.reduce((s, e) => s + e.grossPay, 0);

  const exportCSV = () => {
    const header = "Employee,Total Hours,Gross Pay";
    const rows = summaries.map(
      (e) => `"${e.name}",${e.totalHours.toFixed(2)},${e.grossPay.toFixed(2)}`
    );
    rows.push(`"TOTAL",${totalHours.toFixed(2)},${totalPay.toFixed(2)}`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${startDate}-to-${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 text-sm mt-0.5">Payroll summary by employee</p>
        </div>
        <button
          onClick={exportCSV}
          disabled={summaries.length === 0}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-40"
        >
          ↓ Export CSV
        </button>
      </div>

      {/* Date range */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-end gap-4 flex-wrap">
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
            From
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
            To
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <button
          onClick={fetchReport}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          Generate
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading…</div>
        ) : summaries.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No data for this period.</div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-gray-100">
              <tr>
                {["Employee", "Total Hours", "Gross Pay"].map((h) => (
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
              {summaries.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{emp.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{emp.totalHours.toFixed(1)}h</td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    ${emp.grossPay.toFixed(2)}
                  </td>
                </tr>
              ))}
              {/* Total row */}
              <tr className="bg-gray-50 font-semibold">
                <td className="py-3 px-4 text-sm text-gray-900">Total</td>
                <td className="py-3 px-4 text-sm text-gray-900">{totalHours.toFixed(1)}h</td>
                <td className="py-3 px-4 text-sm text-gray-900">${totalPay.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
