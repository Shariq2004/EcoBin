const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getTransactions,
  redeemPoints,
  cancelReport,
  getUserImpact,
} = require("../controllers/userController");
const authUser = require("../middlewares/authUser");
const upload = require("../middlewares/multer.js");

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/update-profile",upload.single("image"),authUser,updateProfile,);
userRouter.get("/getReward-Transaction", authUser, getTransactions);
userRouter.post("/redeem-points", authUser, redeemPoints);
userRouter.get("/impact", authUser, getUserImpact);

module.exports = userRouter;
