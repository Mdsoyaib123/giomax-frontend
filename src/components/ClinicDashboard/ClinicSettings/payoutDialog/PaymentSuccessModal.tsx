// import { ShieldCheck, X } from "lucide-react";

// interface PaymentSuccessModalProps {
//   onClose: () => void;
//   onBack: () => void;
// }

// export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({ onClose, onBack }) => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm relative">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
//           aria-label="Close"
//         >
//           <X size={20} />
//         </button>

//         {/* Content */}
//         <div className="p-8 text-center">
//           {/* Success Icon */}
//           <div className="flex justify-center mb-5">
//             <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
//               <ShieldCheck className="text-white" size={36} />
//             </div>
//           </div>

//           {/* Title */}
//           <h2 className="text-xl font-bold text-gray-800 mb-3">
//             Payment Method Added
//           </h2>

//           {/* Message */}
//           <p className="text-sm text-gray-600 mb-6">
//             Your card has been securely saved via Stripe and is ready to use.
//           </p>

//           {/* Button */}
//           <button
//             onClick={onBack}
//             className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Back to Payment & Earnings
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

import { ShieldCheck, X } from "lucide-react";

interface PaymentSuccessModalProps {
  onClose: () => void;
  onBack: () => void;
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({ onClose,  }) => {
  return (
    // Responsive Modal Background and Positioning
    <div className="fixed inset-0 bg-[#2D3C5266] bg-opacity-40 flex items-center justify-center z-50 p-4">
      {/* Responsive Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm relative"> 
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1" // Added p-1 for touch friendliness
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-6 sm:p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <ShieldCheck className="text-white" size={36} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            Payment Method Added
          </h2>

          {/* Message */}
          <p className="text-sm text-gray-600 mb-6">
            Your card has been securely saved via Stripe and is ready to use.
          </p>

          {/* Button */}
          <button
            // Clicks back to the main Payout page (as defined in Payout.tsx)
            onClick={onClose} 
            className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
          {/* Note: In a typical flow, the success modal button closes the modal and returns to the main view, so I changed onBack to onClose for better UX. If you must use onBack, change the onClick back to {onBack}. */}
        </div>
      </div>
    </div>
  );
};