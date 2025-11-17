// import { useState } from "react";

// const Payout = () => {
//   const [paymentMethods, setPaymentMethods] = useState([
//     {
//       id: 1,
//       type: "Visa",
//       number: "**** **** **** 4242",
//       cardHolder: "Expires 12/25 • Visa",
//       isDefault: true
//     },
//     {
//       id: 2,
//       type: "Mastercard",
//       number: "**** **** **** 8888",
//       cardHolder: "Expires 09/24 • Blue",
//       isDefault: false
//     }
//   ]);

//   const [showAddForm, setShowAddForm] = useState(false);

//   const handleSetDefault = (id: number) => {
//     setPaymentMethods(methods =>
//       methods.map(method => ({
//         ...method,
//         isDefault: method.id === id
//       }))
//     );
//   };

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 lg:p-8 mt-5">

//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-800">Payout Method</h2>
//           <p className="text-sm text-gray-600 mt-1">
//             Manage your payment methods and billing information
//           </p>
//         </div>

//         <button
//           onClick={() => setShowAddForm(!showAddForm)}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium cursor-pointer flex items-center gap-2 text-sm"
//         >
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//           </svg>
//           <span className="hidden sm:inline">Add New Payment Method</span>
//           <span className="sm:hidden">Add</span>
//         </button>
//       </div>

//       {/* Payment Methods List */}
//       <div className="space-y-4">
//         {paymentMethods.map((method) => (
//           <div
//             key={method.id}
//             className={`p-5 border-2 rounded-xl transition cursor-pointer ${
//               method.isDefault
//                 ? "border-blue-500 bg-blue-50"
//                 : "border-gray-200 hover:border-blue-300"
//             }`}
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">

//                 {/* Card Icon */}
//                 <div
//                   className={`w-14 h-14 rounded-lg flex items-center justify-center ${
//                     method.type === "Visa" ? "bg-blue-100" : "bg-orange-100"
//                   }`}
//                 >
//                   {method.type === "Visa" ? (
//                     <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v12h16V6H4zm2 2h2v2H6V8zm0 4h2v2H6v-2z" />
//                     </svg>
//                   ) : (
//                     <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M15 12c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3z" />
//                       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
//                     </svg>
//                   )}
//                 </div>

//                 {/* Card Details */}
//                 <div>
//                   <p className="font-semibold text-gray-800 text-lg">{method.number}</p>
//                   <p className="text-sm text-gray-600 mt-0.5">{method.cardHolder}</p>
//                 </div>
//               </div>

//               {/* Radio Button */}
//               <button
//                 onClick={() => handleSetDefault(method.id)}
//                 className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition cursor-pointer ${
//                   method.isDefault
//                     ? "border-blue-600 bg-blue-600"
//                     : "border-gray-300 hover:border-blue-400"
//                 }`}
//               >
//                 {method.isDefault && (
//                   <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
//                     <path
//                       fillRule="evenodd"
//                       d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 )}
//               </button>
//             </div>
//           </div>
//         ))}

//         {/* Add New Payment Method Button */}
//         <button
//           onClick={() => setShowAddForm(!showAddForm)}
//           className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl 
//           hover:border-blue-400 text-gray-600 text-center transition"
//         >
//           + Add Payment Method
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Payout;














import { useState } from "react";

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

  const [showAddForm, setShowAddForm] = useState(false);

  const handleSetDefault = (id: number) => {
    setPaymentMethods((methods) =>
      methods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  // Helper function to render a card icon
  const CardIcon = ({ type }: { type: string }) => {
    // Reverting to the specific card icons for better UI
    if (type === "Visa") {
      return (
        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v12h16V6H4zm2 2h2v2H6V8zm0 4h2v2H6v-2z" />
        </svg>
      );
    }
    // Assuming Mastercard if not Visa, or you can add more logic
    return (
      <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M15 12c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3z" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
    );
  };

  return (
    <div className="bg-white border border-blue-300 rounded-xl p-4 sm:p-6 lg:p-8 mt-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Payout Method</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your payment methods and billing information
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium cursor-pointer flex items-center gap-2 text-sm whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Payment Method
        </button>
      </div>

      {/* Conditional Add Payment Form Placeholder */}
      {showAddForm && (
        <div className="p-5 border-2 border-dashed border-blue-300 rounded-xl mb-6 bg-blue-50">
          <p className="text-gray-700 text-center">
            [Form to Add New Payment Method goes here]
          </p>
        </div>
      )}

      {/* Payment Methods List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`p-4 sm:p-5 border rounded-xl transition cursor-pointer flex justify-between items-center
              ${
                method.isDefault
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-300"
              }`}
            onClick={() => handleSetDefault(method.id)} // Make the whole card clickable
          >
            <div className="flex items-center gap-4">

              {/* Card Icon Container */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center
                ${method.type === "Visa" ? "bg-blue-100" : "bg-orange-100"}`}
              >
                <CardIcon type={method.type} />
              </div>

              {/* Card Details */}
              <div>
                <p className="font-medium text-base text-gray-800">{method.number}</p>
                <p className="text-xs sm:text-sm text-gray-500">{method.cardHolder}</p>
              </div>
            </div>

            {/* Radio Button */}
            <div className="flex-shrink-0">
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

      {/* Bottom Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t pt-4 sm:pt-6">
        <button className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
          Cancel
        </button>

        <button className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Payout;
