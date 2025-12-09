import loginphoto from "@/assets/newphoto/login1.svg";
import logo from "@/assets/Logo/LogoMain.svg";
import { useState } from "react";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";

const Login = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
                Login to Med Connect
              </h2>
              <p className="text-center">
                Enter your credentials to access your stories
              </p>
            </div>

            <div>
              <form className="space-y-4">
                {/* Email */}
                <div className="flex flex-col mb-4">
                  <label htmlFor="email" className="text-black font-sans mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="jason_smith@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#F5F7FB] text-black focus:ring-2 focus:ring-sky-300 outline-none"
                  />
                </div>

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
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-[#F5F7FB] text-black placeholder-gray-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                    />

                    {/* Show eye only if password is not empty */}
                    {password && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
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
                <div className=" flex justify-end items-center text-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-[#2A779E] mt-4 text-center"
                  >
                    Forget Password
                  </Link>
                </div>
                {/* Login Button */}
                <Link to="/admin-dashboard">
                  <button
                    type="submit"
                    className="w-full bg-[#2E6FF3] text-white hover:bg-[#0c4dcf] font-sans py-3 rounded-xl transition cursor-pointer"
                  >
                    Sign In
                  </button>
                </Link>
              </form>
            </div>

            <div>
              <p className="text-sm text-gray-700 mt-4 text-center ">
                Don’t have an account?
                <a
                  href="/signup"
                  className="text-[#2A779E] hover:text-sky-300 ml-1"
                >
                  Register
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
