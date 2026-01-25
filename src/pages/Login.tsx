/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Login.tsx
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import loginphoto from "@/assets/newphoto/login1.svg";
import logo from "@/assets/Logo/LogoMain.svg";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { LoginResponse } from "@/redux/types/auth.type";
import { toast } from "sonner";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response: LoginResponse = await login({ email, password }).unwrap();
      const token = response.data?.accessToken;
      
      if (token) {
        // The setUser logic is already handled by authSlice matchFulfilled reducer
        // We just need to navigate to the correct dashboard
        const role = response.data?.user?.role || response.data?.role;
        const normalizedRole = role?.toString().toLowerCase();

        if (normalizedRole === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/clinic-dashboard");
        }
      } else {
        toast.error("Login succeeded but token missing from response.");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      // The baseApi error handler now prevents redirect to /login if we are already here,
      // so this toast will show up correctly without the page refreshing.
      toast.error(
        err?.data?.message || err?.error || "Login failed. Check credentials."
      );
    }
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
                Login to Med Connect
              </h2>
              <p className="text-start">
                Enter your credentials to access your stories
              </p>
            </div>

            <div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-black mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#F5F7FB] text-black focus:ring-2 focus:ring-sky-300 outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="password" className="text-black mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-[#F5F7FB] text-black placeholder-gray-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                      required
                    />
                    {password && (
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#346778] cursor-pointer text-white hover:bg-[#114050] py-3 rounded-[20px] transition"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>

            <div>
              {/* <p className="text-sm text-gray-700 mt-4 text-center ">
                Don’t have an account?
                <a
                  href="/signup"
                  className="text-[#2A779E] hover:text-sky-300 ml-1"
                >
                  Register
                </a>
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
