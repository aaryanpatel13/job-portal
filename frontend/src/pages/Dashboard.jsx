import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/axios";
import { useAuth } from "../context/AuthContext";

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState({});
  const [openJob, setOpenJob] = useState(null);

  useEffect(() => {
    api.get("/jobs/employer/my-jobs").then((res) => setJobs(res.data.jobs));
  }, []);

  const viewApplicants = async (jobId) => {
    if (openJob === jobId) return setOpenJob(null);
    const res = await api.get(`/applications/job/${jobId}`);
    setApplicants((prev) => ({ ...prev, [jobId]: res.data.applications }));
    setOpenJob(jobId);
  };

  const updateStatus = async (appId, status, jobId) => {
    await api.put(`/applications/${appId}/status`, { status });
    const res = await api.get(`/applications/job/${jobId}`);
    setApplicants((prev) => ({ ...prev, [jobId]: res.data.applications }));
  };

  const deleteJob = async (jobId) => {
    if (!confirm("Delete this job posting?")) return;
    await api.delete(`/jobs/${jobId}`);
    setJobs(jobs.filter((j) => j._id !== jobId));
  };

  return (
    <div className="container">
      <h2>My Job Postings</h2>
      {jobs.length === 0 && <p>You haven't posted any jobs yet. <Link to="/post-job">Post one now</Link>.</p>}
      {jobs.map((job) => (
        <div key={job._id} className="dashboard-item">
          <div className="dashboard-item-header">
            <div>
              <h3>{job.title}</h3>
              <p className="company">{job.location} — {job.type}</p>
            </div>
            <div>
              <button onClick={() => viewApplicants(job._id)}>
                {openJob === job._id ? "Hide" : "View"} Applicants
              </button>
              <button onClick={() => deleteJob(job._id)} className="danger">Delete</button>
            </div>
          </div>
          {openJob === job._id && (
            <div className="applicants-list">
              {(applicants[job._id] || []).length === 0 && <p>No applicants yet.</p>}
              {(applicants[job._id] || []).map((app) => (
                <div key={app._id} className="applicant-row">
                  <div>
                    <strong>{app.applicant.name}</strong> ({app.applicant.email})
                    <p>{app.coverLetter}</p>
                  </div>
                  <select
                    value={app.status}
                    onChange={(e) => updateStatus(app._id, e.target.value, job._id)}
                  >
                    <option value="applied">Applied</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                    <option value="hired">Hired</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function JobSeekerDashboard() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    api.get("/applications/my-applications").then((res) => setApplications(res.data.applications));
  }, []);

  return (
    <div className="container">
      <h2>My Applications</h2>
      {applications.length === 0 && <p>You haven't applied to any jobs yet. <Link to="/">Browse jobs</Link>.</p>}
      {applications.map((app) => (
        <div key={app._id} className="dashboard-item">
          <h3>{app.job?.title}</h3>
          <p className="company">{app.job?.company} — {app.job?.location}</p>
          <span className={`status status-${app.status}`}>{app.status}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return <div className="container">Please log in.</div>;
  return user.role === "employer" ? <EmployerDashboard /> : <JobSeekerDashboard />;
}
