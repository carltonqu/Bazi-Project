"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Employee {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  hourlyRate: number;
  status: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();
      setEmployees(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this employee?")) return;
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    fetchEmployees();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your workforce</p>
        </div>
        <Link
          href="/dashboard/employees/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          + Add Employee
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading…</div>
        ) : employees.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 text-sm">No employees yet.</p>
            <Link
              href="/dashboard/employees/new"
              className="mt-3 inline-block text-blue-600 hover:underline text-sm font-medium"
            >
              Add your first employee →
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-gray-100">
              <tr>
                {["Name", "Role", "Hourly Rate", "Status", "Actions"].map((h) => (
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
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div className="font-medium text-gray-900">{emp.name}</div>
                    {emp.email && <div className="text-xs text-gray-400">{emp.email}</div>}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{emp.role}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    ${emp.hourlyRate.toFixed(2)}/hr
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                        emp.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-1.5 rounded-lg text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
