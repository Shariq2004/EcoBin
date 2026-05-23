const express = require("express");
const {
  getSettings,
  updateSettings,
  addCompletionRule,
  deleteCompletionRule,
  addWasteType,
  deleteWasteType,
} = require("../controllers/settingsController.js");
const authAdmin = require("../middlewares/authAdmin.js");

const settingsRouter = express.Router();

// get settings
settingsRouter.get("/get", getSettings);

// update settings (admin)
settingsRouter.put("/update", authAdmin, updateSettings);
settingsRouter.post("/completion-rules/add", authAdmin, addCompletionRule);
settingsRouter.post("/completion-rules/delete",authAdmin,deleteCompletionRule,);
settingsRouter.post("/waste-type/add", authAdmin, addWasteType);
settingsRouter.delete("/waste-type/delete", authAdmin, deleteWasteType);

module.exports = settingsRouter;
