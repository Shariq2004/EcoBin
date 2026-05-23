const Settings = require("../models/settingsModel.js");

// API for get settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API for update Sttings
const updateSettings = async (req, res) => {
  try {
    const {
      pointToRupeeRate,
      minRedeemPoints,
      maxRedeemPerDay,
      rewardPointsByWasteType,
      expectedCompletionByQuantity,
      showExpectedCompletionTime,
    } = req.body;

    if (pointToRupeeRate < 0) {
      return res.json({ success: false, message: "Invalid conversion rate" });
    }

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    settings.points.pointToRupeeRate = pointToRupeeRate;
    settings.points.minRedeemPoints = minRedeemPoints;
    settings.points.maxRedeemPerDay = maxRedeemPerDay;

    if (rewardPointsByWasteType) {
      settings.rewardPointsByWasteType = {
        ...settings.rewardPointsByWasteType,
        ...rewardPointsByWasteType,
      };
    }

    if (expectedCompletionByQuantity) {
      settings.expectedCompletionByQuantity = expectedCompletionByQuantity;
    }

    if (showExpectedCompletionTime !== undefined) {
      settings.showExpectedCompletionTime = showExpectedCompletionTime;
    }

    await settings.save();

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API for add WasteType and reward Points for user
const addWasteType = async (req, res) => {
  try {
    const { wasteType, points } = req.body;

    if (!wasteType || points === undefined) {
      return res.json({
        success: false,
        message: "Waste type and points required",
      });
    }

    if (points < 0) {
      return res.json({
        success: false,
        message: "Points must be positive",
      });
    }

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    settings.rewardPointsByWasteType = {
      ...settings.rewardPointsByWasteType,
      [wasteType]: Number(points),
    };

    await settings.save();

    res.json({
      success: true,
      message: "Waste type added successfully",
      rewardPointsByWasteType: settings.rewardPointsByWasteType,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API for delete WasteType and reward Points for user
const deleteWasteType = async (req, res) => {
  try {
    const { wasteType } = req.body;

    if (!wasteType) {
      return res.json({
        success: false,
        message: "Waste type is required",
      });
    }

    let settings = await Settings.findOne();

    if (!settings) {
      return res.json({
        success: false,
        message: "Settings not found",
      });
    }

    if (!settings.rewardPointsByWasteType[wasteType]) {
      return res.json({
        success: false,
        message: "Waste type not found",
      });
    }

    const { [wasteType]: removed, ...rest } = settings.rewardPointsByWasteType;

    settings.rewardPointsByWasteType = rest;

    await settings.save();

    await settings.save();

    res.json({
      success: true,
      message: "Waste type deleted successfully",
      rewardPointsByWasteType: settings.rewardPointsByWasteType,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API for add completion time for user report
const addCompletionRule = async (req, res) => {
  try {
    let { minKg, maxKg, hours } = req.body;

    if (minKg === undefined || maxKg === undefined || hours === undefined) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    if (minKg < 0 || maxKg <= minKg) {
      return res.json({
        success: false,
        message: "Invalid Kg range",
      });
    }

    if (hours <= 0) {
      return res.json({
        success: false,
        message: "Hours must be greater than 0",
      });
    }

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    settings.expectedCompletionByQuantity.push({
      minKg,
      maxKg,
      hours,
    });

    settings.expectedCompletionByQuantity.sort((a, b) => a.minKg - b.minKg);

    await settings.save();

    res.json({
      success: true,
      message: "Rule added successfully",
      rules: settings.expectedCompletionByQuantity,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API for delete completion time
const deleteCompletionRule = async (req, res) => {
  try {
    const { index } = req.body;

    const settings = await Settings.findOne();

    if (!settings) {
      return res.json({
        success: false,
        message: "Settings not found",
      });
    }

    settings.expectedCompletionByQuantity.splice(index, 1);

    await settings.save();

    res.json({
      success: true,
      message: "Rule deleted successfully",
      rules: settings.expectedCompletionByQuantity,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  updateSettings,
  getSettings,
  addCompletionRule,
  deleteCompletionRule,
  addWasteType,
  deleteWasteType,
};
