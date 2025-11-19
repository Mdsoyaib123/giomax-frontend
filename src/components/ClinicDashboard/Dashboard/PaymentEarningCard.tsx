import { useState } from "react";
import Patients from "@/assets/Logo/patientss.svg";
import pic from "@/assets/money55.png";
import pic1 from "@/assets/dash55.png";
import pic2 from "@/assets/doller.png";
import WithdrawFunds from "./WithdrawFunds"; // import modal
import SectionTitle from "@/common/SectionTitle";

const PaymentEarningCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusData = [
    { title: "Total Revenue", amount: "$ 12500.00", icon: Patients },
    { title: "Pending Payouts", amount: "$ 4000.00", icon: pic1 },
    { title: "Total Transactions", amount: "$ 120", icon: pic },
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
          className="flex items-center cursor-pointer justify-center gap-2 bg-blue-500 hover:bg-blue-600 
               text-white px-4 py-2.5 rounded-md text-sm font-medium shadow-sm transition
               w-full sm:w-auto"
        >
          <img src={pic2} alt="" className="w-5 h-5" />
          Withdraw Funds
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
        {statusData.map((single) => (
          <div
            key={single.title}
            className="w-full h-48 p-6 bg-white rounded-2xl flex flex-col justify-between shadow-sm space-y-4 transition-all hover:shadow-md"
          >
            <div className="space-y-2">
              <div className="bg-[#F9F8F6] border border-[#F6F4F2] w-12 h-12 rounded-xl p-3 flex items-center justify-center">
                <img
                  src={single.icon}
                  alt={single.title}
                  className="w- h-8 object-contain "
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentEarningCard;
