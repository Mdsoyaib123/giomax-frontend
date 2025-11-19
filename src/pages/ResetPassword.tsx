import loginphoto from "@/assets/newphoto/login3.svg";
import logo from "@/assets/Logo/LogoMain.svg";
import { useState } from "react";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPassword: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setPassword(e.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

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
                Reset Password?
              </h2>
              <p className="text-center">
                Please enter a new password & confirm password to reset your
                password
              </p>
            </div>

            <div>
              <form className="space-y-4">
                {/* Password Field */}
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor="password"
                    className="text-black font-sans mb-2"
                  >
                    Password
                  </label>
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => handlePasswordChange(e, setPassword)}
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-[#F5F7FB] text-black placeholder-gray-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                    />
                    {/* Show eye only if password is not empty */}
                    {password && (
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none cursor-pointer"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <AiOutlineEyeInvisible size={22} />
                        ) : (
                          <AiOutlineEye size={22} />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor="confirm-password"
                    className="text-black font-sans mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) =>
                        handlePasswordChange(e, setConfirmPassword)
                      }
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-[#F5F7FB] text-black placeholder-gray-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                    />
                    {/* Show eye only if confirmPassword is not empty */}
                    {confirmPassword && (
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none cursor-pointer"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <AiOutlineEyeInvisible size={22} />
                        ) : (
                          <AiOutlineEye size={22} />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Login Button */}
                <Link to="/admin-dashboard">
                  <button
                    type="submit"
                    className="w-full bg-[#2E6FF3] text-white hover:bg-[#0c4dcf] font-sans py-3 rounded-xl transition cursor-pointer"
                  >
                    Reset Password
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

export default ResetPassword;
