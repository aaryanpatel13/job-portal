const Application = require("../models/Application");
const Job = require("../models/Job");

// @desc    Apply to a job
// @route   POST /api/applications/:jobId
// @access  Private (jobseeker)
exports.applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const application = await Application.create({
      job: job._id,
      applicant: req.user._id,
      coverLetter: req.body.coverLetter || "",
      resumeUrl: req.body.resumeUrl || req.user.resumeUrl || "",
    });
    res.status(201).json({ application });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "You already applied to this job" });
    }
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get the logged-in jobseeker's applications
// @route   GET /api/applications/my-applications
// @access  Private (jobseeker)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({ path: "job", populate: { path: "postedBy", select: "companyName" } })
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get applicants for a specific job (owner only)
// @route   GET /api/applications/job/:jobId
// @access  Private (employer)
exports.getApplicantsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const applications = await Application.find({ job: job._id })
      .populate("applicant", "name email skills resumeUrl")
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update an application's status (owner only)
// @route   PUT /api/applications/:id/status
// @access  Private (employer)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate("job");
    if (!application) return res.status(404).json({ message: "Application not found" });
    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    application.status = status;
    await application.save();
    res.json({ application });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
