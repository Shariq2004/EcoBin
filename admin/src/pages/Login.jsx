import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { WorkerContext } from "../context/WorkerContext";

export default function Login() {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setWToken } = useContext(WorkerContext);

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          toast.success("Admin Login Successfully");
          navigate("/admin-dashboard");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/worker/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("wToken", data.token);
          setWToken(data.token);
          console.log(data.token);
          toast.success("Worker Login Successfully");
          navigate("/worker-dashboard");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    const aToken = localStorage.getItem("aToken");
    const wToken = localStorage.getItem("wToken");

    if (aToken) navigate("/admin-dashboard");
    else if (wToken) navigate("/worker-dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f6fdf7] flex items-center justify-center relative px-4 py-6 overflow-hidden">
      <div className="absolute pointer-events-none w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] bg-[#C2EED8] opacity-30 rounded-full -left-20 -top-20" />
      <div className="absolute pointer-events-none w-[350px] h-[350px] sm:w-[580px] sm:h-[580px] bg-[#C2EED8] opacity-30 rounded-full -right-26 -bottom-26" />

      <div className="relative z-10 bg-white p-5 sm:p-7 rounded-2xl shadow-xl border border-gray-100 w-full max-w-[430px]">
        <div className="w-14 h-12 rounded-xl bg-green-50 flex items-center justify-center mx-auto -mt-12 shadow-md">
          <i className="fa-solid fa-lock text-green-600 text-2xl"></i>
        </div>

        <h1 className="text-[1.6rem] text-[#2f3e2f]  drop-shadow-sm sm:text-[2rem] text-center mt-3 mb-8 font-semibold text-gray-900 leading-tight">
          <span className="text-green-500"> {state} </span>Login
        </h1>

        <form className="flex flex-col gap-4" onSubmit={onSubmitHandler}>
          <div>
            <label className="text-gray-600 text-sm sm:text-base">Email</label>

            <div
              className={`flex items-center bg-[#f8faf8] rounded-full px-3 py-2.5 sm:px-4 sm:py-3 mt-1 border-2 border-gray-200 gap-3 transition-all duration-200 focus-within:border-green-500">`}
            >
              <input
                type="email"
                className="bg-transparent outline-none flex-1 text-sm sm:text-base min-w-0"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <i
                className={`fa-solid fa-envelope text-gray-500 text-sm sm:text-lg transition-all shrink-0`}
              ></i>
            </div>
          </div>

          <div>
            <label className="text-gray-600 text-sm sm:text-base">
              Password
            </label>

            <div
              className={`flex items-center bg-[#f8faf8] rounded-full px-3 py-2.5 sm:px-4 sm:py-3 mt-1 border border-gray-200 gap-3 border-2 transition-all duration-200`}
            >
              <input
                type="password"
                className="bg-transparent outline-none flex-1 text-sm sm:text-base min-w-0"
                placeholder="your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <i
                className={`fa-solid fa-lock text-gray-500 text-sm sm:text-lg transition-all shrink-0`}
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

          {state === "Admin" ? (
            <p>
              Worker Login?{" "}
              <span
                onClick={() => setState("Worker")}
                className="cursor-pointer text-blue-600 font-medium underline"
              >
                Click here
              </span>
            </p>
          ) : (
            <p>
              Admin Login?{" "}
              <span
                onClick={() => setState("Admin")}
                className="cursor-pointer text-blue-600 font-medium underline"
              >
                Click here
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
