import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    type: "Full-time",
    category: "",
    salaryMin: "",
    salaryMax: "",
    skillsRequired: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/jobs", {
        ...form,
        salaryMin: Number(form.salaryMin) || 0,
        salaryMax: Number(form.salaryMax) || 0,
        skillsRequired: form.skillsRequired
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job");
    }
  };

  return (
    <div className="container auth-form">
      <h2>Post a New Job</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Job title" value={form.title} onChange={handleChange} required />
        <input name="company" placeholder="Company name" value={form.company} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
        <select name="type" value={form.type} onChange={handleChange}>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Internship</option>
          <option>Remote</option>
        </select>
        <input name="category" placeholder="Category (e.g. Engineering)" value={form.category} onChange={handleChange} />
        <div className="row">
          <input name="salaryMin" type="number" placeholder="Min salary" value={form.salaryMin} onChange={handleChange} />
          <input name="salaryMax" type="number" placeholder="Max salary" value={form.salaryMax} onChange={handleChange} />
        </div>
        <input name="skillsRequired" placeholder="Skills (comma separated)" value={form.skillsRequired} onChange={handleChange} />
        <textarea name="description" placeholder="Job description" rows={6} value={form.description} onChange={handleChange} required />
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}
