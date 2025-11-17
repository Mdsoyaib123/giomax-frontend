import TransactionDetailsCard from "./TransactionDetailsCard";
import TransactionDetails from "./TransactionDetails";

const PaymentHistory = () => {
  return (
    <div className="space-y-9">
      <TransactionDetailsCard/>
      <TransactionDetails/>
    </div>
  );
};

export default PaymentHistory;
