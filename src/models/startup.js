const mongoose = require("mongoose");

const startupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    industry: {
      type: String,
      required: true,
    },

    stage: {
      type: String,
      required: true,
      enum: ["Idea", "Pre-seed", "Seed", "Series A", "Series B"],
    },

    fundingRequired: {
      type: Number,
      required: true,
      min: 0,
    },

    founder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Startup", startupSchema);
