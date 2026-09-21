const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverLetter: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["applied", "reviewed", "shortlisted", "rejected", "hired"],
      default: "applied",
    },
  },
  { timestamps: true }
);

// Prevent the same user applying to the same job twice
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
