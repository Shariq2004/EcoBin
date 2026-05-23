const express = require("express");
const {
  loginWorker,
  workerAssignReports,
  updateReportStatus,
  workerProfile,
  updateWorkerProfile,
  workerDashboardData,
  assignReportDetail,
  verifyWaste,
  completeReport,
  confirmWastebyWorker,
} = require("../controllers/workerController.js");
const authWorker = require("../middlewares/authWorker.js");
const upload = require("../middlewares/multer.js");

const workerRouter = express.Router();

workerRouter.post("/login", loginWorker);
workerRouter.get("/assign-reports", authWorker, workerAssignReports);
workerRouter.get("/assign-report/:id", authWorker, assignReportDetail);
workerRouter.put("/update-status/:reportId", authWorker, updateReportStatus);
workerRouter.get("/profile", authWorker, workerProfile);
workerRouter.post("/update-profile",authWorker,upload.single("image"),updateWorkerProfile,);
workerRouter.get("/dashboard-data", authWorker, workerDashboardData);
workerRouter.post("/verify-waste/:reportId",authWorker,upload.single("image"),verifyWaste,);
workerRouter.post("/complete-report/:reportId", authWorker, completeReport);
workerRouter.post("/waste-confirm", authWorker, confirmWastebyWorker);

module.exports = workerRouter;
