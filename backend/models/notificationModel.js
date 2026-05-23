const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      default: null,
    },
    adminId: {
      type: String,
      default: null,
    },
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      default: null,
    },
    recipientRole: {
      type: String,
      enum: ["user", "worker", "admin"],
      required: true,
    },
    type: {
      type: String,
      enum: [
        "newReport",
        "reportAssigned",
        "reportCompleted",
        "rewardEarned",
        "reportDelayed",
        "warning",
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      default: null,
    },
    createdBy: {
      type: String,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const notificationModel = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

module.exports = notificationModel;
