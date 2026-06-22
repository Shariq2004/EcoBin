import React, { useContext, useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import useClickOutside from "../hooks/useClickOutside";
import { useNotification } from "../context/notificationContext";
import { formatDistanceToNow } from "date-fns";

const Navbar = () => {

  const { token, setToken, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const profileRef = useRef();

  
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef();
  const { notifications, unreadCount, markAllAsRead } = useNotification();

  const top5DropdownNotifications = notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const allRead = top5DropdownNotifications.every(
    (notification) => notification.isRead,
  );

  const getTimeAgo = (date) => formatDistanceToNow(new Date(date), { addSuffix: true });

  const timeLabels = {
    reportCompleted: "Completed",
    reportAssigned: "Assigned",
    rewardEarned: "Earned",
  };



  const handleAllNotifications = () => {
    navigate("/all-notifications");
    setShowNotifications(false);
  };

  const handleDropdownClose = () => {
    setShowNotifications(false);
  };

  const handleMarkAll = () => {
    markAllAsRead();
  };

  useClickOutside(profileRef, () => {
    setOpenProfileMenu(false);
  });

  useClickOutside(notificationRef, () => {
    setShowNotifications(false);
  });


  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    toast.success("Logout successfully");
    window.location.href = "/login";
    scrollTo(0, 0);
  };

//   const logout = () => {
//   localStorage.removeItem("token");

//   setToken(false);
//   setReports([]);
//   setTransactions([]);
//   setRewardBalance(0);

//   toast.success("Logout successfully");

//   navigate("/login");
// };

  return (
    <>
      {/* Navbar */}
      <div className=" fixed top-0 left-0 w-full h-14 sm:h-16 z-50 bg-white shadow-sm flex items-center justify-between px-3 sm:px-8 lg:px-[8%]">
        <div
          className="flex items-center gap:1 cursor-pointer"
          onClick={() => {
            navigate("/");
            scrollTo(0, 0);
          }}
        >
          <img
            className="w-10 md:w-12 lg:w-13"
            src={assets.logo}
            alt="EcoBin"
          />
          <h1 className="text-2xl md:text-3xl font-semibold text-green-600 select-none">
            EcoBin
          </h1>
        </div>

        {/* <a  href="https://ecobin-admin-platform.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-0.5 text-xs rounded-full border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-200"
        >
         Admin
        </a> */}

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-5 lg:gap-7 text-sm lg:text-base">
          <NavLink to="/" onClick={() => scrollTo(0, 0)}>
            <li className="hover:text-green-500">Home</li>
          </NavLink>
          <NavLink to="/report-waste" onClick={() => scrollTo(0, 0)}>
            <li className="hover:text-green-500">Report Waste</li>
          </NavLink>
          <NavLink to="/my-request" onClick={() => scrollTo(0, 0)}>
            <li className="hover:text-green-500">My Request</li>
          </NavLink>
          <NavLink to="/reward" onClick={() => scrollTo(0, 0)}>
            <li className="hover:text-green-500">Rewards</li>
          </NavLink>
        </ul>

        {/* Desktop Right */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          {token && userData ? (
            <>
              {/* Notifications & Rewards */}
              <div className="flex items-center gap-3">
                <div className="relative inline-block" ref={notificationRef}>
                  <div
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="flex items-center justify-center text-lg sm:text-xl w-10 h-10 sm:w-11 sm:h-11 rounded-full cursor-pointer hover:bg-green-50 hover:text-green-500"
                  >
                    <i className="fa-regular fa-bell"></i>
                  </div>

                  {unreadCount > 0 && (
                    <span className="absolute top-[1px] right-[3px] sm:top-0 sm:right-0 bg-red-500 text-white text-[9px] sm:text-[11px] font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}

 
                  {/* showNotifications  */}
                <div
                 className={`fixed top-[58px] md:top-[60px] left-0 sm:left-auto sm:right-[100px] md:right-[210px] lg:right-[280px] xl:right-[300px]
                 w-full sm:w-[380px] bg-white rounded-lg shadow-lg z-50
                 max-h-[600px] overflow-y-auto transition
                 transition-transform transition-opacity duration-350 ease-out origin-top
                 ${showNotifications ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"}`}
                >

                    <div className="flex items-center justify-between px-6 md:px-4 py-3  bg-gray-50 border border-gray-300 rounded-lg">
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
                      <p className="flex flex-col justify-center items-center gap-1 py-[100px] text-gray-400 text-base">
                        <i className="fa-regular sm:text-xl fa-bell"></i> No notifications
                      </p>
                    ) : (
                      top5DropdownNotifications.map((notification) => (
                        <div
                          key={notification._id}
                          className="flex items-center gap-5 px-6 py-3 md:p-3 border-b border-gray-200 cursor-pointer"
                        >
                          <span
                            className={`mt-1  relative ${notification.isRead ? "text-green-500" : "text-red-500"}`}
                          >
                            {notification.isRead ? (
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
                            <p className="text-[13px] sm:text-sm text-gray-700 mb-1 line-clamp-2">
                              {notification.message}
                            </p>
     
                            <p className="text-xs text-gray-400">
                              {notification.createdAt &&
                              timeLabels[notification.type]
                                ? `${timeLabels[notification.type]} : ${getTimeAgo(notification.createdAt)}`
                                : ""}
                            </p>
   
                          </div>
                        </div>
                      ))
                    )}

                   {notifications.length > 0 && (
                    <div>
                      <p
                        className="text-center p-2  m-2 rounded-lg text-green-500 cursor-pointer bg-green-50 hover:bg-green-100 flex items-center justify-center gap-2"
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
                        className="rounded-lg text-center p-2 m-2 text-green-500 cursor-pointer  bg-green-50 hover:bg-green-100"
                        onClick={handleAllNotifications}
                      >
                        View All Notifications
                      </p>
                    </div>
                    )}

                  </div>
                </div>

                <div
                  onClick={() => {
                    navigate("/reward");
                    scrollTo(0, 0);
                  }}
                  className="hidden md:flex items-center gap-1 md:px-2 lg:px-3  md:py-0.5 lg:py-1 bg-green-50 rounded-full cursor-pointer"
                >
                  <i className="fa-solid fa-coins text-green-500 text-base md:text-xl"></i>
                  <p className="md:text-base lg:text-medium font-semibold">
                    {userData?.rewardPoints || 0}
                  </p>
                </div>
              </div>

              {/* profile  */}
              <div className="relative" ref={profileRef}>
                <div
                  onClick={() => setOpenProfileMenu(!openProfileMenu)}
                  className="hidden md:flex items-center gap-2 cursor-pointer"
                >
                  <img
                    className="w-8 rounded-full"
                    // src={userData.image || assets.upload_area} 
                    src={userData.image}
                    alt="profile"
                  />
                  <img
                    className={`w-2.5 transition-transform duration-300 ease-in-out 
                    ${openProfileMenu ? "rotate-180" : "rotate-0"}`}
                    src={assets.dropdown_icon}
                    alt="dropdown"
                  />
                </div>

                {/* Dropdown */}
                <div
                  className={`absolute top-13 right-4 w-[280px] overflow-hidden 
                  transition-all duration-400 ease-in-out
                  ${openProfileMenu ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}`}
                >
                  <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-300">
                    <div className="flex items-center gap-3">
                      <img
                        className="w-10 rounded-full"
                        src={userData.image}
                        alt="user"
                      />
                      <div className="flex flex-col">
                        <p className="text-gray-700 text-base">
                          {userData.name}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {userData.email}
                        </p>
                      </div>
                    </div>

                    <hr className="mt-4 mb-3 w-full text-gray-300" />

                    <div
                      onClick={() => {
                        navigate("/my-profile");
                        scrollTo(0, 0);
                        setOpenProfileMenu(false);
                      }}
                      className="flex items-center gap-2 cursor-pointer text-gray-600 mb-2 transition-all duration-300 hover:text-green-600"
                    >
                      <i className="fa-regular fa-user"></i>
                      <p>My Profile</p>
                    </div>

                    <div
                      onClick={() => {
                        navigate("/help-support");
                        scrollTo(0, 0);
                        setOpenProfileMenu(false);
                      }}
                      className="flex items-center gap-2 cursor-pointer text-gray-600 mb-2 transition-all duration-300 hover:text-green-600"
                    >
                      <i class="fa-regular fa-circle-question"></i>
                      <p>Help & Support</p>
                    </div>

                    <div
                      onClick={logout}
                      className="flex items-center gap-2 cursor-pointer text-gray-600 transition-all duration-300 hover:text-green-600"
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket"></i>
                      <p>Logout</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden md:block bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-6 py-2.5 rounded-full cursor-pointer"
            >
              Create Account
            </button>
          )}

          {/* Mobile Icons */}
          <div className="block md:hidden">
            <button onClick={() => setShowSidebar(true)}>
              <i className="fa-solid fa-bars text-2xl text-gray-700 cursor-pointer"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 right-0 h-full md:hidden w-[90%] sm:w-[60%] bg-white shadow-lg z-50
        transform ${showSidebar ? "translate-x-0" : "translate-x-full"} transition-transform duration-300`}
      >
        <div className="flex justify-between items-center p-4 shadow-sm">
          {token ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                className="w-10 rounded-full cursor-pointer"
                src={userData.image}
                alt="profile"
                onClick={() => {
                  navigate("/my-profile");
                  setShowSidebar(false);
                }}
              />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-700">
                  {userData.name}
                </p>
                <p className="text-xs sm:text-sm  font-medium text-gray-500">
                  {userData.email}
                </p>
              </div>
            </div>
          ) : (
            <h2 className="text-lg font-semibold text-green-600">EcoBin</h2>
          )}

          <button
            onClick={() => setShowSidebar(false)}
            className="flex items-center bg-gray-100 hover:bg-gray-200 p-2 sm:p-2 rounded-md cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-sm sm:text-xl md:text-2xl text-gray-700"></i>
          </button>
        </div>

        <ul className="flex flex-col gap-4 p-4 text-base">
          <NavLink
            to="/"
            onClick={() => {
              setShowSidebar(false);
              scrollTo(0, 0);
            }}
          >
            <li className="hover:text-green-500 cursor-pointer text-gray-700">
              <i class="fa-regular fa-house"></i> Home
            </li>
          </NavLink>
          <NavLink
            to="/report-waste"
            onClick={() => {
              setShowSidebar(false);
              scrollTo(0, 0);
            }}
          >
            <li className="hover:text-green-500 cursor-pointer text-gray-700">
              <i class="fa-solid fa-location-dot"></i> Report Waste
            </li>
          </NavLink>
          <NavLink
            to="/my-request"
            onClick={() => {
              setShowSidebar(false);
              scrollTo(0, 0);
            }}
          >
            <li className="hover:text-green-500 cursor-pointer text-gray-700">
              <i className="fa-regular fa-file-lines"></i> My Request
            </li>
          </NavLink>
          <NavLink
            to="/reward"
            onClick={() => {
              setShowSidebar(false);
              scrollTo(0, 0);
            }}
          >
            <li className="hover:text-green-500 cursor-pointer text-gray-700">
              <i className="fa-solid fa-sack-dollar"></i> Rewards
            </li>
          </NavLink>
          <NavLink
            to="/help-support"
            onClick={() => {
              setShowSidebar(false);
              scrollTo(0, 0);
            }}
          >
            <li className="hover:text-green-500 cursor-pointer text-gray-700">
              <i className="fa-solid fa-phone"></i> Help & Support
            </li>
          </NavLink>
        </ul>

        <div className="px-4 pt-1.5">
          {token ? (
            <button
              onClick={() => {
                logout();
                setShowSidebar(false);
              }}
              className="flex items-center justify-center gap-1 w-full bg-green-500 hover:bg-green-600 text-white py-1 rounded-md text-base font-semibold cursor-pointer"
            >
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                setShowSidebar(false);
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md text-sm font-semibold cursor-pointer"
            >
              Create Account
            </button>
          )}
        </div>
      </div>

      {/* Overlay */}
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
        ></div>
      )}
    </>
  );
};

export default Navbar;
