/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { X, Info, CheckCircle } from "lucide-react";
import {
  useCreateWithdrawRequestMutation,
  useGetSingleWithdrawRequestQuery,
} from "@/redux/features/admin/payment/clinicPaymentsApi";
import { useSingleClinicId } from "@/hooks/userClinicId";
import { toast } from "sonner";

interface WithdrawFundsProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const WithdrawFunds: React.FC<WithdrawFundsProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { clinicId } = useSingleClinicId();
  const [createWithdrawRequest, { isLoading }] =
    useCreateWithdrawRequestMutation();
  const { data: single } = useGetSingleWithdrawRequestQuery(
    clinicId as string,
    {
      skip: !clinicId,
    }
  );
  const [amount, setAmount] = React.useState("0");
  const [cardNumber, setCardNumber] = React.useState("");
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [errors, setErrors] = React.useState({
    amount: "",
    // cardNumber: "",
  });

  const validateForm = () => {
    const newErrors = { amount: "", };
    let isValid = true;

    if (!amount.trim()) {
      newErrors.amount = "Amount is required";
      isValid = false;
    } else {
      const amountValue = parseFloat(amount);
      if (isNaN(amountValue)) {
        newErrors.amount = "Please enter a valid number";
        isValid = false;
      } else if (amountValue <= 0) {
        newErrors.amount = "Amount must be greater than 0";
        isValid = false;
      } else if (amountValue > 1600) {
        // Assuming 1600 is max available
        newErrors.amount = "Amount exceeds available balance";
        isValid = false;
      }
    }

    // if (!cardNumber.trim()) {
    //   newErrors.cardNumber = "Card number is required";
    //   isValid = false;
    // } else if (!/^\d+$/.test(cardNumber.replace(/\s/g, ""))) {
    //   newErrors.cardNumber = "Card number must contain only digits";
    //   isValid = false;
    // } else if (cardNumber.replace(/\s/g, "").length < 12) {
    //   newErrors.cardNumber = "Card number must be at least 12 digits";
    //   isValid = false;
    // }

    setErrors(newErrors);
    return isValid;
  };

  const handleRequestWithdrawal = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const withdrawData = {
        amount: parseFloat(amount),
        // cardNumber: cardNumber.replace(/\s/g, ""),
        ownerId: clinicId as string,
        walletId: single?.data?._id,
        ownerType: "CLINIC",
      };

      const response = await createWithdrawRequest(withdrawData).unwrap();
      console.log(response);

      if (onSuccess) {
        onSuccess();
      }

      setShowConfirmation(true);
    } catch (error: any) {
      console.error("Withdrawal failed:", error);
      // You can show an error message here
      toast.error(error.data.message || "Withdrawal failed!");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and one decimal point
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setAmount(value);
      if (errors.amount) {
        setErrors({ ...errors, amount: "" });
      }
    }
  };

  // const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   let value = e.target.value.replace(/\D/g, ""); // Remove non-digits

  //   // Add space every 4 digits for better readability (optional)
  //   if (value.length > 0) {
  //     value = value.match(/.{1,4}/g)?.join(" ") || value;
  //   }

  //   setCardNumber(value);
  //   if (errors.cardNumber) {
  //     setErrors({ ...errors, cardNumber: "" });
  //   }
  // };

  const handleBack = () => {
    setShowConfirmation(false);
    setAmount("1200.00");
    setCardNumber("");
    setErrors({ amount: "" });
    // setErrors({ amount: "", cardNumber: "" });
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
            {/* <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <p className="text-gray-700 text-sm font-medium mb-2">
                Available for Withdrawal
              </p>
              <p className="text-3xl font-semibold text-green-600">$1,600.00</p>
            </div> */}

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
                    onChange={handleAmountChange}
                    className={`w-full pl-7 pr-4 py-2 border ${
                      errors.amount ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Enter amount"
                  />
                </div>
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number <span className="text-red-500">*</span>
                </label>
                <input
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className={`w-full px-4 py-2 border ${
                    errors.cardNumber ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white`}
                  type="text"
                  placeholder="Enter card number (digits only)"
                  maxLength={19} // 16 digits + 3 spaces
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cardNumber}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Enter your bank account number or card number
                </p>
              </div> */}

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
                disabled={isLoading}
                className="flex-1 cursor-pointer px-4 py-3 border border-gray-300 rounded-lg text-blue-600 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                onClick={handleRequestWithdrawal}
                disabled={isLoading}
                className="flex-1 cursor-pointer px-4 py-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Request Withdrawal"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D3C5266] bg-opacity-40 p-4">
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
              <span className="font-semibold text-gray-900">${amount}</span> to
              card ending in{" "}
              <span className="font-semibold">{cardNumber.slice(-4)}</span> has
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
