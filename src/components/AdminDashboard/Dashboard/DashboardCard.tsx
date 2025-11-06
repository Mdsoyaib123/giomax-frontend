import { FaArrowUp } from "react-icons/fa";
import Patients from "@/assets/Logo/patientss.svg";
import Doctors from "@/assets/Logo/doctors.svg";
import Clinics from "@/assets/Logo/clinics.svg";
import Bookings from "@/assets/Logo/bookings.svg";
import Earnings from "@/assets/Logo/earnings.svg";

const DashboardCard = () => {
  const statusData = [
    {
      title: "Total Patients",
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
      title: "Total Clinics",
      amount: "42",
      change: "3.1",
      unit: "vs last month",
      icon: Clinics,
    },
    {
      title: "Total Bookings",
      amount: "1,234",
      change: "18.7",
      unit: "vs last month",
      icon: Bookings,
    },
    {
      title: "Total Earnings",
      amount: "$87,450",
      change: "24.3",
      unit: "vs last month",
      icon: Earnings,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 w-full">
      {statusData.map((single) => {
        const isNegative = single.change.startsWith("-");
        const changeColor = isNegative ? "#E35A5F" : "#12CC1E";

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

              <div className="flex items-center gap-1 text-sm">
                {single.change && (
                  <>
                    <FaArrowUp
                      className="transition-transform"
                      style={{
                        color: changeColor,
                        transform: isNegative ? "rotate(180deg)" : "none",
                      }}
                    />
                    <span style={{ color: changeColor }}>{single.change}%</span>
                  </>
                )}
                <span className="text-gray-500 ml-1">{single.unit}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCard;
