import React from "react";
import { CheckCircle } from "lucide-react";

interface WithdrawalConfirmationProps {
  amount: number;
  onBack: () => void;
}

const WithdrawalConfirmation: React.FC<WithdrawalConfirmationProps> = ({ amount, onBack }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D3C5266] bg-opacity-40 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle size={48} className="text-blue-600" />
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold mb-2">Withdrawal Initiated!</h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Your withdrawal of{" "}
          <span className="font-medium text-gray-900">${amount.toFixed(2)}</span> has been
          initiated. The funds will be transferred to your bank account within{" "}
          <span className="font-medium">1-3 business days</span>.
        </p>

        {/* Button */}
        <button
          onClick={onBack}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
        >
          Back to Payment & Earnings
        </button>
      </div>
    </div>
  );
};

export default WithdrawalConfirmation;
