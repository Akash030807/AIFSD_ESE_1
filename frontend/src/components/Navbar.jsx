import { NavLink } from 'react-router-dom';
import { Users, Briefcase, Brain, Home } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <div className="brand-icon">🎯</div>
          <span>TalentMatch<span style={{ color: 'var(--accent-light)' }}> AI</span></span>
        </NavLink>

        <ul className="navbar-links">
          <li>
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Home size={16} />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/candidates" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Users size={16} />
              <span>Candidates</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/match" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Briefcase size={16} />
              <span>Match</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/ai" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Brain size={16} />
              <span>AI Shortlist</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
