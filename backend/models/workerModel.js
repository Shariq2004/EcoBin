const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      default: "0000000000",
    },

    image: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Available", "UnAvailable", "Assigned", "OnDuty"],
      default: "Available",
    },

    zone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zone",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    totalTasksCompleted: {
      type: Number,
      default: 0,
    },

    currentTask: {
      reportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
        default: null,
      },

      assignedAt: {
        type: Date,
        default: null,
      },
    },

    address: {
      street: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
    },
  },
  { timestamps: true },
);

const workerModel = mongoose.models.Worker || mongoose.model("Worker", workerSchema);

module.exports = workerModel;
