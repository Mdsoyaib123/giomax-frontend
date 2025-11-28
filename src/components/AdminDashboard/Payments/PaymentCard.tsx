import Patients from "@/assets/aaa.png";
import Doctors from "@/assets/bbb.png";
import Clinics from "@/assets/ccc.png";
import { FaArrowUp } from "react-icons/fa";

const PaymentCard = () => {
  const statusData = [
    {
      title: "Total Earnings",
      amount: "$87,450",
      change: "12.5",
      unit: "vs last month",
      showPercentage: true,
      icon: Patients,
    },
    {
      title: "Total Paid Out",
      amount: "$8,500",
      change: "",
      unit: "5 completed transactions",
      showPercentage: false,
      icon: Doctors,
    },
    {
      title: "Pending Payoutss",
      amount: "42",
      change: "",
      unit: "2 pending requests",
      showPercentage: false,
      icon: Clinics,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
      {statusData.map((single) => {
        const isNegative =
          single.change && single.change.startsWith("-");
        const changeColor = isNegative ? "#E35A5F" : "#12CC1E";

        const isFirstCard = single.title === "Total Earnings";

        return (
          <div
            key={single.title}
            className="w-full h-48 p-6 bg-white rounded-2xl flex flex-col justify-between shadow-sm space-y-4 transition-all hover:shadow-md"
          >
            {/* Top Section */}
            <div className="space-y-2">
              <div className="bg-[#F9F8F6] border border-[#F6F4F2] w-12 h-12 rounded-xl p-3 flex items-center justify-center">
                <img
                  src={single.icon}
                  alt={single.title}
                  className="w-6 h-6 object-contain"
                />
              </div>

              <h1
                className="text-lg leading-[160%] font-medium"
                style={{ color: "#343A40" }}
              >
                {single.title}
              </h1>
            </div>

            {/* Bottom Section */}
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-black">
                {single.amount}
              </h2>

              {/* UNIT + % SECTION */}
              <div
                className="flex items-center gap-1"
                style={{
                  width: "auto",
                  height: "16px",
                  marginTop: "2px",
                }}
              >
                {/* % only for first card */}
                {isFirstCard && single.showPercentage && (
                  <>
                    <FaArrowUp
                      className="transition-transform"
                      style={{
                        color: changeColor,
                        transform: isNegative ? "rotate(180deg)" : "none",
                      }}
                    />
                    <span
                      style={{
                        color: changeColor,
                        fontFamily: "Arial",
                        fontWeight: 400,
                        fontSize: "12px",
                        lineHeight: "16px",
                      }}
                    >
                      {single.change}%
                    </span>
                  </>
                )}

                {/* Unit text (text color ONLY, NO background) */}
                <span
                  style={{
                    color: "#6A7282",
                    fontFamily: "Arial",
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: "16px",
                    marginTop: "-2px", // slightly higher
                  }}
                >
                  {single.unit}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PaymentCard;
