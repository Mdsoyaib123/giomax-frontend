import SectionTitle from "@/common/SectionTitle";
import ClinicPaymentCard from "./ClinicPaymentCard";
import ClinicPaymentTable from "./ClinicPaymentTable";
import { GoDownload } from "react-icons/go";

const PaymentHistoryClinic = () => {
  return (
    <div className="space-y-10">
      <div className=" flex justify-between items-center">
        <div>
          <SectionTitle
            title="Payment History"
            description="View all payment transactions for this patient"
          />
        </div>
        <button className="px-5 cursor-pointer py-3.5 bg-[#EFF4FF] text-black font-medium rounded-lg  border border-[#6293F6] hover:bg-[#2E6FF3]">
          <GoDownload className=" inline-block mr-2 h-[18px] w-[18px]" />{" "}
          Download CSV
        </button>
      </div>
      <div>
        <ClinicPaymentCard />
      </div>
      <div>
        <ClinicPaymentTable />
      </div>
    </div>
  );
};

export default PaymentHistoryClinic;
