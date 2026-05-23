require("dotenv").config();
const { verifyWasteImage } = require("../utils/verifyWasteImage");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Report = require("../models/reportModel");
const workerModel = require("../models/workerModel");
const cloudinary = require("cloudinary").v2;
const { autoAssignReports } = require("../utils/assigneReport");
const zoneModel = require("../models/zoneModel");
const giveRewardPoints = require("../utils/rewardService");
const { createNotification } = require("../utils/notificationHelper");
const updateDelayedReports = require("../utils/delayedReport");
const { Socket } = require("socket.io");


const detectZone = async (location) => {
  const zones = await zoneModel.find();

  for (let zone of zones) {
    const found = zone.areas.find((area) =>
      location.toLowerCase().includes(area.toLowerCase()),
    );

    if (found) {
      return zone._id;
    }
  }

  return null;
};

// api for verify image
const verifyImage = async (req, res) => {
  try {
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Image required",
      });
    }

    const imageBuffer = fs.readFileSync(imageFile.path);

    const result = await verifyWasteImage(imageBuffer, imageFile.mimetype);

    if (!result.success) {
      return res.status(400).json(result);
    }

    const verificationToken = jwt.sign(
      {
        type: "imageVerification",
        verified: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: "5m" },
    );

    return res.json({
      success: true,
      wasteType: result.wasteType,
      quantity: result.quantity,
      confidence: result.confidence,
      verificationToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};


const createReport = async (req, res) => {
  try {
    const { wasteType, quantity, location, verificationToken } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authorized",
      });
    }
    console.log(req.body);
    console.log(req.file);

    if (!verificationToken) {
      return res.status(400).json({
        success: false,
        message: "Image not verified",
      });
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(verificationToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    if (decoded.type !== "imageVerification" || !decoded.verified) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token",
      });
    }

    // fields check
    if (!wasteType || !quantity || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }


    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const zoneId = await detectZone(location);

    if (!zoneId) {
      return res.status(400).json({
        success: false,
        message: "Zone not found for this location",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "ecobin_reports",
    });

    fs.unlinkSync(req.file.path);

  
    const report = await Report.create({
      userId,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      wasteType,
      quantity,
      location,
      zone: zoneId,
      status: "Pending",
    });

    // Fetch user name from DB
    const user = await User.findById(userId);

    const notification = await createNotification({
      adminId: process.env.ADMIN_ID,
      recipientRole: "admin",
      type: "newReport",
      message: `New report created by ${user.name} at ${report.location}`,
      location: report.location,
      createdBy: user.name,
      reportId: report._id,
    });

    const io = req.app.get("io");
    io.to("admin").emit("newReport", notification);


    const assignment = await autoAssignReports(io);
    console.log("Assigned:", assignment);

    res.json({
      success: true,
      message: "Report created  successfully",
      report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create report",
    });
  }
};

// API for get user report
const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "assignedWorker",
        select: "-password",
        populate: { path: "zone", select: "name" },
      });

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// API to cancel report

const cancelReport = async (req, res) => {
  try {
    const userId = req.userId;
    const { reportId } = req.body;

    const reportData = await Report.findById(reportId);

    if (!reportData) {
      return res.json({ success: false, message: "Report not found" });
    }

    if (reportData.userId.toString() !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    await Report.findByIdAndUpdate(reportId, {
      isCanceled: true,
      status: "Cancelled",
      canceledAt: new Date(),
    });

    res.json({ success: true, message: "Report Cancelled Successfullly" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports = { verifyImage, createReport, getMyReports, cancelReport };
