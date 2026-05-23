const Report = require("../models/reportModel");
const { createNotification } = require("../utils/notificationHelper");

const updateDelayedReports = async (io) => {
  try {
    const now = new Date();

    const delayedReports = await Report.find({
      expectedCompletion: { $lt: now },
      status: { $nin: ["Completed", "Delay"] },
    });

    for (let report of delayedReports) {
      report.previousStatus = report.status;
      report.status = "Delay";

      await report.save();

      // notification
      const adminNotification = await createNotification({
        adminId: "admin895461",
        recipientRole: "admin",
        type: "reportDelayed",
        message: `Report #${report._id} is delayed (was ${report.previousStatus})`,
        createdBy: "System",
        reportId: report._id,
      });

      if (io) {
        io.to("admin895461").emit("reportDelayed", adminNotification);
      }
    }
  } catch (error) {
    console.log("Error updating delayed reports:", error);
  }
};

module.exports = updateDelayedReports;
