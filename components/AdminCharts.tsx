"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#f43f5e", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

export function DailySignupsChart({ data }: { data: { date: string; count: number }[] }) {
  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
      <h3 className="font-bold text-white mb-4">Inscriptions (7 jours)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }} />
          <Bar dataKey="count" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GenderChart({ data }: { data: { male: number; female: number } }) {
  const chartData = [
    { name: "Hommes", value: data.male },
    { name: "Femmes", value: data.female },
  ];
  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
      <h3 className="font-bold text-white mb-4">Répartition par genre</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-2">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500" /><span className="text-sm text-gray-400">Hommes ({data.male})</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /><span className="text-sm text-gray-400">Femmes ({data.female})</span></div>
      </div>
    </div>
  );
}

export function AgeChart({ data }: { data: Record<string, number> }) {
  const chartData = Object.entries(data).map(([range, count]) => ({ range, count }));
  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
      <h3 className="font-bold text-white mb-4">Répartition par âge</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="range" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }} />
          <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
