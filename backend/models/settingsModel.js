const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    points: {
      pointToRupeeRate: {
        type: Number,
        default: 0.6,
        min: 0,
      },
      minRedeemPoints: {
        type: Number,
        default: 10,
      },
      maxRedeemPerDay: {
        type: Number,
        default: 100,
      },
    },

    rewardPointsByWasteType: {
      type: Object,
      default: {
        "Plastic waste": 10,
        "Organic waste": 8,
        "Paper waste": 6,
        "Metal waste": 12,
        "Glass waste": 10,
        "Mixed waste": 5,
        "Dry waste": 7,
        "Wet waste": 7,
      },
    },

    expectedCompletionByQuantity: {
      type: [
        {
          minKg: Number,
          maxKg: Number,
          hours: Number,
        },
      ],

      default: [
        { minKg: 0, maxKg: 10, hours: 2 },
        { minKg: 10, maxKg: 30, hours: 6 },
        { minKg: 30, maxKg: 100, hours: 24 },
        { minKg: 100, maxKg: 10000, hours: 48 },
      ],
    },
  },
  { timestamps: true },
);

const SettingsModel = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

module.exports = SettingsModel;
