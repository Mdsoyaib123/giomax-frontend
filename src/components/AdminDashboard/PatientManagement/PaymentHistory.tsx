import PayCard from "./PayCard";
import PaymentHistoryCard from "./PaymentHistoryCard";

const PaymentHistory = () => {
  return (
    <div className="space-y-9">
      <PaymentHistoryCard />
      <PayCard />
    </div>
  );
};

export default PaymentHistory;
