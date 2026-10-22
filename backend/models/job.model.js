
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    requirements: [{
        type: String,
    }],
    salary: {
        type: Number,
        required: true,
    },
    experienceLevel: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    jobType: {
        type: String,
        enum: ["Full-time", "Part-time", "Internship", "Contract"],
        required: true,
    },
    position: {                 // no.of opening for this job
        type: Number,
        required: true,
    },
    company: {              // relation b/w job and company
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application",
        }
    ],

}, { timestamps: true });

export const Job = mongoose.model("Job", jobSchema);
