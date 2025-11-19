import { AiOutlineDollar } from "react-icons/ai";

const PayCard = () => {
  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
        {/* Card 1 */}
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#CED4DA] shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-gray-900">
              {" "}
              <AiOutlineDollar className=" inline-block mr-2 text-[#2E6FF3]" />
              PAY001
            </span>
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-[#1D4ED8] text-white">
              Paid
            </span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700">Doctor: Dr. Michael Brown</span>
            <span className="text-gray-500">Date: 15-10-2025</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Amount: $150</span>
            <span className="text-gray-500">Method: Credit Card</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#CED4DA] shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-gray-900">
              <AiOutlineDollar className=" inline-block mr-2 text-[#2E6FF3]" />
              PAY002
            </span>

            <span className="px-3 py-1 text-sm font-medium rounded-full bg-[#1D4ED8] text-white">
              Paid
            </span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700">Doctor: Dr. Sarah Lee</span>
            <span className="text-gray-500">Date: 28-09-2025</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Amount: $200</span>
            <span className="text-gray-500">Method: PayPal</span>
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#CED4DA] shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-gray-900">
              <AiOutlineDollar className=" inline-block mr-2 text-[#2E6FF3]" />
              PAY002
            </span>
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-[#1D4ED8] text-white">
              Paid
            </span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700">Doctor: Dr. Sarah Lee</span>
            <span className="text-gray-500">Date: 28-09-2025</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Amount: $200</span>
            <span className="text-gray-500">Method: PayPal</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#CED4DA] shadow-sm hover:shadow-md transition-shadow duration-200 sm:col-span-1 lg:col-span-1">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-gray-900">
              <AiOutlineDollar className=" inline-block mr-2 text-[#2E6FF3]" />
              PAY003
            </span>
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-[#1B9268] text-white">
              Pending
            </span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700">Doctor: Dr. John Doe</span>
            <span className="text-gray-500">Date: 05-10-2025</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Amount: $180</span>
            <span className="text-gray-500">Method: Credit Card</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayCard;
