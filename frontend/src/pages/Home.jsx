import { useEffect, useState } from "react";
import api from "../services/axios";
import JobCard from "../components/JobCard";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async (targetPage = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/jobs", {
        params: { search, location, type, page: targetPage, limit: 6 },
      });
      setJobs(res.data.jobs);
      setPages(res.data.pages);
      setPage(res.data.page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(1);
  };

  return (
    <div className="container">
      <h1>Find your next job</h1>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          placeholder="Job title, keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Internship</option>
          <option>Remote</option>
        </select>
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="job-grid">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="pagination">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={p === page ? "active" : ""}
              onClick={() => fetchJobs(p)}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
