const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
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
    },
    phone: {
      type: String,
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true,
    },
    className: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    address: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
  },
  { timestamps: true },
);
module.exports = mongoose.model("Student", studentSchema);
