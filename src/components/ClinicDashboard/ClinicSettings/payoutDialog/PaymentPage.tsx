import { useState } from "react";
import { AddNewpayment } from "@/components/ClinicDashboard/ClinicSettings/payoutDialog/AddNewpayment";
import { PaymentSuccessModal } from "@/components/ClinicDashboard/ClinicSettings/payoutDialog/PaymentSuccessModal";

export const PaymentPage: React.FC = () => {
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // Triggered when user clicks "Add New Payment Method"
  const handleOpenAddPayment = () => {
    setIsAddPaymentOpen(true);
  };

  // Triggered when AddNewpayment modal closes
  const handleCloseAddPayment = () => {
    setIsAddPaymentOpen(false);
  };

  // Triggered when payment method is successfully added
  const handlePaymentSubmit = (data: any) => {
    console.log("Payment Data Submitted:", data);
    setIsAddPaymentOpen(false);  // Close add payment modal
    setIsSuccessOpen(true);      // Open success modal
  };

  // Triggered when user clicks "Back" in success modal
  const handleBack = () => {
    setIsSuccessOpen(false);
  };

  return (
    <div>
      <button
        onClick={handleOpenAddPayment}
        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        Add New Payment Method
      </button>

      {isAddPaymentOpen && (
        <AddNewpayment
          onClose={handleCloseAddPayment}
          onSubmit={handlePaymentSubmit}
        />
      )}

      {isSuccessOpen && (
        <PaymentSuccessModal
          onClose={handleBack}
          onBack={handleBack}
        />
      )}
    </div>
  );
};
