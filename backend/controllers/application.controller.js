import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// Apply for a job
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required",
                success: false,
            });
        }
        // Check whether user already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId,
        });


        // application already exisits.
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false,
            });
        }

        // check if job exisits
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
            });
        }



        // create new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });

        // Link application to job
        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: "Job applied successfully",
            success: true,
        });

    } catch (error) {
        console.log(error);
    }
};


// 2. Get all jobs applied by logged-in user
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;

        const applications = await Application.find({applicant: userId,}).sort({ createdAt: -1 }).populate({path: "job",
            options:{sort:{createdAt :-1}},
            populate:
            {
                 path: "company",options:{sort:{createdAt :-1}},
            }
        });
        if (!applications){
            return res.status(404).json({
                message: "Application not found",
                success : false,
            })
        }

        return res.status(200).json({
            applications,
            success: true,
        });

    } catch (error) {
        console.log(error)
    }
};



//Get applicants for a job (recruiter)
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        const job = await Job.findById(jobId).populate({
            path: "applications",options : {sort:{createdAt : -1}},
            populate:{
                path:"applicant",
            }
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
            });
        }
        return res.status(200).json({
            job,
            success:true,
        });

    } catch (error) {
        console.log(error);
    }
};




// update application status
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: "Status is required",
                success: false,
            });
        };

        // find application by application id
        const application = await Application.findOne({_id:applicationId})

        if (!application) {
            return res.status(404).json({
                message: "Application not found",
                success: false,
            });
        }

        // update status
        
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: "Application status updated successfully",
            success: true,
        });

    } catch (error) {
       console.log(error);
    }
};