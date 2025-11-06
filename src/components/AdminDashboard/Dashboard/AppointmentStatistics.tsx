import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { ChevronDown } from "lucide-react";

const AppointmentStatistics = () => {
  const [selectedFilter, setSelectedFilter] = useState("week");

  // ✅ Fixed day-wise categories
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // ✅ Chart Data (All filters use day-wise categories)
  const chartData: Record<
    string,
    { label: string; data: number[]; categories: string[] }
  > = {
    week: {
      label: "Last 1 Week",
      data: [60, 150, 230, 310, 420, 480, 500],
      categories: days,
    },
    month: {
      label: "Last 1 Month",
      data: [80, 170, 260, 330, 410, 470, 490],
      categories: days,
    },
    threeMonths: {
      label: "Last 3 Months",
      data: [100, 190, 280, 350, 440, 480, 510],
      categories: days,
    },
    sixMonths: {
      label: "Last 6 Months",
      data: [120, 210, 300, 380, 450, 490, 520],
      categories: days,
    },
  };

  const currentData = chartData[selectedFilter];

  // ✅ Apex Chart Options
  const options: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: ["#4CA7E8"],
    },
    xaxis: {
      categories: currentData.categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#6B7280" } },
    },
    yaxis: {
      min: 0,
      max: 500,
      tickAmount: 5,
      labels: {
        formatter: (val) => `${Math.round(val)}+`,
        style: { colors: "#6B7280" },
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => `${val} Bookings`,
      },
    },
    colors: ["#4CA7E8"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
        colorStops: [
          { offset: 0, color: "#4CA7E8", opacity: 0.4 },
          { offset: 90, color: "#4CA7E8", opacity: 0.1 },
          { offset: 100, color: "#4CA7E8", opacity: 0 },
        ],
      },
    },
  };

  return (
    <div className="w-full max-w-[748px] h-full bg-white p-6 rounded-xl shadow">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 w-full">
        <div className="w-full md:flex-1">
          <h1 className="text-[24px] leading-[130%] font-medium text-[#343A40] mb-2">
            Appointment Statistics
          </h1>
          <p className="text-sm text-gray-500">{currentData.label}</p>
        </div>

        <div className="w-full sm:w-[250px] md:w-[221px]">
          <Select
            onValueChange={(value) => setSelectedFilter(value)}
            defaultValue="week"
          >
            <SelectTrigger className="w-full h-[48px] border border-[#B3B3B3] rounded-[12px] px-[20px] py-[10px] bg-[#FCFCFC] text-[#484848] text-sm flex items-center justify-between hover:border-gray-400 transition-all duration-200 cursor-pointer">
              <SelectValue placeholder="Select Range" />
              <ChevronDown className="w-4 h-4 ml-auto text-gray-500" />
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

      <ReactApexChart
        options={options}
        series={[{ name: "Bookings", data: currentData.data }]}
        type="area"
        height={350}
      />
    </div>
  );
};

export default AppointmentStatistics;

// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { useState } from "react";
// import ReactApexChart from "react-apexcharts";
// import type { ApexOptions } from "apexcharts";
// import { ChevronDown } from "lucide-react";

// const AppointmentStatistics = () => {
//   const [selectedFilter, setSelectedFilter] = useState("6");

//   const chartData: Record<string, { data: number[]; categories: string[] }> = {
//     "1": { data: [35], categories: ["Jun"] },
//     "2": { data: [30, 35], categories: ["May", "Jun"] },
//     "3": { data: [25, 30, 35], categories: ["Apr", "May", "Jun"] },
//     "6": {
//       data: [5, 12, 20, 25, 30, 35],
//       categories: [
//         "Sunday",
//         "Monday",
//         "Tuesday",
//         "Wednesday",
//         "Thursday",
//         "Friday",
//         "Saturday",
//       ],
//     },
//   };

//   const currentData = chartData[selectedFilter];

//   const options: ApexOptions = {
//     chart: {
//       type: "area",
//       toolbar: { show: false },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     stroke: {
//       curve: "smooth",
//       width: 2,
//     },
//     xaxis: {
//       categories: currentData.categories,
//       axisBorder: { show: true },
//       axisTicks: { show: true },
//     },
//     yaxis: {
//       min: 5,
//       max: 35,
//       tickAmount: 6,
//       forceNiceScale: false,
//       labels: {
//         formatter: (val) => {
//           const rounded = Math.round(val);
//           return `$${rounded}K`;
//         },
//       },
//     },
//     tooltip: { enabled: false },
//     legend: { show: false },
//     grid: {
//       borderColor: "#e7e7e7",
//       row: {
//         colors: ["#f3f3f3", "transparent"],
//         opacity: 0.5,
//       },
//     },
//     colors: ["#A5DBF3"],
//     fill: {
//       type: "gradient",
//       gradient: {
//         shadeIntensity: 1,
//         opacityFrom: 0.4,
//         opacityTo: 0,
//         stops: [0, 90, 100],
//         colorStops: [
//           { offset: 0, color: "#A5DBF3", opacity: 0.4 },
//           { offset: 90, color: "#A5DBF3", opacity: 0.1 },
//           { offset: 100, color: "#A5DBF3", opacity: 0 },
//         ],
//       },
//     },
//   };

//   return (
//     <div className="w-full max:w-[748px] h-full max:h-[555px] bg-white p-6 rounded-xl shadow">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8 lg:gap-12 mb-8 w-full">
//         {/* <div className="flex flex-col sm:flex-row md:flex-row justify-between items-start md:items-center gap-4 md:gap-8 mb-8 w-full"></div> */}
//         <div className="w-full md:flex-1">
//           <h1 className="text-[24px] leading-[130%] font-medium text-[#484848] mb-4">
//             Appointment Statistics
//           </h1>
//         </div>

//         <div className="w-full sm:w-[250px] md:w-[221px]">
//           <Select
//             onValueChange={(value) => setSelectedFilter(value)}
//             defaultValue="6"
//           >
//             <SelectTrigger className="w-full h-[48px] border border-[#B3B3B3] rounded-[12px] px-[20px] py-[10px] bg-[#FCFCFC] text-[#484848] text-sm flex items-center justify-between hover:border-gray-400 transition-all duration-200 cursor-pointer">
//               <SelectValue placeholder="Last 1 Week" />
//               <ChevronDown className="w-4 h-4 ml-auto text-gray-500" />
//             </SelectTrigger>

//             <SelectContent className="bg-white border border-[#B3B3B3] rounded-md shadow-md">
//               <SelectGroup>
//                 <SelectLabel className="px-4 pt-2 text-gray-500 text-sm">
//                   Last 1 Week
//                 </SelectLabel>
//                 <SelectItem
//                   value="1"
//                   className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
//                 >
//                   Last 1 Week
//                 </SelectItem>
//                 <SelectItem
//                   value="2"
//                   className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
//                 >
//                   Last 1 Week
//                 </SelectItem>
//                 <SelectItem
//                   value="3"
//                   className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
//                 >
//                   Last 1 Week
//                 </SelectItem>
//                 <SelectItem
//                   value="6"
//                   className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
//                 >
//                   Last 1 Week
//                 </SelectItem>
//               </SelectGroup>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <ReactApexChart
//         options={options}
//         series={[{ data: currentData.data }]}
//         type="area"
//         height={350}
//       />
//     </div>
//   );
// };

// export default AppointmentStatistics;
