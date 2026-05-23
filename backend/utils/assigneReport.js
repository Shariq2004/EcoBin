require("dotenv").config();
const User = require("../models/userModel");
const workerModel = require("../models/workerModel");
const reportModel = require("../models/reportModel");
const { createNotification } = require("../utils/notificationHelper");
const Settings = require("../models/settingsModel");

const autoAssignReports = async (io) => {
  try {
    const report = await reportModel
      .findOne({ status: "Pending", assignedWorker: null })
      .sort({ createdAt: 1 });
    console.log(report);

    if (!report) return { success: false, message: "Report not found" };

    const worker = await workerModel
      .findOne({
        zone: report.zone,
        status: "Available",
        isActive: true,
        "currentTask.reportId": null,
      })
      .sort({ totalTasksCompleted: 1 });

    console.log("Report Zone:", report.zone);
    console.log("Worker Zone Match Trying...");

    if (!worker) {
      return { success: false, message: "No worker available" };
    }

    const settings = await Settings.findOne();

    let quantityKg = 0;
    if (report.quantity) {
      const match = report.quantity.match(/\d+/);
      quantityKg = match ? parseFloat(match[0]) : 0;
    }

    let hours = 4;

    if (settings?.expectedCompletionByQuantity?.length) {
      const rules = [...settings.expectedCompletionByQuantity].sort(
        (a, b) => a.minKg - b.minKg,
      );

      const rule =
        rules.find((r) => quantityKg >= r.minKg && quantityKg < r.maxKg) ||
        rules[rules.length - 1];

      if (rule) hours = rule.hours;
    }

    const expectedCompletion = new Date(Date.now() + hours * 60 * 60 * 1000);

    await workerModel.findByIdAndUpdate(
      worker._id,
      {
        status: "Assigned",
        currentTask: {
          reportId: report._id,
          assignedAt: new Date(),
        },
      },
      { new: true },
    );

    await reportModel.findByIdAndUpdate(report._id, {
      assignedWorker: worker._id,
      status: "Assigned",
      assignedAt: new Date(),
      expectedCompletion: expectedCompletion,
    });

    const user = await User.findById(report.userId);

    // Create notification for worker
    const workerNotification = await createNotification({
      workerId: worker._id,
      recipientRole: "worker",
      type: "reportAssigned",
      message: `New Report assigned at ${report.location}`,
      location: report.location,
      createdBy: user ? user.name : "User",
      reportId: report._id,
    });

    // Create notification for user
    const userNotification = await createNotification({
      userId: user._id,
      recipientRole: "user",
      type: "reportAssigned",
      message: `Your report at ${report.location} has been assigned to a worker`,
      location: report.location,
      createdBy: "System",
      reportId: report._id,
    });

    // Create notification for admin
    const adminNotification = await createNotification({
      adminId: "admin895461",
      recipientRole: "admin",
      type: "reportAssigned",
      message: `Report #${report._id} created by ${user.name} has been assigned to worker ${worker.name}`,
      location: report.location,
      createdBy: "System",
      reportId: report._id,
    });

    // Emit socket notification to worker
    if (io) {
      io.to(worker._id.toString()).emit("reportAssigned", workerNotification);
      io.to(user._id.toString()).emit("reportAssigned", userNotification);
      io.to("admin895461").emit("reportAssigned", adminNotification);
    }

    return { success: true, message: "Task assigned", workerId: worker._id };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = { autoAssignReports };
