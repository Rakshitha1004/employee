import { Link } from 'react-router-dom';
import { User } from '../types';

interface NavBarProps {
  user: User;
  onLogout: () => void;
}

export default function NavBar({ user, onLogout }: NavBarProps) {
  return (
    <nav className="top-nav">
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/projects">Projects</Link>
      </div>
      <div className="nav-user">
        <span>{user.role}</span>
        <button type="button" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}
