import { useState } from "react";
import { AddNewpayment } from "./payoutDialog/AddNewpayment";
import { PaymentSuccessModal } from "./payoutDialog/PaymentSuccessModal";

interface PaymentFormData {
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const Payout = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "Visa",
      number: "Visa •••• 4242",
      cardHolder: "Expires 12/26 • Stripe",
      isDefault: true,
    },
    {
      id: 2,
      type: "Mastercard",
      number: "Mastercard •••• 8888",
      cardHolder: "Expires 09/25 • Stripe",
      isDefault: false,
    },
  ]);

  // States to control modal visibility
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSetDefault = (id: number) => {
    setPaymentMethods((methods) =>
      methods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  // Handler to add payment method - connects Component 1 to Component 2
  const handleAddPaymentMethod = (data: PaymentFormData) => {
    console.log("Payment method added:", data);
    setShowAddModal(false); // Close Add Modal
    setShowSuccessModal(true); // Open Success Modal
  };

  // Handler to go back from success to add form
  const handleBackToForm = () => {
    setShowSuccessModal(false); // Close Success Modal
    setShowAddModal(true); // Open Add Modal again
  };

  // Handler to close all modals
  const handleCloseAll = () => {
    setShowAddModal(false);
    setShowSuccessModal(false);
  };

  // Helper function to render a card icon
  const CardIcon = ({ type }: { type: string }) => {
    if (type === "Visa") {
      return (
        <svg
          className="w-6 h-6 text-blue-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v12h16V6H4zm2 2h2v2H6V8zm0 4h2v2H6v-2z" />
        </svg>
      );
    }
    return (
      <svg
        className="w-6 h-6 text-orange-600"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M15 12c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3z" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-xl  mt-5">
      <div className="text-xl font-semibold text-gray-800 mb-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 mt-6">
          {/* Header (Responsive) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Payout Method
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage your payment methods and billing information
              </p>
            </div>

            {/* Button (Responsive) */}
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium cursor-pointer flex items-center gap-2 text-sm whitespace-nowrap"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Payment Method
            </button>
          </div>

          {/* Payment Methods List (Responsive Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 sm:p-5 border rounded-xl transition cursor-pointer flex justify-between items-center
                  ${
                    method.isDefault
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-300"
                  }`}
                onClick={() => handleSetDefault(method.id)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center
                    ${
                      method.type === "Visa" ? "bg-blue-100" : "bg-orange-100"
                    }`}
                  >
                    <CardIcon type={method.type} />
                  </div>

                  <div>
                    <p className="font-medium text-base text-gray-800">
                      {method.number}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {method.cardHolder}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center 
                      ${
                        method.isDefault
                          ? "border-blue-600 bg-blue-600"
                          : "border-gray-400"
                      }`}
                  >
                    {method.isDefault && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Buttons (Responsive Flex) */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3  pt-4 sm:pt-6">
            <button className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
              Cancel
            </button>

            <button className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddNewpayment
          onClose={handleCloseAll}
          onSubmit={handleAddPaymentMethod}
        />
      )}

      {showSuccessModal && (
        <PaymentSuccessModal
          onClose={handleCloseAll}
          onBack={handleBackToForm}
        />
      )}
    </div>
  );
};

export default Payout;
