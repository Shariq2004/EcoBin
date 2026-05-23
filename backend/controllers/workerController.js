require("dotenv").config();
const workerModel = require("../models/workerModel");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const reportModel = require("../models/reportModel.js");
const userModel = require("../models/userModel.js");
const rewardModel = require("../models/rewardModel.js");
const { autoAssignReports } = require("../utils/assigneReport.js");
const { sendNotification } = require("../utils/notificationHelper");
const giveRewardPoints = require("../utils/rewardService.js");
const cloudinary = require("cloudinary").v2;
const { createNotification } = require("../utils/notificationHelper");
const Settings = require("../models/settingsModel");
const updateDelayedReports = require("../utils/delayedReport");

const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const fs = require("fs");
const SIMILARITY_THRESHOLD = 0.7;

// API for verify user waste report by worker
const verifyWaste = async (req, res) => {
  try {
    const { reportId } = req.params;
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload an image" });
    }

    const base64Image = Buffer.from(
      await fs.promises.readFile(file.path),
    ).toString("base64");

    const uploadedImage = await cloudinary.uploader.upload(file.path, {
      folder: "waste_reports",
    });
    const workerImageUrl = uploadedImage.secure_url;

    // Delete local file
    fs.unlinkSync(file.path);

    const report = await reportModel.findById(reportId);
    if (!report)
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });

    if (!report.assignedWorker) {
      return res
        .status(400)
        .json({ success: false, message: "No worker assigned" });
    }
    if (report.assignedWorker.toString() !== req.workerId.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized worker" });
    }

    const prompt = `
You are a waste verification AI.

Expected Waste Type: ${report.wasteType}
Expected Quantity: ${report.quantity} kg

Compare the uploaded image with expected waste. 
Return ONLY JSON in this format:
{
  "isSameWaste": true/false,
  "similarity": 0.0 to 1.0,
  "reason": "short explanation",
  "detectedQuantity": number
}
`;

    // Call GenAI
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          ],
        },
      ],
    });

    let aiText = "";
    try {
      aiText = result.text();
    } catch (e) {
      aiText = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    aiText = aiText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch (err) {
      console.log("AI parsing error:", err, "AI output:", aiText);
      return res.status(500).json({
        success: false,
        message: "AI parsing failed",
        aiOutput: aiText,
      });
    }

    // Extract number from string like "Approximately : 750 kg"
    const extractNumber = (str) => {
      const match = str.match(/(\d+)/); 
      return match ? Number(match[0]) : 0;
    };

    // Expected quantity as number
    const expectedQuantity = extractNumber(report.quantity);

    // Detected quantity from AI (already numeric)
    const detectedQuantity = Math.round(Number(parsed.detectedQuantity)) || 0;

    const tolerance = 0.3;

    const quantityMatched =
      expectedQuantity === 0
        ? false
        : Math.abs(detectedQuantity - expectedQuantity) / expectedQuantity <=
          tolerance;

    const isVerified =
      parsed.isSameWaste && parsed.similarity >= 0.7 && quantityMatched;

    report.aiVerification = {
      similarity: parsed.similarity,
      verified: isVerified,
      reason: parsed.reason || "No reason provided",
      wasteTypeMatched: parsed.isSameWaste,
      quantityMatched,
      verifiedAt: new Date(),
    };

    report.workerVerification = {
      workerId: report.assignedWorker,
      proofImage: {
        public_id: uploadedImage.public_id,
        url: uploadedImage.secure_url,
      },
      status: "Waste Found",
      verifiedAt: new Date(),
    };

    console.log(
      `Report ${report._id} - Expected: ${expectedQuantity}, Detected: ${detectedQuantity}, Matched? ${quantityMatched}`,
    );

    await report.save();

    res.json({ success: true, data: report });
  } catch (err) {
    console.log("verifyWaste Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", details: err.message });
  }
};

// API for complete report of user
const completeReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await reportModel.findById(reportId);
    if (!report)
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });

    if (report.isCompleted) {
      return res.json({
        success: true,
        message: "Already completed",
      });
    }

    if (!report.aiVerification?.verified) {
      return res
        .status(400)
        .json({ success: false, message: "Waste not verified yet" });
    }

    report.status = "Completed";
    report.completedAt = new Date();

    const worker = await workerModel.findById(report.assignedWorker);
    const workerName = worker ? worker.name : "Worker";

    const user = await userModel.findById(report.userId);

    const io = req.app.get("io");

    if (user) {
      const userCompletionNotification = await createNotification({
        userId: user._id,
        recipientRole: "user",
        type: "reportCompleted",
        message: `Your report at ${report.location} has been completed.`,
        location: report.location,
        createdBy: workerName,
        reportId: report._id,
      });

      io.to(user._id.toString()).emit(
        "reportCompleted",
        userCompletionNotification,
      );
    }

    // Reward logic
    if (!report.isCompleted && user) {
      const settings = await Settings.findOne();

      const wasteType = report.wasteType?.trim();

      const rewardPoints = settings?.rewardPointsByWasteType?.[wasteType] || 5;

      await giveRewardPoints(
        user._id,
        report._id,
        rewardPoints,
        "CollectionReward",
      );

      const rewardNotification = await createNotification({
        userId: user._id,
        workerId: worker ? worker._id : null,
        recipientRole: "user",
        type: "rewardEarned",
        message: `You earned +${rewardPoints} ecobin points`,
        location: report.location,
        createdBy: workerName,
        reportId: report._id,
      });

      io.to(user._id.toString()).emit("rewardEarned", rewardNotification);

      report.isCompleted = true;
    }

    if (worker) {
      await workerModel.findByIdAndUpdate(worker._id, {
        status: "Available",
        currentTask: { reportId: null },
        $inc: { totalTasksCompleted: 1 },
      });
    }

    // Notify admin
    const adminNotification = await createNotification({
      adminId: "admin895461",
      recipientRole: "admin",
      type: "reportCompleted",
      message: `Report completed by ${workerName} at ${report.location}`,
      location: report.location,
      createdBy: workerName,
      reportId: report._id,
    });

    io.to("admin").emit("reportCompleted", adminNotification);

    // Auto assign next report
    await autoAssignReports(io);

    await report.save();

    res.json({ success: true, data: report });
  } catch (err) {
    console.error("completeReport Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      details: err.message,
    });
  }
};

// API for confirm waste by worker
const confirmWastebyWorker = async (req, res) => {
  const { reportId, workerVerificationType, workerVerificationNote } = req.body;

  if (!workerVerificationType) {
    return res
      .status(400)
      .json({ success: false, message: "Please select an option" });
  }

  if (
    (workerVerificationType === "Wrong Report" ||
      workerVerificationType === "Already Cleaned") &&
    (!workerVerificationNote || workerVerificationNote.trim() === "")
  ) {
    return res.status(400).json({
      success: false,
      message: "Please write a note for admin",
    });
  }

  const report = await reportModel.findById(reportId);
  if (!report) {
    return res
      .status(404)
      .json({ success: false, message: "Report not found" });
  }

  report.workerVerification.status = workerVerificationType;
  report.workerVerification.note = workerVerificationNote || "";

  if (
    workerVerificationType !== "Waste Found" &&
    report.workerVerification.note !== ""
  ) {
    report.workerVerification.verifiedAt = new Date();
  }

  if (
    (workerVerificationType === "Wrong Report" ||
      workerVerificationType === "Already Cleaned") &&
    workerVerificationNote !== ""
  ) {
    report.status = "In Review";
  }

  await report.save();

  console.log("Received Type:", workerVerificationType);
  console.log("Received Note:", workerVerificationNote);

  res.json({
    success: true,
    message: "Waste Confirmation Added",
    data: { workerVerificationType, workerVerificationNote },
  });
};

// API for change worker availability
const ChangeAvailability = async (req, res) => {
  try {
    const { worId } = req.body;

    const worData = await workerModel.findById(worId);

    const newIsActive = !worData.isActive;

    await workerModel.findByIdAndUpdate(worId, {
      isActive: newIsActive,
      status: newIsActive ? "Available" : "UnAvailable",
    });

    console.log("before function call");
    if (newIsActive) {
      await autoAssignReports();
      console.log("Inside function");
    }
    console.log("after function call");

    res.json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for worker login
const loginWorker = async (req, res) => {
  try {
    const { email, password } = req.body;

    const worker = await workerModel.findOne({ email });

    if (!worker) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, worker.password);

    if (isMatch) {
      const token = jwt.sign({ id: worker._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      console.log("Login success - worker._id:", worker._id);
      console.log("JWT Token:", token);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get assigned reports for worker panel
const workerAssignReports = async (req, res) => {
  try {
    const workerId = req.workerId;
    const assignReports = await reportModel
      .find({
        assignedWorker: workerId,
        status: {
          $in: [
            "Assigned",
            "In Process",
            "Completed",
            "In Review",
            "Rejected",
            "Delay",
          ],
        },
      })
      .sort({ createdAt: -1 })
      .populate("userId", "name email phone image address");
    res.json({ success: true, assignReports });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get single report details for worker
const assignReportDetail = async (req, res) => {
  try {
    const workerId = req.workerId;
    const { id } = req.params;

    const report = await reportModel
      .findOne({
        _id: id,
        assignedWorker: workerId,
      })
      .populate("userId", "image name email phone address");

    if (!report) {
      return res.json({
        success: false,
        message: "Report not found or not assigned to you",
      });
    }

    res.json({ success: true, report });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update assigned reports Status for worker panel
const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    const report = await reportModel.findById(reportId);

    if (!report) {
      return res.json({ success: false, message: "Report not found" });
    }

    if (report.assignedWorker.toString() !== req.workerId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const allowedStatus = ["Assigned", "In Process"];

    if (!allowedStatus.includes(status)) {
      return res.json({ success: false, message: "Invalid status" });
    }

    report.status = status;

    if (status === "In Process") {
      await workerModel.findByIdAndUpdate(req.workerId, {
        status: "OnDuty",
      });
    }

    await report.save();

    // Auto assign next tasks
    await autoAssignReports();

    return res.json({
      success: true,
      message: "Status Updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get worker profile data for worker panel
const workerProfile = async (req, res) => {
  try {
    const workerId = req.workerId;

    const profileData = await workerModel
      .findById(workerId)
      .select("-password")
      .populate("zone", "name areas");

    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update worker profile data for worker panel

const updateWorkerProfile = async (req, res) => {
  try {
    const workerId = req.workerId;
    const { name, phone, address } = req.body;
    const imageFile = req.file;

    if (!name || !phone) {
      return res.json({ success: false, message: "Data Missing" });
    }

    await workerModel.findByIdAndUpdate(workerId, {
      name,
      phone,
      address: address ? JSON.parse(address) : {},
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });

      await workerModel.findByIdAndUpdate(workerId, {
        image: imageUpload.secure_url,
      });
    }

    res.json({ success: true, message: "Worker Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for get worker dashboard data
const workerDashboardData = async (req, res) => {
  try {
    await updateDelayedReports();

    const workerId = req.workerId;

    const worker = await workerModel
      .findById(workerId)
      .select("-password")
      .populate("zone", "name areas");

    if (!worker)
      return res
        .status(404)
        .json({ success: false, message: "Worker not found" });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const assignedToday = await reportModel.countDocuments({
      assignedWorker: workerId,
      assignedAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const completedToday = await reportModel.countDocuments({
      assignedWorker: workerId,
      status: "Completed",
      completedAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const pendingTasks = await reportModel.countDocuments({
      assignedWorker: workerId,
      status: { $in: ["Assigned", "In Process"] },
    });

    // Top 5 Latest Assigned Reports
    const topReports = await reportModel
      .find({ assignedWorker: workerId })
      .sort({ assignedAt: -1 })
      .limit(5)
      .populate("userId", "name image")
      .populate("zone", "name");

    res.json({
      success: true,
      summary: {
        assignedToday,
        completedToday,
        totalCompleted: worker.totalTasksCompleted,
      },
      topReports,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  ChangeAvailability,
  loginWorker,
  workerAssignReports,
  assignReportDetail,
  updateReportStatus,
  workerProfile,
  updateWorkerProfile,
  workerDashboardData,
  verifyWaste,
  completeReport,
  confirmWastebyWorker,
};
