import { mongoose, model } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["founder", "investor"],
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },

    // Founder fields
    companyName: {
      type: String,
      default: "",
    },

    designation: {
      type: String,
      default: "",
    },

    // Investor fields
    organization: {
      type: String,
      default: "",
    },

    investorType: {
      type: String,
      enum: [
        "angel_investor",
        "venture_capital",
        "corporate_investor",
        "private_equity",
        "accelerator",
        "incubator",
        "family_office",
        "crowdfunding",
        "other",
      ],
      required: function () {
        return this.role === "investor";
      },
    },

    investmentMin: {
      type: Number,
      min: 0,
      default: 0,
    },

    investmentMax: {
      type: Number,
      min: 0,
      default: 0,
    },

    preferredIndustries: {
      type: [String],
      default: [],
    },

    preferredStages: {
      type: [String],
      default: [],
    },

    linkedinUrl: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Strip out password field when sending user object to client
userSchema.set('toJSON', {
  virtuals: true,
  transform(doc, obj) {
    obj.id = obj._id;
    delete obj.__v;
    delete obj.passwordHash;
    return obj;
  },
});

export const User = model("User", userSchema);
