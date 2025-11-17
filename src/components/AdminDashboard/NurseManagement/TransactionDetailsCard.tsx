import Patients from "@/assets/Logo/patientss.svg";
import Bookings from "@/assets/Logo/bookings.svg";
import Earnings from "@/assets/Logo/earnings.svg";

const TransactionDetailsCard = () => {
  const statusData = [
    {
      title: "Total Transactions",
      amount: "120",
      icon: Patients,
    },
    {
      title: "Total Paid",
      amount: "$470.00",
      icon: Bookings,
    },
    {
      title: "Total Paid",
      amount: "$87,450",
      icon: Earnings,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
      {statusData.map((single) => (
        <div
          key={single.title}
          className="w-full h-48 p-6 bg-white rounded-2xl flex flex-col justify-between shadow-sm space-y-4 transition-all hover:shadow-md"
        >
          {/* Top Section */}
          <div className="space-y-2">
            <div className="bg-[#F9F8F6] border border-[#CED4DA] w-12 h-12 rounded-xl p-3 flex items-center justify-center">
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
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-black">
            {single.amount}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default TransactionDetailsCard;
