/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Login.tsx
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import loginphoto from "@/assets/newphoto/login1.svg";
import logo from "@/assets/Logo/LogoMain.svg";
import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks/redux-hook";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { LoginResponse } from "@/redux/types/auth.type";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response: LoginResponse = await login({ email, password }).unwrap();
      const token = response.data?.accessToken;
      // Try to construct user object: prefer decoding token; fallback to payload
      let user = null;
      try {
        // decode token via jwt-decode (slice in authSlice does this too) - here just try to read payload.user if present
        if (response.data.user) {
          user = {
            id:
              (response.data.user as any).id ||
              (response.data.user as any)._id ||
              response.data.userId ||
              "",
            email: (response.data.user as any).email,
            name: (response.data.user as any).name,
            role: (response.data.user as any).role || response.data.role,
          };
        } else {
          user = {
            id: response.data.userId || "",
            role: response.data.role,
          };
        }
      } catch (_) {
        user = { id: response.data.userId || "", role: response.data.role };
      }

      if (token && user) {
        // Save via slice action so cookies/localStorage handled consistently
        dispatch(
          setUser({
            user,
            token,
          })
        );

        // redirect by role
        const role = (user as any).role?.toString().toLowerCase();
        if (role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/clinic-dashboard");
        }
      } else {
        alert("Login succeeded but token/user missing from response.");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      alert(
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
              <p className="text-center">
                Enter your credentials to access your stories
              </p>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="flex flex-col">
                <label htmlFor="email" className="text-white mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jason_smith@gmail.com"
                  className="w-full px-4 py-3 rounded-[20px] bg-[#05282b] text-white focus:ring-2 focus:ring-sky-300 outline-none"
                  required
                />
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <label htmlFor="password" className="text-white mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="w-full px-4 py-3 pr-12 rounded-[20px] bg-[#05282b] text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-300 outline-none"
                  />

                  {password && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
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

              {/* Forget Password */}
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-[#8fcbd6]">
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <Link to="/admin-dashboard">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#346778] text-white hover:bg-[#114050] font-sans py-3 rounded-[20px] transition cursor-pointer"
                >
                  {isLoading ? "Sign in..." : "Sign In"}
                </button>
              </Link>
            </form>

            {/* Register */}
            {/* <p className="text-center text-sm text-gray-300">
              Don’t have an account?{" "}
              <a href="/signup" className="text-[#8fcbd6] hover:text-sky-300">
                Register
              </a>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
