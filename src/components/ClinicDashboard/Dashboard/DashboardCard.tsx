import { FaArrowUp } from "react-icons/fa";
import Patients from "@/assets/Logo/patientss.svg";
import Doctors from "@/assets/Logo/doctors.svg";
import Bookings from "@/assets/Logo/bookings.svg";
import Rating from "@/assets/Logo/Ratings.svg";
import Revenue from "@/assets/Logo/Revenue.svg";

const DashboardCard = () => {
  const statusData = [
    {
      title: "Total Patientsdgdfgdf",
      amount: "120",
      change: "12.5",
      unit: "vs last month",
      icon: Patients,
    },
    {
      title: "Total Doctors",
      amount: "156",
      change: "8.2",
      unit: "vs last month",
      icon: Doctors,
    },
    {
      title: "Average Ratings",
      amount: "4.9",
      change: "3.1",
      unit: "vs last month",
      icon: Rating,
    },
    {
      title: "Total Bookings",
      amount: "1,234",
      change: "18.7",
      unit: "vs last month",
      icon: Bookings,
    },
    {
      title: "Monthly Revenue",
      amount: "$87,450",
      change: "24.3",
      unit: "vs last month",
      icon: Revenue,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
      {statusData.map((single) => {
        const isNegative = single.change.startsWith("-");
        const changeColor = isNegative ? "#E35A5F" : "#12CC1E";

        return (
          <div
            key={single.title}
            className="bg-white shadow-sm hover:shadow-md transition-all rounded-2xl border border-[#E5E7EB] p-6 flex flex-col"
          >
            {/* Icon */}
            <div className="bg-[#F9FAFB] w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <img src={single.icon} alt={single.title} className="w-6 h-6" />
            </div>

            {/* Title */}
            <h3 className="text-[#6B7280] text-sm font-normal mb-2">
              {single.title}
            </h3>

            {/* Amount */}
            <h2 className="text-[#111827] text-3xl font-semibold mb-3">
              {single.amount}
            </h2>

            {/* Change Stats - Single Line */}
            <div className="flex items-center gap-1 mt-2 pb-2">
              {single.change && (
                <>
                  <FaArrowUp
                    className="w-3 h-3"
                    style={{
                      color: changeColor,
                      transform: isNegative ? "rotate(180deg)" : "none",
                    }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{
                      color: changeColor,
                    }}
                  >
                    +{single.change}%
                  </span>
                </>
              )}

              <span className="text-xs text-[#6B7280] ml-0.5 ">
                {single.unit}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCard;

// import { FaArrowUp } from "react-icons/fa";
// import Patients from "@/assets/Logo/patientss.svg";
// import Doctors from "@/assets/Logo/doctors.svg";
// // import Clinics from "@/assets/Logo/clinics.svg";
// import Bookings from "@/assets/Logo/bookings.svg";
// import Earnings from "@/assets/Logo/earnings.svg";
// import dash from "@/assets/Dashboard (1).png"
// const DashboardCard = () => {
//   const statusData = [
//     {
//       title: "Total Patients",
//       amount: "120",
//       change: "12.5",
//       unit: "vs last month",
//       icon: Patients,
//     },
//     {
//       title: "Total Doctors",
//       amount: "156",
//       change: "8.2",
//       unit: "vs last month",
//       icon: Doctors,
//     },
//     {
//       title: "Average Ratings",
//       amount: "4.9",
//       change: "3.1",
//       unit: "vs last month",
//       icon: dash,
//     },
//     {
//       title: "Total Bookings",
//       amount: "1,234",
//       change: "18.7",
//       unit: "vs last month",
//       icon: Bookings,
//     },
//     {
//       title: "Monthly Revenue",
//       amount: "$85,450",
//       change: "24.3",
//       unit: "vs last month",
//       icon: Earnings,
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 w-full">
//       {statusData.map((single) => {
//         const isNegative = single.change.startsWith("-");
//         const changeColor = isNegative ? "#E35A5F" : "#12CC1E";

//         return (
//           <div
//             key={single.title}
//             className="w-full h-48 p-6 bg-white rounded-2xl flex flex-col justify-between shadow-sm space-y-4 transition-all hover:shadow-md"
//           >
//             {/* Top Section */}
//             <div className="space-y-2">
//               <div className="bg-[#F9F8F6] border border-[#F6F4F2] w-12 h-12 rounded-xl p-3 flex items-center justify-center">
//                 <img
//                   src={single.icon}
//                   alt={single.title}
//                   className="w-6 h-6 object-contain"
//                 />
//               </div>

//               <h1
//                 className="text-lg leading-[160%] font-medium"
//                 style={{ color: "#343A40" }}
//               >
//                 {single.title}
//               </h1>
//             </div>

//             {/* Bottom Section */}
//             <div className="space-y-1">
//               <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-black">
//                 {single.amount}
//               </h2>

//               <div className="flex items-center gap-1 text-sm">
//                 {single.change && (
//                   <>
//                     <FaArrowUp
//                       className="transition-transform"
//                       style={{
//                         color: changeColor,
//                         transform: isNegative ? "rotate(180deg)" : "none",
//                       }}
//                     />
//                     <span style={{ color: changeColor }}>{single.change}%</span>
//                   </>
//                 )}
//                 <span className="text-gray-500 ml-1">{single.unit}</span>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default DashboardCard;
