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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function ClinicRevenueOverview() {
  return (
    <div className="w-full h-[500px] bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-2 sm:mb-9 xl:sm:mb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 w-full">
        <div className="w-full md:flex-1">
          <h1 className="text-[24px] leading-[130%] font-medium text-[#343A40] mb-2">
            Revenue Overview
          </h1>
        </div>

        <div className="w-full sm:w-[250px] md:w-[221px]">
          <Select
            // onValueChange={(value) => setSelectedFilter(value)}
            defaultValue="week"
          >
            <SelectTrigger className="w-full h-10 border border-[#B3B3B3] rounded-xl px-5 py-2.5 bg-[#FCFCFC] text-[#484848] text-sm flex items-center justify-between hover:border-gray-400 transition-all duration-200 cursor-pointer">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>

            <SelectContent className="bg-white border border-[#B3B3B3] rounded-md shadow-md">
              <SelectGroup>
                <SelectLabel className="px-4 pt-2 text-gray-500 text-sm">
                  Time Range
                </SelectLabel>
                <SelectItem
                  value="week"
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
                >
                  Last 1 Week
                </SelectItem>
                <SelectItem
                  value="month"
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
                >
                  Last 1 Month
                </SelectItem>
                <SelectItem
                  value="threeMonths"
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
                >
                  Last 3 Months
                </SelectItem>
                <SelectItem
                  value="sixMonths"
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
                >
                  Last 6 Months
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="80%">
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
