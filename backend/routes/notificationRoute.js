const express = require("express");
const {
  getNotificationsByRole,
  markNotificationAsRead,
  countUnreadNotifications,
  markAllAsReadByRole,
  deleteNotificationById,
} = require("../controllers/notificationController");

const notificationRouter = express.Router();

notificationRouter.get("/:role/:id", getNotificationsByRole);
notificationRouter.patch("/read/:role/:id", markNotificationAsRead);
notificationRouter.patch("/read/all/:role/:id", markAllAsReadByRole);
notificationRouter.get("/count/:role/:id", countUnreadNotifications);
notificationRouter.delete("/:role/:id", deleteNotificationById);

module.exports = notificationRouter;
