import SectionTitle from "@/common/SectionTitle";
import PaymentTable from "./PaymentTable";
import PaymentCard from "./PaymentCard";

const Payments = () => {
  return (
    <div className="space-y-10">
      <div>
        <SectionTitle
          title="Payments"
          description="Track all transactions and payouts"
        />
      </div>
      <div>
        <PaymentCard />
      </div>
      <div>
        <PaymentTable />
      </div>
    </div>
  );
};

export default Payments;
