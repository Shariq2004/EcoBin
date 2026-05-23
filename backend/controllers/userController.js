const validator = require("validator");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const reportModel = require("../models/reportModel.js");
const rewardModel = require("../models/rewardModel.js");
const notificationModel = require("../models/notificationModel.js");
const Settings = require("../models/settingsModel.js");

// API for register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);

    if (!name || !email || !password) {
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update user profile data
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId; // ✅ secure way
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      dob,
      gender,
      address: address ? JSON.parse(address) : {},
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get reward transection of user
const getTransactions = async (req, res) => {
  try {
    const userId = req.userId;

    const transactions = await rewardModel
      .find({ userId })
      .sort({ createdAt: -1 });

    const formatted = transactions.map((item) => {
      let description = "";

      if (item.type === "ReportReward") {
        description = "Points earned from reporting waste";
      } else if (item.type === "CollectionReward") {
        description = "Points earned from completing waste report";
      } else if (item.type === "Redeem") {
        description = "Points redeemed";
      }

      return {
        description,
        date: item.createdAt.toISOString().split("T")[0],
        points: item.points,
      };
    });

    res.json({
      success: true,
      transactions: formatted,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to redeem reward points
const redeemPoints = async (req, res) => {
  try {
    const userId = req.userId;
    const { points } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const settings = await Settings.findOne();

    const minRedeemPoints = settings?.points?.minRedeemPoints || 0;
    const maxRedeemPerDay = settings?.points?.maxRedeemPerDay || 0;

    if (points < minRedeemPoints) {
      return res.json({
        success: false,
        message: `Minimum redeem is ${minRedeemPoints} points`,
      });
    }

    if (points > user.rewardPoints) {
      return res.json({
        success: false,
        message: "Not enough points",
      });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayTransactions = await rewardModel.find({
      userId,
      type: "Redeem",
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    let todayRedeemed = 0;

    todayTransactions.forEach((t) => {
      todayRedeemed += Math.abs(t.points);
    });

    if (todayRedeemed + points > maxRedeemPerDay) {
      return res.json({
        success: false,
        message: `Daily redeem limit is ${maxRedeemPerDay} points`,
      });
    }

    user.rewardPoints -= points;
    await user.save();

    await rewardModel.create({
      userId,
      points: -points,
      type: "Redeem",
    });

    res.json({
      success: true,
      message: "Points redeemed successfully",
      rewardPoints: user.rewardPoints,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for get User Impact details
const getUserImpact = async (req, res) => {
  try {
    const userId = req.userId;

    const reports = await reportModel.find({ userId });

    const reportsSubmitted = reports.length;

    const reportsResolved = reports.filter(
      (r) => r.status === "Completed",
    ).length;

    const wasteTypes = [...new Set(reports.map((r) => r.wasteType))];

    const user = await userModel.findById(userId);

    res.json({
      success: true,
      impact: {
        reportsSubmitted,
        reportsResolved,
        wasteTypesReported: wasteTypes.length,
        rewardPointsEarned: user.totalRewardPoints,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Failed to fetch impact data",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getTransactions,
  redeemPoints,
  getUserImpact,
};
