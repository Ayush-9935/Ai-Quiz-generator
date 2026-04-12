import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, BrainCircuit } from 'lucide-react';

const Navbar = ({ isDarkMode, toggleDarkMode, isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="w-full" style={{ position: 'sticky', top: 0, width: '100%', zIndex: 50, backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ width: '100%', maxWidth: '1440px', margin: '0 auto', padding: '0 2rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem' }}>
            <BrainCircuit style={{ width: '1.5rem', height: '1.5rem', color: 'var(--primary-600)' }} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.025em', color: 'var(--text-main)' }}>
            AIQuiz
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <Link to="/history" style={{ fontSize: '13px', fontWeight: 700, textDecoration: 'none', color: 'var(--text-muted)' }}>
                My Quizzes
              </Link>
              <div style={{ width: '1px', height: '1.25rem', backgroundColor: 'var(--border-color)' }}></div>
              <button
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '13px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#ef4444' }}
              >
                <LogOut style={{ width: '1rem', height: '1rem' }} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <Link to="/login" style={{ fontSize: '14px', fontWeight: 700, textDecoration: 'none', color: 'var(--text-muted)' }}>
                Login
              </Link>
              <Link to="/register" style={{ fontSize: '13px', fontWeight: 700, textDecoration: 'none', padding: '0.4rem 1rem', borderRadius: '0.375rem', backgroundColor: 'var(--primary-600)', color: 'white' }}>
                Sign Up
              </Link>
            </div>
          )}
          
          <button
            onClick={toggleDarkMode}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', marginLeft: '1rem', border: 'none', cursor: 'pointer', background: 'none', color: 'var(--text-main)' }}
          >
            {isDarkMode ? <Sun style={{ width: '1.25rem', height: '1.25rem' }} /> : <Moon style={{ width: '1.25rem', height: '1.25rem' }} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
