import PendingApprovals from "@/assets/Logo/PendingApprovals.svg";
import ManageTeam from "@/assets/Logo/ManageTeam.svg";
import ProcessPayouts from "@/assets/Logo/ProcessPayouts (2).svg";

const cardDetails = [
  {
    image: PendingApprovals,
    name: "Pending Approvals",
    details: "8 Doctor/clinic requests",
    isDefault: true,
  },

  {
    image: ManageTeam,
    name: "Manage Team",
    details: "Add or remove admins",
    isDefault: false,
  },
  {
    image: ProcessPayouts,
    name: "Process Payouts",
    details: "$12,450 Pending",
    isDefault: false,
  },
];

const QuickActions = () => {
  return (
    <div className=" space-y-6">
      <div className="flex justify-between items-center ">
        {/* Title */}
        <div>
          <h1 className="text-[24px] leading-[130%] font-medium text-[#484848] ">
            Quick Actions
          </h1>
        </div>
      </div>
      <div className="mx-auto rounded-[20px] ">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2  2xl:grid-cols-3 gap-4 sm:gap-6">
          {cardDetails.map((card, index) => (
            <div
              key={index}
              className="bg-[#FFFFFF] p-4 sm:p-6 rounded-xl  border border-[#E6E6E6] relative flex gap-4 items-center"
            >
              <div className="p-3 sm:p-4 bg-[#E9F4F2] rounded-xl aspect-square flex items-center justify-center">
                <img src={card.image} alt="" className="w-6 sm:w-8" />
              </div>
              <div className="flex-1">
                <h1 className="text-base md:text-lg lg:text-xl font-medium">
                  {card.name}
                </h1>
                <p className="text-[#484848] text-sm sm:text-base mt-1 sm:mt-2 max-w-sm">
                  {card.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
