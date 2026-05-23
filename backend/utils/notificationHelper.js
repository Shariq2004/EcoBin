const Notification = require("../models/notificationModel"); // path adjust kar lo
const { format, isToday, isTomorrow } = require("date-fns");

//  Create a new notification
const createNotification = async (options) => {
  try {
    const notification = await Notification.create(options);
    return notification;
  } catch (err) {
    console.error("Error creating notification:", err);
    throw err;
  }
};

// get notification
const getNotifications = async ({ recipientRole,userId, workerId,adminId,}) => {
  try {
    if (!recipientRole) throw new Error("recipientRole is required");

    const filter = { recipientRole };

    if (userId) filter.userId = userId;
    if (workerId) filter.workerId = workerId;
    if (adminId) filter.adminId = adminId;

    const notifications = await Notification.find(filter).sort({
      createdAt: -1,
    });
    return notifications;
  } catch (err) {
    console.error("Error fetching notifications:", err);
    throw err;
  }
};

module.exports = { createNotification, getNotifications };
