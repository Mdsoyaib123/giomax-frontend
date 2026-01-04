import Doctors from "@/assets/bbb.png";
import Clinics from "@/assets/ccc.png";
import { useGetPaymentDataQuery } from "@/redux/features/admin/dashboard/adminDashboardApi";
import { TbCurrencyLari } from "react-icons/tb";

const PaymentCard = () => {
  const { data: paymentData, isLoading } = useGetPaymentDataQuery({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const data = paymentData?.data;

  console.log(data);

  const statusData = [
    {
      title: "Total Transactions",
      amount: `₾ ${data?.allPaymentTransactions ?? 0}`,
      unit: `${data?.allPaymentTransactions ?? 0} transactions`,
      icon: <TbCurrencyLari className="text-green-500" size={30} />,
    },
    {
      title: "Total Paid Out",
      amount: `₾ ${data?.totalPaidAmount ?? 0}`,
      unit: "Completed payments",
      icon: Doctors,
    },
    {
      title: "Payable Amount",
      amount: `₾ ${data?.totalPayableAmount ?? 0}`,
      unit: "Payable payments",
      icon: Clinics,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
      {statusData.map((item) => (
        <div
          key={item.title}
          className="w-full h-48 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          {/* Top */}
          <div className="space-y-2">
            <div className="bg-[#F9F8F6] border border-[#F6F4F2] w-12 h-12 rounded-xl flex items-center justify-center">
              {typeof item.icon === "string" ? (
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-6 h-6 object-contain"
                />
              ) : (
                <div className="w-6 h-6 flex items-center justify-center">
                  {item.icon}
                </div>
              )}
            </div>

            <h1 className="text-lg font-medium text-[#343A40]">{item.title}</h1>
          </div>

          {/* Bottom */}
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-semibold text-black">
              {item.amount}
            </h2>
            <p className="text-sm text-gray-500">{item.unit}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentCard;

// import Patients from "@/assets/aaa.png";
// import Doctors from "@/assets/bbb.png";
// import Clinics from "@/assets/ccc.png";
// import { FaArrowUp } from "react-icons/fa";

// const PaymentCard = () => {
//   const statusData = [
//     {
//       title: "Total Earnings",
//       amount: "$87,450",
//       change: "12.5",
//       unit: "vs last month",
//       showPercentage: true,
//       icon: Patients,
//     },
//     {
//       title: "Total Paid Out",
//       amount: "$8,500",
//       change: "",
//       unit: "5 completed transactions",
//       showPercentage: false,
//       icon: Doctors,
//     },
//     {
//       title: "AAll Payouts",
//       amount: "42",
//       change: "",
//       unit: "2 pending requests",
//       showPercentage: false,
//       icon: Clinics,
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
//       {statusData.map((single) => {
//         const isNegative = single.change && single.change.startsWith("-");
//         const changeColor = isNegative ? "#E35A5F" : "#12CC1E";

//         const isFirstCard = single.title === "Total Earnings";

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

//               {/* UNIT + % SECTION */}
//               <div
//                 className="flex items-center gap-1"
//                 style={{
//                   width: "auto",
//                   height: "16px",
//                   marginTop: "2px",
//                 }}
//               >
//                 {/* % only for first card */}
//                 {isFirstCard && single.showPercentage && (
//                   <>
//                     <FaArrowUp
//                       className="transition-transform"
//                       style={{
//                         color: changeColor,
//                         transform: isNegative ? "rotate(180deg)" : "none",
//                       }}
//                     />
//                     <span
//                       style={{
//                         color: changeColor,
//                         fontFamily: "Arial",
//                         fontWeight: 400,
//                         fontSize: "12px",
//                         lineHeight: "16px",
//                       }}
//                     >
//                       {single.change}%
//                     </span>
//                   </>
//                 )}

//                 {/* Unit text (text color ONLY, NO background) */}
//                 <span
//                   style={{
//                     color: "#6A7282",
//                     fontFamily: "Arial",
//                     fontSize: "12px",
//                     fontWeight: 400,
//                     lineHeight: "16px",
//                     marginTop: "-2px", // slightly higher
//                   }}
//                 >
//                   {single.unit}
//                 </span>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default PaymentCard;
