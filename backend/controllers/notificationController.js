const Notification = require("../models/notificationModel");
const { getNotifications } = require("../utils/notificationHelper");

const getNotificationsByRole = async (req, res) => {
  try {
    const { role, id } = req.params;

    const notifications = await getNotifications({
      recipientRole: role,
      userId: role === "user" ? id : undefined,
      workerId: role === "worker" ? id : undefined,
      adminId: role === "admin" ? id : undefined,
    });

    res.json({ success: true, notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const markAllAsReadByRole = async (req, res) => {
  try {
    const { role, id } = req.params;
    const filter = { recipientRole: role, isRead: false };

    if (role === "user") filter.userId = id;
    else if (role === "worker") filter.workerId = id;
    else if (role === "admin") filter.adminId = id;

    const result = await Notification.updateMany(filter, { isRead: true });

    res.json({
      success: true,
      message: `All notifications marked as read`,
      updatedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true },
    );

    res.json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Count unread notifications
const countUnreadNotifications = async (req, res) => {
  try {
    const { role, id } = req.params;
    const filter = { recipientRole: role, isRead: false };
    if (role === "user") filter.userId = id;
    if (role === "worker") filter.workerId = id;
    if (role === "admin") filter.adminId = id;

    const count = await Notification.countDocuments(filter);
    res.json({ success: true, count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// notificationController.js
const deleteNotificationById = async (req, res) => {
  const { role, id } = req.params;

  try {
    const deleted = await Notification.findOneAndDelete({
      _id: id,
      ...(role === "admin"
        ? { adminId: "admin895461" }
        : { userId: req.userId }), // worker sirf apni delete kar sakta
    });

    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });

    return res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getNotificationsByRole,
  markNotificationAsRead,
  markAllAsReadByRole,
  countUnreadNotifications,
  deleteNotificationById,
};
