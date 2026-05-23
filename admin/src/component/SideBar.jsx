import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { WorkerContext } from "../context/WorkerContext";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ListTodo,
  User,
  LogOut,
  FileText,
  UserPlus,
  Users,
  Map,
  Bell,
  Settings,
} from "lucide-react";

const SideBar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { wToken, setWToken, profileData } = useContext(WorkerContext);
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
    } else {
      setWToken("");
      localStorage.removeItem("wToken");
    }
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 min-w-62 md:min-w-72 h-full bg-white shadow-sm border-t border-gray-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 z-50 `}
      >
        {aToken && (
          <div className="flex flex-col h-screen p-2">
            <ul className="text-[#515151] mt-20 flex flex-col gap-1">
              <NavLink
                to={"/admin-dashboard"}
                onClick={() => {
                  setIsSidebarOpen(false);
                  scrollTo(0, 0);
                }}
                className={({ isActive }) =>
                  `group flex items-center gap-2 md:gap-3 py-2.5 px-3 md:px-6 rounded-xl cursor-pointer transition-all duration-300
          ${
            isActive
              ? "bg-green-100 text-green-600 shadow-sm"
              : "hover:bg-gray-100 hover:text-green-600"
          }`
                }
              >
                <LayoutDashboard
                  size={22}
                  strokeWidth={2.5}
                  className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110"
                />
                <p className="text-sm md:text-base font-medium">Dashboard</p>
              </NavLink>

              <NavLink
                to={"/all-reports"}
                onClick={() => {
                  setIsSidebarOpen(false);
                  scrollTo(0, 0);
                }}
                className={({ isActive }) =>
                  `group flex items-center gap-2 md:gap-3 py-2.5 px-3 md:px-6 rounded-xl cursor-pointer transition-all duration-300
          ${
            isActive
              ? "bg-green-100 text-green-600 shadow-sm"
              : "hover:bg-gray-100 hover:text-green-600"
          }`
                }
              >
                <FileText
                  size={22}
                  strokeWidth={2.5}
                  className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110"
                />
                <p className="text-sm md:text-base font-medium">Reports</p>
              </NavLink>

              <NavLink
                to={"/add-worker"}
                onClick={() => {
                  setIsSidebarOpen(false);
                  scrollTo(0, 0);
                }}
                className={({ isActive }) =>
                  `group flex items-center gap-2 md:gap-3 py-2.5 px-3 md:px-6 rounded-xl cursor-pointer transition-all duration-300
          ${
            isActive
              ? "bg-green-100 text-green-600 shadow-sm"
              : "hover:bg-gray-100 hover:text-green-600"
          }`
                }
              >
                <UserPlus
                  size={22}
                  strokeWidth={2.5}
                  className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110"
                />
                <p className="text-sm md:text-base font-medium">Add Worker</p>
              </NavLink>

              <NavLink
                to={"/worker-list"}
                onClick={() => {
                  setIsSidebarOpen(false);
                  scrollTo(0, 0);
                }}
                className={({ isActive }) =>
                  `group flex items-center gap-2 md:gap-3 py-2.5 px-3 md:px-6 rounded-xl cursor-pointer transition-all duration-300
          ${
            isActive
              ? "bg-green-100 text-green-600 shadow-sm"
              : "hover:bg-gray-100 hover:text-green-600"
          }`
                }
              >
                <Users
                  size={22}
                  strokeWidth={2.5}
                  className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110"
                />
                <p className="text-sm md:text-base font-medium">Worker List</p>
              </NavLink>

              <NavLink
                to={"/add-zones"}
                onClick={() => {
                  setIsSidebarOpen(false);
                  scrollTo(0, 0);
                }}
                className={({ isActive }) =>
                  `group flex items-center gap-2 md:gap-3 py-2.5 px-3 md:px-6 rounded-xl cursor-pointer transition-all duration-300
          ${
            isActive
              ? "bg-green-100 text-green-600 shadow-sm"
              : "hover:bg-gray-100 hover:text-green-600"
          }`
                }
              >
                <Map
                  size={22}
                  strokeWidth={2.5}
                  className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110"
                />
                <p className="text-sm md:text-base font-medium">Manage Zone</p>
              </NavLink>

              <NavLink
                to={"/all-notifications"}
                onClick={() => {
                  setIsSidebarOpen(false);
                  scrollTo(0, 0);
                }}
                className={({ isActive }) =>
                  `group flex items-center gap-2 md:gap-3 py-2.5 px-3 md:px-6 rounded-xl cursor-pointer transition-all duration-300
          ${
            isActive
              ? "bg-green-100 text-green-600 shadow-sm"
              : "hover:bg-gray-100 hover:text-green-600"
          }`
                }
              >
                <Bell
                  size={22}
                  strokeWidth={2.5}
                  className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110"
                />
                <p className="text-sm md:text-base font-medium">
                  Notifications
                </p>
              </NavLink>
            </ul>

            <div className="flex flex-col gap-2 mt-auto  mb-2">
              <button
                onClick={() => navigate("/settings")}
                className="flex items-center justify-center gap-1 font-medium bg-gray-200 text-gray-800 text-sm md:text-base w-full py-2 md:py-2.5 rounded-xl cursor-pointer hover:bg-gray-300 transition"
              >
                <Settings className="w-5 h-5" strokeWidth={2.5} />
                Settings
              </button>

              <button
                onClick={logout}
                className="flex items-center justify-center gap-1 font-medium bg-green-500 text-white text-sm w-full py-2 rounded-lg cursor-pointer md:hidden hover:bg-green-600 transition"
              >
                <LogOut className="w-5 h-5" strokeWidth={2.5} />
                Logout
              </button>
            </div>
          </div>
        )}

        {wToken && (
          <div className="mt-15 sm:mt-20">
            <div className="md:hidden flex items-center gap-3 p-3 border-b border-gray-200">
              <img
                className="w-11 rounded-full bg-gray-100"
                src={profileData?.image}
                alt="user"
              />
              <div className="flex flex-col items-start">
                <p className="text-gray-700 text-sm font-medium">
                  {profileData.name}
                </p>
                <p className="text-gray-400 text-xs truncate max-w-[140px]">
                  {profileData.email}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 p-2">
              <ul className="text-gray-600 flex flex-col gap-1 ">
                {/* Dashboard */}
                <NavLink
                  to={"/worker-dashboard"}
                  onClick={() => {
                    (setIsSidebarOpen(false), scrollTo(0, 0));
                  }}
                  className={({ isActive }) =>
                    `group flex items-center gap-2 md:gap-3 py-2.5 px-3 md:px-6 rounded-xl cursor-pointer transition-all duration-300
                                  ${
                                    isActive
                                      ? "bg-green-100 text-green-600 shadow-sm"
                                      : "hover:bg-gray-100 hover:text-green-600"
                                  }`
                  }
                >
                  <LayoutDashboard
                    size={22}
                    strokeWidth={2.5}
                    className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110"
                  />
                  <p className="text-sm md:text-base font-medium">Dashboard</p>
                </NavLink>

                {/* My Tasks */}
                <NavLink
                  to={"/assign-reports"}
                  onClick={() => {
                    (setIsSidebarOpen(false), scrollTo(0, 0));
                  }}
                  className={({ isActive }) =>
                    `group flex items-center gap-2 md:gap-3 py-2.5 px-3 md:px-6 rounded-xl cursor-pointer transition-all duration-300
                   ${
                     isActive
                       ? "bg-green-100 text-green-600 shadow-sm"
                       : "hover:bg-gray-100 hover:text-green-600"
                   }`
                  }
                >
                  <ListTodo
                    size={22}
                    strokeWidth={2.5}
                    className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110"
                  />
                  <p className="text-sm md:text-base font-medium">My Tasks</p>
                </NavLink>

                {/* Profile */}
                <NavLink
                  to={"/worker-profile"}
                  onClick={() => {
                    (setIsSidebarOpen(false), scrollTo(0, 0));
                  }}
                  className={({ isActive }) =>
                    `group flex items-center gap-2 md:gap-3 py-2.5 px-3 md:px-6 rounded-xl cursor-pointer transition-all duration-300
                   ${
                     isActive
                       ? "bg-green-100 text-green-600 shadow-sm"
                       : "hover:bg-gray-100 hover:text-green-600"
                   }`
                  }
                >
                  <User
                    size={22}
                    strokeWidth={2.5}
                    className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110"
                  />
                  <p className="text-sm md:text-base font-medium">My Profile</p>
                </NavLink>

                <NavLink
                  to={"/all-notifications"}
                  onClick={() => {
                    setIsSidebarOpen(false);
                    scrollTo(0, 0);
                  }}
                  className={({ isActive }) =>
                    `group flex items-center gap-2 md:gap-3 py-2.5 px-3 md:px-6 rounded-xl cursor-pointer transition-all duration-300
          ${
            isActive
              ? "bg-green-100 text-green-600 shadow-sm"
              : "hover:bg-gray-100 hover:text-green-600"
          }`
                  }
                >
                  <Bell
                    size={22}
                    strokeWidth={2.5}
                    className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110"
                  />
                  <p className="text-sm md:text-base font-medium">
                    Notifications
                  </p>
                </NavLink>
              </ul>

              <button
                onClick={logout}
                className="flex items-center justify-center gap-1 font-medium bg-green-500 hover:bg-green-600 text-white text-sm w-full py-2 rounded-xl cursor-pointer md:hidden"
              >
                <LogOut className="w-5 h-5" strokeWidth={2.5} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SideBar;
