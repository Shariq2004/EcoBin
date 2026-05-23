import React, { useState } from "react";
import { useNotification } from "../context/NotificationContext";

const Notifications = () => {
  const {
    notifications,
    unreadCount,
    markSingleAsRead,
    markAllAsRead,
    formatDateTime,
    deleteNotification,
  } = useNotification();
  const [filter, setFilter] = useState("all");
  const [isMarking, setIsMarking] = useState(false);

  const notificationTitles = {
    newReport: "New Report Created",
    reportCompleted: "Report Completed",
    reportAssigned: "Report Assigned",
    warning: "Warning",
    reportDelayed: "Report Delayed",
  };

  const timeLabels = {
    newReport: "Reported At",
    reportCompleted: "Completed At",
    reportAssigned: "Assigned At",
    warning: "Warn At",
    reportDelayed: "Delayed At",
  };

  const handleClick = async () => {
    setIsMarking(true);
    try {
      await markAllAsRead();
    } catch (err) {
      console.error(err);
    }
    setIsMarking(false);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;

    if (filter === "new") {
      const oneDay = 24 * 60 * 60 * 1000;
      const createdTime = new Date(n.createdAt).getTime();
      const now = Date.now();

      return now - createdTime <= oneDay;
    }

    return true;
  });

  return (
    <div className="py-7 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Notifications
          </h2>
          <p className="text-xs md:text-sm text-gray-500">
            You've <span className="font-semibold">{unreadCount}</span> unread
            notifications
          </p>
        </div>

        {notifications.length > 0 ? 
         notifications.every((n) => n.isRead) ? (
          <span className="bg-gray-200 text-gray-500 px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
            All Marked
          </span>
        ) : (
          <button
            onClick={handleClick}
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm text-white cursor-pointer ${
              isMarking
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={isMarking}
          >
            {notifications.length > 0 && isMarking ? (
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-spinner fa-spin"></i> Marking...
              </span>
            ) : (
              "Mark all as read"
            )}
          </button>
        ) : null}
      </div>

      {/* Filters */}
      <div className="flex gap-6 border-b border-gray-300 mb-6 text-sm font-medium">
        <button
          onClick={() => setFilter("all")}
          className={`${filter === "all" && "text-green-600 border-b-2 border-green-500"} pb-1 cursor-pointer`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("new")}
          className={`${filter === "new" && "text-green-600 border-b-2 border-green-500"} pb-1 cursor-pointer`}
        >
          New
        </button>

        <button
          onClick={() => setFilter("unread")}
          className={`${filter === "unread" && "text-green-600 border-b-2 border-green-500"} pb-1 cursor-pointer`}
        >
          Unread
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((n) => (
          <div
            key={n._id}
            className={`flex flex-col xl:flex-row items-start justify-between px-4 py-3 gap-1 rounded-lg border transition  
            ${n.type === "warning" ? "bg-red-50 hover:bg-red-100 border-red-200 " : "bg-white hover:bg-gray-50 border-gray-200 "}
            `}
          >
            {/* Left Section */}
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div
                className={`hidden relative w-10 h-10 xl:flex items-center justify-center bg-green-100 rounded-lg
               ${!n.isRead ? "bg-red-100 text-red-600" : "bg-green-50 text-green-600"}`}
              >
                {n.isRead ? (
                  <>
                    <i className="fa-regular fa-bell"></i>
                    <span className="absolute -top-1 right-[7px]">
                      <i class="fa-solid text-[9px] fa-check"></i>
                    </span>
                  </>
                ) : (
                  <>
                    <i className="fa-regular fa-bell"></i>
                    <span className="w-1 h-1 bg-red-500 absolute top-[9px] right-[12px] rounded-full"></span>
                  </>
                )}
              </div>

              <div className="flex flex-col lg:gap-1 max-w-[550px]">
                <p
                  className={`text-base font-medium  ${n.type === "warning" ? "text-red-600" : "text-gray-800"}`}
                >
                  {notificationTitles[n.type]}

                  {n.type === "warning" && (
                    <span><i className="fa-solid fa-triangle-exclamation text-xs md:text-sm text-red-500 ms-1"></i> By Admin</span> 
                  )}
                </p>

                <p className="text-sm text-gray-500">{n.message}</p>
              </div>
            </div>

            <div className="flex flex-col xl:items-end gap-3 ">
              <div>
                <p className="text-xs text-gray-500">
                  {n.createdAt && timeLabels[n.type]
                    ? `${timeLabels[n.type]} : ${formatDateTime(n.createdAt)}`
                    : ""}
                </p>
              </div>

              <div className="flex flex-col md:flex-row lg:items-center gap-2">
                {!n.isRead ? (
                  <>
                    <span className="text-xs text-center text-red-600 bg-red-200 px-3 py-1 rounded-full w-fit">
                      Unread
                    </span>

                    <button
                      onClick={() => markSingleAsRead(n._id)}
                      className="px-3 py-1 bg-green-100 rounded-full text-green-600 hover:bg-green-200 text-sm cursor-pointer"
                    >
                      Mark as Read
                    </button>
                  </>
                ) : (
                  <span className="text-xs sm:text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full w-fit">
                    Read
                  </span>
                )}

                <button
                  onClick={() => deleteNotification(n._id)}
                  className="px-3 py-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200 text-sm cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="flex flex-col items-center gap-1 sm:gap-2 text-gray-400 py-40">
            <i className="fa-regular fa-bell text-lg sm:text-[30px]"></i>
            <span className="text-sm sm:text-lg">
              {filter === "new"
                ? "No new notifications found"
                : filter === "unread"
                  ? "No unread notifications found"
                  : "No notifications found"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
