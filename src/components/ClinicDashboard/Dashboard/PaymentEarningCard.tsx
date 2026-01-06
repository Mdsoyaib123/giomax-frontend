import { useState } from "react";
import Patients from "@/assets/Logo/patientss.svg";
import pic from "@/assets/money55.png";
import pic1 from "@/assets/dash55.png";
import pic2 from "@/assets/doller.png";
import WithdrawFunds from "./WithdrawFunds"; // import modal
import SectionTitle from "@/common/SectionTitle";
import { useSingleClinicId } from "@/hooks/userClinicId";
import { useGetClinicPaymentsOverviewQuery } from "@/redux/features/admin/payment/clinicPaymentsApi";

const PaymentEarningCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { clinicId, isLoading: isClinicIdLoading } = useSingleClinicId();
  const { data, isLoading, isError } = useGetClinicPaymentsOverviewQuery(
    clinicId as string,
    {
      skip: !clinicId,
    }
  );

  // Format currency with commas and 2 decimal places
  const formatCurrency = (amount: number) => {
    return `₾ ${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Status data using API response
  const statusData = [
    {
      title: "Pending Payouts",
      amount: data?.data?.clinicPendingMoney
        ? formatCurrency(data.data.clinicPendingMoney)
        : "₾ 0.00",
      icon: pic1,
    },
    {
      title: "Total Withdrawn",
      amount: data?.data?.clinicTotalWithdrew
        ? formatCurrency(data.data.clinicTotalWithdrew)
        : "₾ 0.00",
      icon: pic,
    },
    {
      title: "Total Transactions",
      amount: data?.data?.totalTransactions
        ? formatNumber(data.data.totalTransactions)
        : "₾ 0",
      icon: Patients,
    },
  ];

  // Calculate total revenue (pending + withdrawn)
  const totalRevenue =
    (data?.data?.clinicPendingMoney || 0) +
    (data?.data?.clinicTotalWithdrew || 0);

  // Add total revenue as the first card if needed
  const allStatusData = [
    {
      title: "Total Revenue",
      amount: formatCurrency(totalRevenue),
      icon: pic,
    },
    ...statusData,
  ];

  return (
    <div>
      {/* Modal */}
      <WithdrawFunds
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
        <div>
          <SectionTitle
            title="Payment & Earnings"
            description="Manage your clinic's financial transactions"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          // disabled={
          //   !data?.data?.clinicPendingMoney || data.data.clinicPendingMoney <= 0
          // }
          className={`flex bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed items-center cursor-pointer justify-center gap-2 
        
            text-white px-4 py-2.5 rounded-md text-sm font-medium shadow-sm transition
            w-full sm:w-auto`}
        >
          <img src={pic2} alt="" className="w-5 h-5" />
          Withdraw Funds
        </button>
      </div>

      {/* Loading state */}
      {isLoading || isClinicIdLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5 w-full">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-full h-48 p-6 bg-white rounded-2xl flex flex-col justify-between shadow-sm space-y-4 animate-pulse"
            >
              <div className="space-y-2">
                <div className="bg-gray-200 w-12 h-12 rounded-xl"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Failed to load payment data. Please try again.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5 w-full">
          {allStatusData.map((single) => (
            <div
              key={single.title}
              className="w-full h-48 p-6 bg-white rounded-2xl flex flex-col justify-between shadow-sm space-y-4 transition-all hover:shadow-md"
            >
              <div className="space-y-2">
                <div className="bg-[#F9F8F6] border border-[#F6F4F2] w-12 h-12 rounded-xl p-3 flex items-center justify-center">
                  <img
                    src={single.icon}
                    alt={single.title}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <h1
                  className="text-lg leading-[160%] font-medium"
                  style={{ color: "#343A40" }}
                >
                  {single.title}
                </h1>
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-black">
                  {single.amount}
                </h2>
                {single.title === "Total Transactions" && (
                  <p className="text-sm text-gray-500">
                    Total completed transactions
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentEarningCard;
