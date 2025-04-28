
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Code, FileText, Settings, Filter, Home } from 'lucide-react';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="navbar-logo">
            <Link to="/" className="logo-link">
              <Code size={28} className="logo-icon" />
              <span className="logo-text">Question Generator</span>
            </Link>
          </div>
          <div className="navbar-links">
            <Link to="/" className="nav-link active">
              <Home size={18} className="nav-icon" />
              Dashboard
            </Link>
            <Link to="/generate" className="nav-link">
              <FileText size={18} className="nav-icon" />
              Generate Questions
            </Link>
            <Link to="/settings" className="nav-link">
              <Settings size={18} className="nav-icon" />
              Settings
            </Link>
          </div>
        </div>
        <div className="navbar-right">
          <button type="button" className="filter-button">
            <span className="sr-only">Filter</span>
            <Filter className="filter-icon" aria-hidden="true" />
          </button>
          <div className="user-menu">
            <div>
              <button
                type="button"
                className="user-button"
                id="user-menu"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="user-image"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </button>
            </div>
          </div>
        </div>
        <div className="mobile-menu-button">
          <button
            type="button"
            className="menu-toggle-button"
            aria-controls="mobile-menu"
            aria-expanded="false"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
            {isOpen ? (
              <X className="menu-icon" aria-hidden="true" />
            ) : (
              <Menu className="menu-icon" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mobile-menu" id="mobile-menu">
          <div className="mobile-menu-links">
            <Link
              to="/"
              className="mobile-link active"
            >
              Dashboard
            </Link>
            <Link
              to="/generate"
              className="mobile-link"
            >
              Generate Questions
            </Link>
            <Link
              to="/settings"
              className="mobile-link"
            >
              Settings
            </Link>
          </div>
          <div className="mobile-user-info">
            <div className="user-info-container">
              <div className="user-avatar">
                <img
                  className="avatar-image"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </div>
              <div className="user-details">
                <div className="user-name">Admin User</div>
                <div className="user-email">admin@example.com</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
