# MERN Job Portal

A full-stack job portal built with MongoDB, Express, React (Vite), and Node.js.

## Features

- JWT authentication with two roles: **Job Seeker** and **Employer**
- Employers can post, edit, and delete job listings
- Job seekers can browse, search (by keyword/location/type), and apply to jobs
- Employers can view applicants per job and update application status
  (applied → reviewed → shortlisted → rejected/hired)
- Job seekers can track the status of their applications
- Pagination on the job listing page
- Text search index on job title/description/company

## Tech Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs — MVC pattern (routes → controllers → models)
- **Frontend:** React 18, Vite, React Router, Axios

## Project Structure

```
job-portal/
│
├── frontend/
│   ├── src/
│   │   ├── components/     Navbar, JobCard
│   │   ├── pages/          Home, Login, Register, JobDetails, PostJob, Dashboard
│   │   ├── services/       axios.js — API client with auth token interceptor
│   │   ├── context/        AuthContext.jsx — global auth state
│   │   └── App.jsx
│   ├── package.json
│   └── .env
│
├── backend/
│   ├── src/
│   │   ├── controllers/    authController, jobController, applicationController
│   │   ├── models/         User, Job, Application (Mongoose schemas)
│   │   ├── routes/         Thin route files — map endpoints to controllers
│   │   ├── middleware/     auth.js — JWT verification + role-based access
│   │   └── config/         db.js — MongoDB connection
│   ├── src/server.js       Express app entry point
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Backend

```bash
cd backend
npm install
# .env already exists with placeholder values — edit it:
# set MONGO_URI and a strong JWT_SECRET
npm run dev
```
The API runs on http://localhost:5000 by default.

### 2. Frontend

```bash
cd frontend
npm install
# .env already exists — edit VITE_API_URL if your API runs elsewhere
npm run dev
```
The app runs on http://localhost:5173 by default.

> Note: `.env` files are gitignored. `.env.example` files are committed as templates —
> if you clone this fresh, copy them: `cp backend/.env.example backend/.env` and
> `cp frontend/.env.example frontend/.env`.

## API Overview

| Method | Endpoint                          | Access             | Controller                          |
|--------|------------------------------------|---------------------|--------------------------------------|
| POST   | /api/auth/register                | Public              | authController.register              |
| POST   | /api/auth/login                   | Public              | authController.login                 |
| GET    | /api/auth/me                      | Private             | authController.getMe                 |
| GET    | /api/jobs                         | Public              | jobController.getJobs (search/filter/paginate) |
| GET    | /api/jobs/:id                     | Public              | jobController.getJobById             |
| POST   | /api/jobs                         | Employer            | jobController.createJob              |
| PUT    | /api/jobs/:id                     | Employer (owner)    | jobController.updateJob              |
| DELETE | /api/jobs/:id                     | Employer (owner)    | jobController.deleteJob              |
| GET    | /api/jobs/employer/my-jobs        | Employer            | jobController.getMyJobs              |
| POST   | /api/applications/:jobId          | Job seeker          | applicationController.applyToJob     |
| GET    | /api/applications/my-applications | Job seeker          | applicationController.getMyApplications |
| GET    | /api/applications/job/:jobId      | Employer (owner)    | applicationController.getApplicantsForJob |
| PUT    | /api/applications/:id/status      | Employer (owner)    | applicationController.updateApplicationStatus |

## Next Steps / Ideas to Extend

- File upload for resumes (e.g. via Multer + S3/Cloudinary)
- Email notifications on application status change
- Admin role for moderating job listings
- Saved jobs / bookmarks for job seekers
- Rich text editor for job descriptions
- Deploy: backend on Render/Railway, frontend on Vercel/Netlify, DB on MongoDB Atlas
