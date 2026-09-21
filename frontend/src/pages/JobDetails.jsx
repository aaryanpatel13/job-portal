import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/axios";
import { useAuth } from "../context/AuthContext";

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get(`/jobs/${id}`).then((res) => setJob(res.data.job));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    try {
      await api.post(`/applications/${id}`, { coverLetter });
      setMessage("Application submitted successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to apply");
    }
  };

  if (!job) return <div className="container">Loading...</div>;

  return (
    <div className="container job-details">
      <h1>{job.title}</h1>
      <p className="company">{job.company} — {job.location}</p>
      <div className="tags">
        <span className="tag">{job.type}</span>
        <span className="tag">{job.category}</span>
        {job.salaryMax > 0 && <span className="tag">${job.salaryMin} - ${job.salaryMax}</span>}
      </div>
      <h3>Description</h3>
      <p>{job.description}</p>
      {job.skillsRequired?.length > 0 && (
        <>
          <h3>Skills Required</h3>
          <div className="tags">
            {job.skillsRequired.map((s) => <span key={s} className="tag">{s}</span>)}
          </div>
        </>
      )}

      {(!user || user.role === "jobseeker") && (
        <div className="apply-box">
          <h3>Apply for this job</h3>
          {message && <p className="info">{message}</p>}
          <form onSubmit={handleApply}>
            <textarea
              placeholder="Cover letter (optional)"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={5}
            />
            <button type="submit">{user ? "Submit Application" : "Login to Apply"}</button>
          </form>
        </div>
      )}
    </div>
  );
}
