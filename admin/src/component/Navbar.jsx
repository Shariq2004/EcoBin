import React, { useContext, useRef, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { WorkerContext } from "../context/WorkerContext";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

const Navbar = ({ setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAllAsRead } = useNotification();

  // Top 5 notifications regardless of read/unread
  const top5DropdownNotifications = notifications
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  const allRead = top5DropdownNotifications.every((n) => n.isRead);

  const getTimeAgo = (date) =>
    formatDistanceToNow(new Date(date), { addSuffix: true });

  const { aToken, setAToken } = useContext(AdminContext);
  const { wToken, setWToken, profileData } = useContext(WorkerContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef();

  const timeLabels = {
    newReport: "Reported",
    reportAssigned: "Assigned",
    reportCompleted: "Completed",
    reportDelayed: "Delayed",
    warning: "Warning",
  };

  const handleDropdownClose = () => {
    setShowNotifications(false);
  };

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) markAllAsRead();
  };

  const handleMarkAll = () => {
    markAllAsRead();
  };

  const handleAllNotifications = () => {
    navigate("/all-notifications");
    setShowNotifications(false);
  };

  const logout = () => {
    navigate("/");
    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
      toast.success("Admin Logout Successfully");
    } else {
      setWToken("");
      localStorage.removeItem("wToken");
      toast.success("Worker Logout Successfully");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[55px] sm:h-16 flex justify-between items-center px-2 sm:px-7 border-b border-gray-300 bg-white z-[90]">
      {/* LEFT */}
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => {
            navigate("/");
            scrollTo(0, 0);
          }}
        >
          <img className="w-9 md:w-11" src={assets.logo} alt="logo" />
          <h1 className="-ms-1 text-xl md:text-2xl font-semibold text-green-600">
            EcoBin
          </h1>
        </div>

        <p className="text-[9px] sm:text-[10px] md:text-xs border px-1 sm:px-2 sm:py-0.5 rounded-full border-gray-500 text-gray-600">
          {aToken ? "Admin" : "Worker"}
        </p>
      </div>

      {/* right side admin  */}
      {aToken && (
        <div className="flex items-center gap-2 sm:gap-4 md:gap-5">
          {/* Notification */}
          <div className="relative" ref={notificationRef}>
            <div
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex items-center justify-center text-lg w-10 h-10 sm:w-11 sm:h-11 rounded-full cursor-pointer hover:bg-green-50 hover:text-green-500"
            >
              <i className="fa-regular fa-bell"></i>
            </div>

            {unreadCount > 0 && (
              <span className="absolute top-[1px] right-[3px] sm:top-0 sm:right-0 bg-red-500 text-white text-[10px] sm:text-[11px] font-semibold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full">
                {/* {unreadCount} */}
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}

            {/* showNotifications  */}
            <div
              className={`fixed top-[65px] left-0 sm:left-auto sm:right-[100px] md:right-[180px]
                w-full sm:w-[380px] bg-white rounded-lg shadow-lg z-50
                max-h-[600px] overflow-y-auto transition
                transition-transform transition-opacity duration-350 ease-out origin-top
                ${showNotifications ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"}`}
            >
              <div className="flex items-center justify-between px-4 py-3  bg-gray-50 border-b border-gray-300 rounded-lg">
                <p className="text-gray-800 font-medium text-xl">
                  {" "}
                  Notifications{" "}
                </p>
                <button
                  onClick={handleDropdownClose}
                  className="cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>

              {top5DropdownNotifications.length === 0 ? (
                <p className="flex flex-col justify-center items-center gap-1 py-[50px] text-gray-500 text-base">
                  <i className="fa-regular  fa-bell"></i> No notifications
                </p>
              ) : (
                top5DropdownNotifications.map((n) => (
                  <div
                    key={n._id}
                    className={`flex items-center gap-5 p-3 border-b border-gray-200 cursor-pointer`}
                  >
                    <span
                      className={`mt-1  relative ${n.isRead ? "text-green-500" : "text-red-500"}`}
                    >
                      {n.isRead ? (
                        <>
                          <i className="fa-regular fa-bell"></i>
                          <span className="absolute -top-3 -right-1">
                            <i class="fa-solid text-[9px] fa-check"></i>
                          </span>
                        </>
                      ) : (
                        <>
                          <i className="fa-regular fa-bell"></i>
                          <span className="w-1 h-1 bg-red-500 absolute top-[1px] right-[2px] rounded-full"></span>
                        </>
                      )}
                    </span>

                    <div className="flex-1">
                      <p className="text-xs sm:text-sm mb-1 text-gray-700 line-clamp-2">
                        {n.message}
                      </p>

                      <p className="text-xs text-gray-400">
                        {n.createdAt &&
                          timeLabels[n.type] &&
                          `${timeLabels[n.type]} : ${getTimeAgo(n.createdAt)}`}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div>
                <p
                  className="text-sm sm:text-base text-center p-2 sm:p-3 m-2 text-green-500 cursor-pointer bg-green-50 hover:bg-green-100 flex items-center justify-center gap-2 rounded-lg"
                  onClick={!allRead ? handleMarkAll : null}
                >
                  {allRead ? (
                    <>
                      <i className="fa-solid fa-check"></i>
                      <span>All marked</span>
                    </>
                  ) : (
                    "Mark all as read"
                  )}
                </p>

                <p
                  className="text-sm sm:text-base text-center p-2 sm:p-3 m-2 text-green-500 cursor-pointer bg-green-50 hover:bg-green-100 rounded-lg"
                  onClick={handleAllNotifications}
                >
                  View All Notifications
                </p>
              </div>
            </div>
            {/* )} */}
          </div>

          {/* Logout */}
          <div className="hidden md:block">
            <button
              onClick={logout}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm lg:text-base px-4 lg:px-6 py-2 rounded-full cursor-pointer"
            >
              <i className="fa-solid fa-arrow-right-from-bracket mr-1"></i>
              Logout
            </button>
          </div>

          {/*  Sidebar Button (Mobile Only) */}
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="md:hidden text-xl sm:text-2xl cursor-pointer"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      )}

      {/* right side worker  */}
      {wToken && (
        <div className="flex items-center gap-2 sm:gap-4 md:gap-5">
          {/* 🔔 Notification */}
          <div className="relative" ref={notificationRef}>
            <div
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex items-center justify-center text-lg w-10 h-10 sm:w-11 sm:h-11 rounded-full cursor-pointer hover:bg-green-50 hover:text-green-500"
            >
              <i className="fa-regular fa-bell"></i>
            </div>

            {unreadCount > 0 && (
              <span className="absolute top-[1px] right-[3px] sm:top-0 sm:right-0 bg-red-500 text-white text-[9px] sm:text-[11px] font-semibold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}

            <div
              className={`fixed top-[67px] left-0 sm:left-auto sm:right-[100px] md:right-[240px]
                w-full sm:w-[380px] bg-white rounded-lg shadow-lg z-50
                max-h-[600px] overflow-y-auto transition
                transition-transform transition-opacity duration-350 ease-out origin-top
                ${showNotifications ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"}`}
            >
              <div className="flex items-center justify-between px-4 py-3  bg-gray-50 border-b border-gray-300 rounded-lg">
                <p className="text-gray-800 font-medium text-lg sm:text-xl">
                  {" "}
                  Notifications{" "}
                </p>
                <button
                  onClick={handleDropdownClose}
                  className="cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>

              {top5DropdownNotifications.length === 0 ? (
                <p className="flex flex-col justify-center items-center gap-1 py-[90px] text-gray-500 text-base">
                  <i className="fa-regular  fa-bell"></i> No notifications
                </p>
              ) : (
                top5DropdownNotifications.map((n) => (
                  <div
                    key={n._id}
                    className={`flex items-center gap-5 px-3 py-4 border-b border-gray-200 cursor-pointer 
                    ${n.type === "warning" ? "bg-red-50 hover:bg-red-100" : "hover:bg-gray-50"}`}
                  >
                    <span
                      className={`mt-1  relative ${n.isRead ? "text-green-500" : "text-red-500"}`}
                    >
                      {n.isRead ? (
                        <>
                          <i className="fa-regular fa-bell"></i>
                          <span className="absolute -top-3 -right-2">
                            <i class="fa-solid text-xs fa-check"></i>
                          </span>
                        </>
                      ) : (
                        <>
                          <i className="fa-regular fa-bell"></i>
                          <span className="w-1 h-1 bg-red-500 absolute top-[1px] right-[2px] rounded-full"></span>
                        </>
                      )}
                    </span>

                    <div className="flex-1">
                      <p className="text-[13px] sm:text-sm  mb-1 text-gray-700">
                        {n.type === "warning" && (
                          <i className="fa-solid fa-triangle-exclamation text-red-400 mr-1"></i>
                        )}
                        {n.message}
                      </p>

                      <p className={`text-xs text-gray-400`}>
                        {n.createdAt &&
                          timeLabels[n.type] &&
                          `${timeLabels[n.type]} : ${getTimeAgo(n.createdAt)}`}
                      </p>
                    </div>
                  </div>
                ))
              )}

              {notifications.length > 0 && (
              <div>
                <p
                  className="text-sm sm:text-base text-center p-2 sm:p-3 m-2 text-green-500 cursor-pointer bg-green-50 hover:bg-green-100 flex items-center justify-center gap-2 rounded-lg"
                  onClick={!allRead ? handleMarkAll : null}
                >
                  {allRead ? (
                    <>
                      <i className="fa-solid fa-check"></i>
                      <span>All marked</span>
                    </>
                  ) : (
                    "Mark all as read"
                  )}
                </p>

                <p
                  className="text-sm sm:text-base rounded-lg text-center p-2 sm:p-3 m-2 text-green-500 cursor-pointer bg-green-50 hover:bg-green-100 rounded-lg"
                  onClick={handleAllNotifications}
                >
                  View All Notifications
                </p>
              </div>
              )}
            </div>
          </div>

          {/*  Profile + Logout (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <img
              onClick={() => {
                navigate("/worker-profile");
                scrollTo(0, 0);
              }}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover bg-gray-100 cursor-pointer"
              src={profileData?.image || assets.upload_area}
              alt="profile"
            />

            <button
              onClick={logout}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm lg:text-base px-4 lg:px-6 py-2 font-medium rounded-full cursor-pointer hover:scale-[1.03] transition-all duration-300"
            >
              <i className="fa-solid fa-arrow-right-from-bracket mr-1"></i>
              Logout
            </button>
          </div>

          {/* Sidebar Button (Mobile Only) */}
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="md:hidden text-xl sm:text-2xl cursor-pointer"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
