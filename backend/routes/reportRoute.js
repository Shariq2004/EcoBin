const express = require("express");
const Report = require("../models/reportModel.js");
const multer = require("multer");
const upload = require("../middlewares/multer.js");
const authUser = require("../middlewares/authUser.js");
const {
  verifyImage,
  createReport,
  getMyReports,
  cancelReport,
} = require("../controllers/reportController.js");

const reportRouter = express.Router();

reportRouter.post("/verify", authUser, upload.single("image"), verifyImage);
reportRouter.post("/create", authUser, upload.single("image"), createReport);
reportRouter.get("/my-reports", authUser, getMyReports);
reportRouter.post("/cancel-report", authUser, cancelReport);

module.exports = reportRouter;
