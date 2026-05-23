const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      default: null,
    },

    wasteType: {
      type: String,
      required: true,
    },

    quantity: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    zone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zone",
    },

    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Assigned",
        "In Review",
        "In Process",
        "Completed",
        "Rejected",
        "Cancelled",
        "Delay",
      ],
      default: "Pending",
    },

    previousStatus: {
      type: String,
      default: null,
    },

    aiVerification: {
      similarity: Number,
      verified: Boolean,
      wasteTypeMatched: Boolean,
      quantityMatched: Boolean,
      reason: String,
      verifiedAt: Date,
    },

    workerVerification: {
      workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worker",
      },
      proofImage: {
        public_id: String,
        url: String,
      },
      status: {
        type: String,
        enum: ["Pending", "Waste Found", "Wrong Report", "Already Cleaned"],
        default: "Pending",
      },
      note: String,

      verifiedAt: Date,
    },

    rejectionReason: {
      type: String,
      default: null,
    },
    rejectedAt: {
      type: Date,
      default: null,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    isCanceled: {
      type: Boolean,
      default: false,
    },

    canceledAt: {
      type: Date,
      default: null,
    },

    assignedAt: {
      type: Date,
      default: null,
    },

    expectedCompletion: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const reportModel = mongoose.models.Report || mongoose.model("Report", reportSchema);

module.exports = reportModel;
