import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">JobPortal</Link>
      <div className="nav-links">
        <Link to="/">Browse Jobs</Link>
        {user?.role === "employer" && (
          <>
            <Link to="/post-job">Post a Job</Link>
            <Link to="/dashboard">My Jobs</Link>
          </>
        )}
        {user?.role === "jobseeker" && <Link to="/dashboard">My Applications</Link>}
        {user ? (
          <>
            <span className="hello">Hi, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
