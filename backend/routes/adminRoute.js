const express = require("express");
const {
  addWorker,
  loginAdmin,
  allWorkers,
  addZone,
  allZones,
  updateZone,
  deleteZone,
  getAllReportsForAdmin,
  adminDashboardData,
  detailWorker,
  getReportDetails,
  deleteReport,
  deleteWorker,
  rejectReport,
  sendWarningToWorker,
  extendReportTime,
} = require("../controllers/adminController.js");
const upload = require("../middlewares/multer.js");
const authAdmin = require("../middlewares/authAdmin.js");
const { ChangeAvailability } = require("../controllers/workerController.js");

const adminRouter = express.Router();

adminRouter.post("/add-worker", authAdmin, upload.single("image"), addWorker);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-workers", authAdmin, allWorkers);
adminRouter.post("/change-availability", authAdmin, ChangeAvailability);
adminRouter.post("/add-zone", authAdmin, addZone);
adminRouter.put("/update-zone/:id", authAdmin, updateZone);
adminRouter.delete("/delete-zone/:id", authAdmin, deleteZone);
adminRouter.get("/reports", authAdmin, getAllReportsForAdmin);
adminRouter.get("/report/:id", authAdmin, getReportDetails);
adminRouter.get("/dashboard", authAdmin, adminDashboardData);
adminRouter.get("/worker/:id", authAdmin, detailWorker);
adminRouter.delete("/report/:id", authAdmin, deleteReport);
adminRouter.delete("/worker/:id", authAdmin, deleteWorker);
adminRouter.put("/report-reject/:id", authAdmin, rejectReport);
adminRouter.post("/send-warning", authAdmin, sendWarningToWorker);
adminRouter.post("/extend-report-time", authAdmin, extendReportTime);

module.exports = adminRouter;
