import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p className="company">{job.company} — {job.location}</p>
      <div className="tags">
        <span className="tag">{job.type}</span>
        <span className="tag">{job.category}</span>
        {job.salaryMax > 0 && (
          <span className="tag">${job.salaryMin} - ${job.salaryMax}</span>
        )}
      </div>
      <p className="desc">{job.description.slice(0, 140)}...</p>
      <Link to={`/jobs/${job._id}`} className="btn">View Details</Link>
    </div>
  );
}
