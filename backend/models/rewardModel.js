const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },

    points: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["ReportReward", "CollectionReward", "Redeem"],
      required: true,
    },
  },
  { timestamps: true },
);

const rewardModel = mongoose.models.Reward || mongoose.model("Reward", rewardSchema);

module.exports = rewardModel;
