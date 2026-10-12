
const mongoose = require("mongoose");

const interestSchema = new mongoose.Schema(
  {
    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same investor from expressing
// interest in the same startup more than once.
interestSchema.index(
  { investor: 1, startup: 1 },
  { unique: true }
);

module.exports = mongoose.model("Interest", interestSchema);
