import React from "react";
import { X, Info, CheckCircle } from "lucide-react";

interface WithdrawFundsProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawFunds: React.FC<WithdrawFundsProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = React.useState("1200.00");
  const [payoutMethod, setPayoutMethod] = React.useState(
    "Bank transfer - ****4212"
  );
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const handleRequestWithdrawal = () => {
    setShowConfirmation(true);
  };

  const handleBack = () => {
    setShowConfirmation(false);
    setAmount("1200.00");
    setPayoutMethod("Bank transfer - ****4212");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Withdraw Funds Modal */}
      {!showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D3C5266] bg-opacity-40 p-4">
          <div className="max-w-2xl w-full bg-white rounded-lg border border-gray-200 p-6 md:p-8 relative">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Withdraw Funds
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Transfer your earnings to your bank account
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 cursor-pointer hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Available for Withdrawal */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <p className="text-gray-700 text-sm font-medium mb-2">
                Available for Withdrawal
              </p>
              <p className="text-3xl font-semibold text-green-600">$1,600.00</p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdraw Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500 font-medium">
                    $
                  </span>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pay-out Method <span className="text-red-500">*</span>
                </label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option>Bank transfer - ****4212</option>
                  <option>Bank transfer - ****5678</option>
                </select>
              </div>

              <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <Info
                  size={20}
                  className="text-blue-600 flex-shrink-0 mt-0.5"
                />
                <p className="text-sm text-gray-700">
                  Bank withdrawals typically take 1-3{" "}
                  <span className="font-medium">business days</span> to process
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={onClose}
                className="flex-1 cursor-pointer px-4 py-3 border border-gray-300 rounded-lg text-blue-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleRequestWithdrawal}
                className="flex-1 cursor-pointer px-4 py-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Request Withdrawal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D3C5266]  bg-opacity-40 p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-[1140px] text-center h-[375px]">
            {/* Close Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={handleBack}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-blue-600 rounded-full p-4 flex items-center justify-center">
                <CheckCircle size={40} className="text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Withdrawal Initiated!
            </h1>

            {/* Message */}
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              Your withdrawal of{" "}
              <span className="font-semibold text-gray-900">${amount}</span> has
              been initiated. You should see it in your bank account within{" "}
              <span className="font-semibold">1-3 business days</span>.
            </p>

            {/* Button */}
            <button
              onClick={handleBack}
              className="w-[275px] bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Back to Payment & Earnings
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WithdrawFunds;
