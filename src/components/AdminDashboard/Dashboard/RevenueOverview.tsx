"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

// ✅ Sample weekly revenue data
const data = [
  { name: "Sunday", uv: 40000 },
  { name: "Monday", uv: 30000 },
  { name: "Tuesday", uv: 25000 },
  { name: "Wednesday", uv: 50000 },
  { name: "Thursday", uv: 75000 },
  { name: "Friday", uv: 100000 },
];

const margin = {
  top: 20,
  right: 20,
  left: 10,
  bottom: 20,
};

export default function RevenueOverview() {
  return (
    <div className="w-full h-[400px] bg-white rounded-2xl shadow-md border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Weekly Revenue Overview
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={margin}>
          <CartesianGrid stroke="#E5E7EB" strokeDasharray="5 5" />
          <XAxis
            dataKey="name"
            stroke="#6B7280"
            tick={{ fontSize: 12 }}
            interval={0}
          />
          <YAxis
            domain={[0, 100000]} // ✅ Start from 0
            ticks={[0, 10000, 25000, 50000, 75000, 100000]}
            stroke="#6B7280"
            tickFormatter={(value: number) => `${value / 1000}k`}
          />
          <Tooltip
            formatter={(value: number) => [`${value / 1000}k`, "Revenue"]}
            contentStyle={{
              borderRadius: "10px",
              borderColor: "#4888FF",
            }}
          />
          <Bar
            dataKey="uv"
            fill="#4888FF"
            barSize={45}
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
