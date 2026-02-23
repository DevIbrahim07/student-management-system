const mongoose = require("mongoose");

const markSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    marks: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    examType: {
      type: String,
      enum: ["Mid", "Final", "Quiz", "Assignment"],
      default: "Mid",
    },
  },
  { timestamps: true },
);

// Prevent duplicate marks for same student + subject + exam type
markSchema.index({ student: 1, subject: 1, examType: 1 }, { unique: true });

module.exports = mongoose.model("Mark", markSchema);
