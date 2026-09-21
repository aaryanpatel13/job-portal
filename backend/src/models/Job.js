const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
      default: "Full-time",
    },
    category: { type: String, default: "General" },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    skillsRequired: [{ type: String }],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", description: "text", company: "text" });

module.exports = mongoose.model("Job", jobSchema);
