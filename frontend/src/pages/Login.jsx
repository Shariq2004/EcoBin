import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

export default function Login() {
  const { backendUrl, token, setToken } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusField, setFocusField] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(backendUrl + "/api/user/login", {
        password,
        email,
      });
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success("Login successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-[#f6fdf7] flex items-center justify-center relative px-4 py-6 overflow-hidden">
      <div className="absolute w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] bg-[#C2EED8] opacity-30 rounded-full -left-20 top-0" />
      <div className="absolute w-[350px] h-[350px] sm:w-[520px] sm:h-[520px] bg-[#C2EED8] opacity-30 rounded-full -right-24 -bottom-24" />

      <div
        className="
          relative z-10 bg-white p-5 sm:p-7 rounded-2xl shadow-xl border border-gray-100
          w-full max-w-[430px]
        "
      >
        <div className="w-14 h-12 rounded-xl bg-green-50 flex items-center justify-center mx-auto -mt-12 shadow-md">
          <i className="fa-solid fa-lock text-green-600 text-2xl"></i>
        </div>

        <h1 className="text-[1.6rem] text-[#2f3e2f]  drop-shadow-sm sm:text-[2rem] text-center mt-3 mb-2 font-semibold text-gray-900 leading-tight">
          Welcome Back to EcoBin
        </h1>

        <p className="text-[0.85rem] sm:text-[1rem] text-center text-gray-500 mb-8 leading-snug">
          Log in to continue your sustainability journey
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-gray-600 text-sm sm:text-base">Email</label>

            <div
              className={`flex items-center bg-[#f8faf8] rounded-full px-3 py-2.5 sm:px-4 sm:py-3 mt-1 border-2 border-gray-200 gap-3 transition-all duration-200  ${focusField === "email" ? "border-green-600" : "border-gray-200"}`}
            >
              <input
                type="email"
                className="bg-transparent outline-none flex-1 text-sm sm:text-base"
                placeholder="your@email.com"
                value={email}
                onFocus={() => setFocusField("email")}
                onBlur={() => setFocusField("")}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <i
                className={`fa-solid fa-envelope text-gray-500 text-base sm:text-lg transition-all ${focusField === "email" ? "text-green-600" : "text-gray-500"}`}
              ></i>
            </div>
          </div>

          <div>
            <label className="text-gray-600 text-sm sm:text-base">
              Password
            </label>

            <div
              className={`flex items-center bg-[#f8faf8] rounded-full px-3 py-2.5 sm:px-4 sm:py-3 mt-1 border border-gray-200 gap-3 border-2 transition-all duration-200 ${focusField === "password" ? "border-green-600" : "border-gray-200"}`}
            >
              <input
                type="password"
                className="bg-transparent outline-none flex-1 text-sm sm:text-base"
                placeholder="your password"
                value={password}
                onFocus={() => setFocusField("password")}
                onBlur={() => setFocusField("")}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <i
                className={`fa-solid fa-lock text-gray-500 text-base sm:text-lg transition-all  ${focusField === "password" ? "text-green-600" : "text-gray-500"}`}
              ></i>
            </div>
          </div>

          <button
            type="submit"
            className="
              bg-gradient-to-b from-green-600 to-green-700 text-white
              rounded-full py-2.5 shadow-md font-semibold cursor-pointer
              text-sm sm:text-lg mt-2
            "
          >
            Log In
          </button>
        </form>

        <div className="flex flex-col items-center mt-4 text-[0.8rem] sm:text-sm">
          <a href="#" className="text-green-600 font-medium">
            Forgot Password?
          </a>

          <p className="text-gray-500 mt-1">
            Don't have an account?{" "}
            <a
              className="text-green-600 font-semibold cursor-pointer"
              onClick={() => {
                navigate("/register");
                scrollTo(0, 0);
              }}
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
