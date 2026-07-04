import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <span className="navbar-brand">Flashcards</span>
        <div className="navbar-links">
          <NavLink to="/decks" className="navbar-link">
            Decks
          </NavLink>
          <NavLink to="/search" className="navbar-link">
            Search
          </NavLink>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </nav>
  );
}
