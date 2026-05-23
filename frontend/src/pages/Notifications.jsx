import React, { useState } from "react";
import { useNotification } from "../context/notificationContext";

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
    reportCompleted: "Report Completed",
    reportAssigned: "Report Assigned",
    rewardEarned: "Reward Earned",
  };

  const timeLabels = {
    reportCompleted: "Completed At",
    reportAssigned: "Assigned At",
    rewardEarned: "Reward Earned At",
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

  const oneDay = 24 * 60 * 60 * 1000;
  const now = Date.now();

  const allNotifications = notifications;
  const newNotifications = notifications.filter((n) => {
    const createdTime = new Date(n.createdAt).getTime();
    return now - createdTime <= oneDay;
  });

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;

    if (filter === "new") {
      const createdTime = new Date(n.createdAt).getTime();
      return now - createdTime <= oneDay;
    }

    return true;
  });

  return (
    <div className="w-full px-5 sm:px-9 lg:px-[9%] pt-20 md:pt-24 pb-15 bg-[#F5FBF9] min-h-screen">
      <div className="flex flex-row sm:items-center  justify-between  mb-6">
        <h2 className="text-xl md:text-3xl font-medium md:font-semibold text-gray-800">
          Notifications
        </h2>

        {notifications.every((n) => n.isRead) ? (
          <span className="flex items-center bg-gray-200 text-gray-500 px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
            All Marked
          </span>
        ) : (
          <button
            onClick={handleClick}
            className={`px-2 py-[1px] sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm text-white cursor-pointer ${
              isMarking
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={isMarking}
          >
            {isMarking ? (
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-spinner fa-spin"></i> Marking...
              </span>
            ) : (
              "Mark all as read"
            )}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4 sm:gap-6 border-b border-gray-300 mb-3 sm:mb-6 overflow-x-auto text-sm font-medium">
        <button
          onClick={() => setFilter("all")}
          className={`${filter === "all" && "text-green-600 border-b-2 border-green-500"} pb-1 cursor-pointer whitespace-nowrap`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("new")}
          className={`${filter === "new" && "text-green-600 border-b-2 border-green-500"} pb-1 cursor-pointer whitespace-nowrap`}
        >
          New
        </button>

        <button
          onClick={() => setFilter("unread")}
          className={`${filter === "unread" && "text-green-600 border-b-2 border-green-500"} pb-1 cursor-pointer whitespace-nowrap`}
        >
          Unread
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {/* Info Text */}
        <p className="text-xs md:text-[15px] text-gray-500">
          {filter === "new"
            ? `You've ${newNotifications.length} new notifications.`
            : filter === "unread"
              ? `You've ${unreadCount} unread notifications.`
              : `You've ${allNotifications.length} notifications.`}
        </p>

        {filteredNotifications.map((n) => (
          <div
            key={n._id}
            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-4 py-3 rounded-lg border transition
            ${!n.isRead ? "bg-red-50 border-red-200" : "border-gray-200 bg-white"}`}
          >
            {/* Left Section */}
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              {/* Icon */}
              <div
                className={`hidden relative w-10 h-10 sm:flex items-center justify-center rounded-lg
                ${!n.isRead ? "bg-red-100 text-red-600" : "bg-green-50 text-green-600"}`}
              >
                <i className="fa-regular fa-bell"></i>
                {!n.isRead ? (
                  <span className="w-1 h-1 bg-red-500 absolute top-[9px] right-[12px] rounded-full"></span>
                ) : (
                  <span className="absolute -top-1 right-[7px]">
                    <i className="fa-solid text-[9px] fa-check"></i>
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-sm sm:text-base font-medium text-gray-800">
                  {notificationTitles[n.type]}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">{n.message}</p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col sm:items-end gap-2 sm:gap-3 w-full sm:w-auto">
              <div>
                <p className="text-xs md:text-sm text-gray-500">
                  {n.createdAt && timeLabels[n.type]
                    ? `${timeLabels[n.type]} : ${formatDateTime(n.createdAt)}`
                    : ""}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!n.isRead ? (
                  <>
                    <span className="text-xs text-red-600 bg-red-200 px-3 py-1 rounded-full">
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
                  <span className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    Read
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="flex flex-col items-center gap-1 sm:gap-2 text-gray-400 py-20 sm:py-32">
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
