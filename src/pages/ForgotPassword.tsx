import { useState } from "react";
import loginphoto from "@/assets/newphoto/login2.svg";
import logo from "@/assets/Logo/LogoMain.svg";
import MessageSend from "@/assets/Logo/MessageSend.svg";
import { RxCross2 } from "react-icons/rx";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsModalOpen(true); // Open the modal
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-black bg-white">
      <div>
        <div className="w-52 h-20 mb-4">
          <img src={logo} alt="Logo" />
        </div>
        <div className="max-w-5xl w-full flex overflow-hidden">
          {/* Left Side - Image */}
          <div className="hidden md:flex w-1/2 items-center justify-center">
            <img
              src={loginphoto}
              alt="artist"
              className="h-full w-full object-cover rounded-l-xl"
            />
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-sans mb-2">
                Forgot Password
              </h2>
              <p className="text-center">
                Enter your email and we’ll send you a password reset link.
              </p>
            </div>

            <div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Email */}
                <div className="flex flex-col mb-4">
                  <label htmlFor="email" className="text-black font-sans mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl bg-[#F5F7FB] text-black focus:ring-2 focus:ring-sky-300 outline-none"
                  />
                </div>

                {/* Send Reset Link Button */}
                <button
                  type="submit"
                  className="w-full bg-[#2E6FF3] text-white hover:bg-[#0c4dcf] font-sans py-3 rounded-xl transition cursor-pointer"
                >
                  Send Reset Link
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[0.2px]  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center relative">
            {/* <button
              onClick={closeModal}
              className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl"
            >
              &times;
            </button> */}
            <div
              className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl pb-4"
              onClick={closeModal}
            >
              <RxCross2 />
            </div>
            <div className="flex justify-center mb-4">
              <img src={MessageSend} alt="Logo" className="w-20 h-20" />
            </div>

            <p className="text-gray-700">
              We have sent a password reset link successfully to{" "}
              <span className="font-medium">{email}</span>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;

// import loginphoto from "@/assets/newphoto/login2.svg";
// import logo from "@/assets/Logo/LogoMain.svg";
// import { Link } from "react-router-dom";

// const ForgotPassword = () => {
//   return (
//     <div className="min-h-screen flex items-center justify-center  text-black bg-white">
//       <div>
//         <div className="w-52 h-20 mb-4">
//           {" "}
//           <img src={logo} alt="" />
//         </div>
//         <div className="max-w-5xl w-full  flex overflow-hidden">
//           {/* Left Side - Image */}
//           <div className="hidden md:flex w-1/2  items-center justify-center">
//             <img
//               src={loginphoto}
//               alt="artist"
//               className="h-full w-full object-cover rounded-l-xl"
//             />
//           </div>

//           {/* Right Side - Form */}
//           <div className="w-full md:w-1/2 p-10 flex flex-col justify-center space-y-8">
//             <div>
//               <h2 className=" text-2xl md:text-3xl lg:text-4xl font-sans mb-2">
//                 Forgot Password
//               </h2>
//               <p className="text-center">
//                 Enter your email and we’ll send you a password reset link.
//               </p>
//             </div>

//             <div>
//               <form className="space-y-4">
//                 {/* Email */}
//                 <div className="flex flex-col mb-4">
//                   <label htmlFor="email" className="text-black font-sans mb-2">
//                     Email *
//                   </label>
//                   <input
//                     id="email"
//                     type="email"
//                     placeholder="Enter your email"
//                     className="w-full px-4 py-3 rounded-xl bg-[#F5F7FB] text-black focus:ring-2 focus:ring-sky-300 outline-none"
//                   />
//                 </div>

//                 {/* Login Button */}
//                 <Link to="/admin-dashboard">
//                   <button
//                     type="submit"
//                     className="w-full bg-[#2E6FF3] text-white hover:bg-[#0c4dcf] font-sans py-3 rounded-xl transition cursor-pointer"
//                   >
//                     Send Reset Link
//                   </button>
//                 </Link>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;
