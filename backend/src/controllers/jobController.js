const Job = require("../models/Job");

// @desc    List/search/filter jobs (paginated)
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const { search, location, type, category, page = 1, limit = 10 } = req.query;
    const filter = { isActive: true };

    if (search) filter.$text = { $search: search };
    if (location) filter.location = { $regex: location, $options: "i" };
    if (type) filter.type = type;
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);
    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate("postedBy", "name companyName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Job.countDocuments(filter),
    ]);

    res.json({
      jobs,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get a single job by id
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name companyName companyWebsite"
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (employer)
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json({ job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update a job (owner only)
// @route   PUT /api/jobs/:id
// @access  Private (employer)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this job" });
    }
    Object.assign(job, req.body);
    await job.save();
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a job (owner only)
// @route   DELETE /api/jobs/:id
// @access  Private (employer)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }
    await job.deleteOne();
    res.json({ message: "Job removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get jobs posted by the logged-in employer
// @route   GET /api/jobs/employer/my-jobs
// @access  Private (employer)
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
