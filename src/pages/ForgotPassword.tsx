import loginphoto from "@/assets/newphoto/login2.svg";
import logo from "@/assets/Logo/LogoMain.svg";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center  text-black bg-white">
      <div>
        <div className="w-52 h-20 mb-4">
          {" "}
          <img src={logo} alt="" />
        </div>
        <div className="max-w-5xl w-full  flex overflow-hidden">
          {/* Left Side - Image */}
          <div className="hidden md:flex w-1/2  items-center justify-center">
            <img
              src={loginphoto}
              alt="artist"
              className="h-full w-full object-cover rounded-l-xl"
            />
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center space-y-8">
            <div>
              <h2 className=" text-2xl md:text-3xl lg:text-4xl font-sans mb-2">
                Forgot Password
              </h2>
              <p className="text-center">
                Enter your email and we’ll send you a password reset link.
              </p>
            </div>

            <div>
              <form className="space-y-4">
                {/* Email */}
                <div className="flex flex-col mb-4">
                  <label htmlFor="email" className="text-black font-sans mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl bg-[#F5F7FB] text-black focus:ring-2 focus:ring-sky-300 outline-none"
                  />
                </div>

                {/* Login Button */}
                <Link to="/admin-dashboard">
                  <button
                    type="submit"
                    className="w-full bg-[#2E6FF3] text-white hover:bg-[#0c4dcf] font-sans py-3 rounded-xl transition cursor-pointer"
                  >
                    Send Reset Link
                  </button>
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
