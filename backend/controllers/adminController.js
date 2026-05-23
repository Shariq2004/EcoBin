const validator = require("validator");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const workerModel = require("../models/workerModel.js");
const zoneModel = require("../models/zoneModel.js");
const reportModel = require("../models/reportModel.js");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel.js");
const { autoAssignReports } = require("../utils/assigneReport.js");
const { createNotification } = require("../utils/notificationHelper");

// API for login Admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email: process.env.ADMIN_EMAIL },
        process.env.JWT_SECRET,
        { expiresIn: "30d" },
      );

      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for adiing worker
const addWorker = async (req, res) => {
  try {
    const { name, email, password, phone, zone, address } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !phone || !zone || !address) {
      return res.json({ success: false, message: "Please fill all details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const zoneDoc = await zoneModel.findById(zone);

    if (!zoneDoc) {
      return res.json({
        success: false,
        message: "Zone not found",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const workerData = {
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      phone,
      zone: zoneDoc._id,

      address: JSON.parse(address),
    };

    const newWorker = new workerModel(workerData);
    await newWorker.save();

    res.json({ success: true, message: "Worker Added Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for login Admin
// const loginAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (
//       email === process.env.ADMIN_EMAIL &&
//       password === process.env.ADMIN_PASSWORD
//     ) {
//       const token = jwt.sign(
//         { email: process.env.ADMIN_EMAIL },
//         process.env.JWT_SECRET,
//         { expiresIn: "30d" },
//       );

//       res.json({ success: true, token });
//     } else {
//       res.json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// API for get all worker list for admin panel
const allWorkers = async (re, res) => {
  try {
    const workers = await workerModel
      .find({})
      .select("-password")
      .populate("zone", "name");
    res.json({ success: true, workers });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for addZone
const addZone = async (req, res) => {
  try {
    const { name, areas } = req.body;

    if (!name || !name.trim()) {
      return res.json({
        success: false,
        message: "Zone name is required",
      });
    }

    if (!Array.isArray(areas) || areas.length === 0) {
      return res.json({
        success: false,
        message: "Areas must be a non-empty array",
      });
    }

    const formattedName = name.trim().toLowerCase();
    const formattedAreas = areas.map((a) => a.trim().toLowerCase());

    const existingZone = await zoneModel.findOne({ name: formattedName });

    if (existingZone) {
      return res.json({
        success: false,
        message: "Zone already exists",
      });
    }

    const zone = await zoneModel.create({
      name: formattedName,
      areas: formattedAreas,
    });

    res.json({ success: true, zone });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// API for update zone
const updateZone = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, areas } = req.body;

    const zone = await zoneModel.findById(id);
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: "Zone not found",
      });
    }

    if (name) {
      name = name.trim().toLowerCase();
    }

    if (areas && Array.isArray(areas)) {
      areas = [...new Set(areas.map((area) => area.trim().toLowerCase()))];
    }

    if (name) {
      const existingZone = await zoneModel.findOne({
        name,
        _id: { $ne: id },
      });

      if (existingZone) {
        return res.status(400).json({
          success: false,
          message: "Zone name already exists",
        });
      }

      zone.name = name;
    }

    if (areas) {
      zone.areas = areas;
    }

    await zone.save();

    res.status(200).json({
      success: true,
      message: "Zone updated successfully",
      zone,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API for delete zone
const deleteZone = async (req, res) => {
  try {
    const { id } = req.params;

    const zone = await zoneModel.findById(id);

    if (!zone) {
      return res.status(404).json({
        success: false,
        message: "Zone not found",
      });
    }

    await zoneModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Zone deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// API for get all reports list for admin panel
const getAllReportsForAdmin = async (req, res) => {
  try {
    const reports = await reportModel
      .find({})

      .populate({
        path: "userId",
        select: "name email phone image location",
      })
      .populate({
        path: "assignedWorker",
        select: "name email phone zone image",
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API for get a worker detail for admin panel
const detailWorker = async (req, res) => {
  try {
    const worker = await workerModel
      .findById(req.params.id)
      .populate("zone", "name");

    if (!worker) {
      return res.json({ success: false, message: "Not found" });
    }

    res.json({ success: true, worker });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API for get dashboard data for admin panel
const adminDashboardData = async (req, res) => {
  try {
    const users = await userModel.find({});
    const workers = await workerModel.find({});
    const reports = await reportModel.find({});
    const zones = await zoneModel.find({});
    const activeWorkers = await workerModel.find({ isActive: true });

    // Filter reports by status
    const pendingReports = reports.filter((r) => r.status === "Pending");
    const completedReports = reports.filter((r) => r.status === "Completed");
    const rejectedReports = reports.filter((r) => r.status === "Rejected");

    const latestReports = await reportModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name image")
      .populate("zone", "name");

    const dashData = {
      users: users.length,
      workers: workers.length,
      activeWorkers: activeWorkers.length,
      reports: reports.length,
      pendingReports: pendingReports.length,
      completedReports: completedReports.length,
      rejectedReports: rejectedReports.length,
      zones: zones.length,

      latestReports: latestReports,
    };

    res.json({ success: true, dashData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// GET /api/admin/report/:id
const getReportDetails = async (req, res) => {
  try {
    const reportId = req.params.id;

    const report = await reportModel
      .findById(reportId)
      .populate("userId", "name image email") // user details
      .populate("zone", "name"); // zone details

    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    res.json({ success: true, report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    console.log(reportId);

    const report = await reportModel.findById(reportId);
    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    if (
      report.status === "Pending" ||
      report.status === "Assigned" ||
      report.status === "In Process" ||
      report.status === "In Review"
    ) {
      const workerId = report.assignedWorker;
      if (workerId) {
        await workerModel.findByIdAndUpdate(workerId, {
          status: "Available",
          currentTask: { reportId: null },
          assignedAt: null,
        });
      }
    }

    await reportModel.findByIdAndDelete(reportId);

    const io = req.app.get("io");
    await autoAssignReports(io);

    res.json({ success: true, message: "Report deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteWorker = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const worker = await workerModel.findById(id);
    if (!worker) {
      return res
        .status(404)
        .json({ success: false, message: "Worker not found" });
    }

    await workerModel.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Worker deleted successfully" });
  } catch (error) {
    console.error("Delete Worker Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const rejectReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    console.log(rejectionReason);

    if (!rejectionReason) {
      return res
        .status(400)
        .json({ success: false, message: "Rejection reason required" });
    }

    const report = await reportModel.findById(id);

    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    if (report.status === "Rejected") {
      return res
        .status(400)
        .json({ success: false, message: "Report already rejected" });
    }

    report.status = "Rejected";
    report.rejectionReason = rejectionReason;
    report.rejectedAt = new Date();

    if (report.assignedWorker) {
      await workerModel.findByIdAndUpdate(report.assignedWorker, {
        status: "Available",
        currentTask: { reportId: null },
      });
    }

    await report.save();

    res
      .status(200)
      .json({ success: true, message: "Report rejected successfully", report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send warning notification for worker
const sendWarningToWorker = async (req, res) => {
  try {
    const { reportId, message } = req.body;

    console.log(reportId);
    console.log(message);

    const report = await reportModel
      .findById(reportId)
      .populate("assignedWorker");

    console.log(report.assignedWorker);

    if (!report) {
      return res.json({ success: false, message: "Report not found" });
    }

    if (!report.assignedWorker) {
      return res.json({ success: false, message: "No worker assigned" });
    }

    const notification = await createNotification({
      workerId: report.assignedWorker,
      recipientRole: "worker",
      type: "warning",
      message,
      createdBy: "admin",
    });

    const io = req.app.get("io");
    io.to(report.assignedWorker._id.toString()).emit("warning", notification);

    res.json({
      success: true,
      message: "Warning sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// report completion time extend
const extendReportTime = async (req, res) => {
  try {
    const { reportId, hours } = req.body;

    if (!hours) {
      return res.json({
        success: false,
        message: "Please enter hours or select from button",
      });
    }

    if (hours <= 0) {
      return res.json({
        success: false,
        message: "Please enter valid hours",
      });
    }

    if (hours > 12) {
      return res.json({ success: false, message: "Maximum 12 hours allowed" });
    }

    console.log(reportId);
    console.log(hours);

    const report = await reportModel.findById(reportId);

    if (!report) {
      return res.json({ success: false, message: "Report not found" });
    }

    let baseTime = new Date(report.expectedCompletion);
    const now = new Date();

    if (baseTime < now) {
      baseTime = now;
    }

    baseTime.setHours(baseTime.getHours() + hours);

    report.expectedCompletion = baseTime;

    if (report.status === "Delay") {
      report.status = "In Process";
    }

    await report.save();

    res.json({
      success: true,
      message: `Time extended by ${hours} hours`,
      report,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  addWorker,
  loginAdmin,
  allWorkers,
  addZone,
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
};
