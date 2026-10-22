import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";

const router = express.Router();

// apply job
router.route("/apply/:id").post(isAuthenticated,applyJob);

//get all applied jobs
router.route("/get").get(isAuthenticated,getAppliedJobs);

// get all the jobs of an applicants
router.route("/:id/applicants").get(isAuthenticated,getApplicants);

// update application status
router.route("/status/:id/update").put(isAuthenticated,updateStatus);

//


export default router;