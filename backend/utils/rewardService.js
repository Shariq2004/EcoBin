const userModel = require("../models/userModel");
const rewardModel = require("../models/rewardModel");

const giveRewardPoints = async (userId, reportId, points, type) => {
  try {
    await userModel.findByIdAndUpdate(
      userId,
      { $inc: { rewardPoints: points, totalRewardPoints: points } },
      { new: true },
    );

    const reward = await rewardModel.create({
      userId,
      reportId,
      points,
      type,
    });

    return reward;
  } catch (error) {
    console.log("Reward Error", error);
    throw error;
  }
};

module.exports = giveRewardPoints;
