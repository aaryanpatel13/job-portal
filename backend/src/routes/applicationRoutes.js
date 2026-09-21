const express = require("express");
const {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/:jobId", protect, authorize("jobseeker"), applyToJob);
router.get("/my-applications", protect, authorize("jobseeker"), getMyApplications);
router.get("/job/:jobId", protect, authorize("employer"), getApplicantsForJob);
router.put("/:id/status", protect, authorize("employer"), updateApplicationStatus);

module.exports = router;
