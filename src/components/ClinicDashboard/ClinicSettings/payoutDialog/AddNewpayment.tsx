import { X } from "lucide-react";
import { useState } from "react";

interface AddPaymentMethodModalProps {
  onClose: () => void;
  onSubmit: (data: PaymentFormData) => void;
}
interface PaymentFormData {
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export const AddNewpayment: React.FC<AddPaymentMethodModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardHolderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (formData.cardHolderName && formData.cardNumber && formData.expiryDate && formData.cvv) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#2D3C5266] bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Add New Bank Account</h2>
            <p className="text-sm text-gray-500 mt-1">Provide relevant information and add new account</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Holder Name * <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.cardHolderName}
                onChange={(e) => handleInputChange("cardHolderName", e.target.value)}
                placeholder="Enter bank holder name"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IBAN * <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                placeholder="Enter your bank number"
                maxLength={16}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personal ID Number * <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                placeholder="Enter your bank number"
                maxLength={5}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name * <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.cvv}
                onChange={(e) => handleInputChange("cvv", e.target.value)}
                placeholder="Enter bank name"
                maxLength={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 sm:px-6 sm:pb-6 pt-0 sm:pt-0">
          <button
            onClick={onClose}
            className="w-full sm:flex-1 px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="w-full sm:flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer order-1 sm:order-2"
          >
            Add Payment Method
          </button>
        </div>
      </div>
    </div>
  );
};

// import { X } from "lucide-react";
// import { useState } from "react";

// interface AddPaymentMethodModalProps {
//   onClose: () => void;
//   onSubmit: (data: PaymentFormData) => void;
// }
// interface PaymentFormData {
//   cardHolderName: string;
//   cardNumber: string;
//   expiryDate: string;
//   cvv: string;
// }
//   export  const AddNewpayment: React.FC<AddPaymentMethodModalProps> = ({ onClose, onSubmit }) => {
//   const [formData, setFormData] = useState<PaymentFormData>({
//     cardHolderName: "",
//     cardNumber: "",
//     expiryDate: "",
//     cvv: ""
//   });

//   const handleInputChange = (field: keyof PaymentFormData, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = () => {
//     if (formData.cardHolderName && formData.cardNumber && formData.expiryDate && formData.cvv) {
//       onSubmit(formData);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-[#2D3C5266] bg-opacity-40 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl">
//         {/* Header */}
//         <div className="flex items-center justify-between p-5 border-b border-gray-200">
//           <div>
//             <h2 className="text-xl font-bold text-gray-800">Add New Payment Method</h2>
//             <p className="text-sm text-gray-500 mt-1">Provide relevant information and add new payment method</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//             aria-label="Close"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Form */}
//         <div className="p-6">
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             {/* Card Holder Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Card Holder Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={formData.cardHolderName}
//                 onChange={(e) => handleInputChange("cardHolderName", e.target.value)}
//                 placeholder="Enter card holder name"
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             {/* Card Number */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Card Number <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={formData.cardNumber}
//                 onChange={(e) => handleInputChange("cardNumber", e.target.value)}
//                 placeholder="Enter your card number"
//                 maxLength={16}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             {/* Expiry Date */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 EXP <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={formData.expiryDate}
//                 onChange={(e) => handleInputChange("expiryDate", e.target.value)}
//                 placeholder="Enter Expiry Date"
//                 maxLength={5}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             {/* CVV */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Cvv <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={formData.cvv}
//                 onChange={(e) => handleInputChange("cvv", e.target.value)}
//                 placeholder="Enter CVV Code"
//                 maxLength={3}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Footer Buttons */}
//         <div className="flex gap-3 px-6 pb-6">
//           <button
//             onClick={onClose}
//             className="flex-1 px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Add Payment Method
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

