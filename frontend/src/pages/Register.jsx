import React, { useContext, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

export default function Register() {
  const { backendUrl, token, setToken } = useContext(AppContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusField, setFocusField] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error("Please fill all fields");
    }

    try {
      const { data } = await axios.post(backendUrl + "/api/user/register", {
        name,
        password,
        email,
      });
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success("Registration Successfull");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6fdf7] flex items-center justify-center relative px-4 py-25 overflow-hidden">
      <div className="absolute w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] bg-[#C2EED8] opacity-30 rounded-full -left-16 top-0" />
      <div className="absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-[#C2EED8] opacity-30 rounded-full -right-20 -bottom-20" />

      <div className="flex flex-col md:flex-row items-center justify-center gap-15 md:gap-20 w-full max-w-6xl z-10">
        <div className="text-center md:text-left px-2 md:px-0 max-w-xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-gray-800 font-semibold mb-4 md:mb-6 leading-tight">
            Join the EcoBin Community
          </h2>

          <h5 className="text-gray-600 text-base sm:text-lg md:text-xl mb-4 md:mb-6">
            Become a part of our mission to promote sustainability and cleaner
            surroundings.
          </h5>

          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            Register today to connect with like-minded individuals and
            contribute to a greener planet.
          </p>
        </div>

        <div
          className="
        relative bg-white p-5 sm:p-7 rounded-2xl shadow-xl border border-gray-100
        w-full max-w-[430px]
      "
        >
          <div className="w-14 h-12 rounded-xl bg-green-50 flex items-center justify-center mx-auto -mt-12 shadow-md">
            <i className="fa-regular fa-user text-green-600 text-2xl"></i>
          </div>

          <h1 className="text-[1.6rem] sm:text-[2rem] text-[#2f3e2f] drop-shadow-sm text-center mt-3 mb-8 font-semibold">
            Register Now
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-gray-600 text-sm sm:text-base">Name</label>
              <div
                className={`flex items-center bg-[#f8faf8] rounded-full px-4 py-3 mt-1 border-2 transition-all duration-200 
            ${focusField === "name" ? "border-green-600" : "border-gray-200"}`}
              >
                <input
                  type="text"
                  className="bg-transparent outline-none flex-1 text-sm sm:text-base"
                  placeholder="Enter username"
                  value={name}
                  onFocus={() => setFocusField("name")}
                  onBlur={() => setFocusField("")}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <i
                  className={`fa-solid fa-user text-base sm:text-lg transition-all 
            ${focusField === "name" ? "text-green-600" : "text-gray-500"}`}
                ></i>
              </div>
            </div>

            <div>
              <label className="text-gray-600 text-sm sm:text-base">
                Email
              </label>
              <div
                className={`flex items-center bg-[#f8faf8] rounded-full px-4 py-3 mt-1 border-2 transition-all duration-200 
            ${focusField === "email" ? "border-green-600" : "border-gray-200"}`}
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
                  className={`fa-solid fa-envelope text-base sm:text-lg transition-all 
            ${focusField === "email" ? "text-green-600" : "text-gray-500"}`}
                ></i>
              </div>
            </div>

            <div>
              <label className="text-gray-600 text-sm sm:text-base">
                Password
              </label>
              <div
                className={`flex items-center bg-[#f8faf8] rounded-full px-4 py-3 mt-1 border-2 transition-all duration-200 
            ${focusField === "password" ? "border-green-600" : "border-gray-200"}`}
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
                  className={`fa-solid fa-lock text-base sm:text-lg transition-all 
            ${focusField === "password" ? "text-green-600" : "text-gray-500"}`}
                ></i>
              </div>
            </div>

            <button
              type="submit"
              className="bg-gradient-to-b from-green-600 to-green-700 text-white rounded-full py-2.5 shadow-md font-semibold cursor-pointer text-sm sm:text-lg mt-2"
            >
              Register
            </button>
          </form>

          <div className="flex flex-col items-center mt-4 text-xs sm:text-sm">
            <p className="text-gray-500">
              Already have an account?{" "}
              <span
                className="text-green-600 font-semibold cursor-pointer"
                onClick={() => {
                  navigate("/login");
                  scrollTo(0, 0);
                }}
              >
                Sign In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
