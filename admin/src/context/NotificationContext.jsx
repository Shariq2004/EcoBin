import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";

const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children, userId, userRole }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const ADMIN_ID = "admin895461";

  const getAllNotification = async () => {
    try {
      const url =
        userRole === "admin"
          ? `${backendUrl}/api/notifications/admin/${ADMIN_ID}`
          : `${backendUrl}/api/notifications/${userRole}/${userId}`;

      const { data } = await axios.get(url);

      if (data.success) {
        setNotifications(data.notifications);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getUnreadCount = async () => {
    try {
      const url =
        userRole === "admin"
          ? `${backendUrl}/api/notifications/count/admin/${ADMIN_ID}`
          : `${backendUrl}/api/notifications/count/${userRole}/${userId}`;

      const { data } = await axios.get(url);

      if (data.success) {
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const url =
        userRole === "admin"
          ? `${backendUrl}/api/notifications/read/all/admin/${ADMIN_ID}`
          : `${backendUrl}/api/notifications/read/all/${userRole}/${userId}`;

      const { data } = await axios.patch(url);

      if (data.success) {
        toast.success(data.message);

        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const markSingleAsRead = async (id) => {
    try {
      const url =
        userRole === "admin"
          ? `${backendUrl}/api/notifications/read/admin/${id}`
          : `${backendUrl}/api/notifications/read/${userRole}/${id}`;

      const { data } = await axios.patch(url);

      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
        );

        setUnreadCount((prev) => Math.max(prev - 1, 0));
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const url =
        userRole === "admin"
          ? `${backendUrl}/api/notifications/admin/${id}`
          : `${backendUrl}/api/notifications/${userRole}/${id}`;

      const { data } = await axios.delete(url);

      if (data.success) {
        setNotifications((prev) => {
          const deletedNotification = prev.find((n) => n._id === id);

          if (deletedNotification && !deletedNotification.isRead) {
            setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));
          }

          return prev.filter((n) => n._id !== id);
        });
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (!userId && userRole !== "admin") return;

    getAllNotification();
    getUnreadCount();
  }, [userId, userRole]);

  useEffect(() => {
    if (!userId && userRole !== "admin") return;

    const s = io(backendUrl);
    setSocket(s);

    s.emit("joinRoom", userRole === "admin" ? "admin" : userId);

    const events = [
      "newReport",
      "reportAssigned",
      "reportCompleted",
      "reportDelayed",
      "warning",
    ];

    events.forEach((event) => {
      s.on(event, (data) => {
        setNotifications((prev) => [data, ...prev]);
        setUnreadCount((prev) => prev + 1); // badge update realtime
      });
    });

    return () => s.disconnect();
  }, [userId, userRole]);

  // Reusable date formatter
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        socket,
        getUnreadCount,
        markSingleAsRead,
        markAllAsRead,
        formatDateTime,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// mark notification as read
// const markAsRead = async (notificationId) => {
//   try {
//     await fetch(`http://localhost:3000/api/notifications/read/${notificationId}`, { method: "PATCH" });
//     setNotifications((prev) =>
//       prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
//     );
//   } catch (err) {
//     console.error(err);
//   }
// };

//   const markAllAsRead = async () => {
//   try {
//     await fetch(`http://localhost:3000/api/notifications/read/all/${userRole}/${userId}`, { method: "PATCH" });
//     setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
//   } catch (err) {
//     console.error(err);
//   }
// };

// unread count
// const unreadCount = notifications.filter((n) => !n.isRead).length;
