const mongoose = require("mongoose");

const zoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  areas: [String],
});

const zoneModel = mongoose.models.Zone || mongoose.model("Zone", zoneSchema);

module.exports = zoneModel;
