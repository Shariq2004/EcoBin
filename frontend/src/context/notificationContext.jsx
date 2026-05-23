import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-hot-toast";

const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children, userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const getAllNotifications = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/notifications/user/${userId}`,
      );
      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const getUnreadCount = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/notifications/count/user/${userId}`,
      );
      if (data.success) {
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/notifications/read/all/user/${userId}`,
      );

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
      const { data } = await axios.patch(
        `${backendUrl}/api/notifications/read/user/${id}`,
      );

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

  useEffect(() => {
    if (!userId) return;
    getAllNotifications();
    getUnreadCount();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const s = io(backendUrl);
    setSocket(s);

    s.emit("joinRoom", userId.toString());

    // Listen for reward notifications
    s.on("rewardEarned", (data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast.success(data.message);
    });

    s.on("reportCompleted", (data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast.success(data.message);
    });

    s.on("reportAssigned", (data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast.success(data.message);
    });

    return () => s.disconnect();
  }, [userId]);

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
        getAllNotifications,
        getUnreadCount,
        markSingleAsRead,
        markAllAsRead,
        formatDateTime,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
