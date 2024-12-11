import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    report: {
      filePath: { type: String },
      originalName: { type: String },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
