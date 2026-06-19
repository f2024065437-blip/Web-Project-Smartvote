import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.body.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav style={{
      background: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`,
      padding: '0.8rem 5%',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          textDecoration: 'none'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}>
            <span style={{ fontSize: '1.3rem', color: 'white' }}>🗳️</span>
          </div>
          <div>
            <span style={{
              fontSize: '1.4rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}>
              SmartVote
            </span>
            <span style={{
              display: 'block',
              fontSize: '0.5rem',
              fontWeight: '500',
              color: isDark ? '#94a3b8' : '#94a3b8',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginTop: '-2px'
            }}>
              Secure • Transparent • Reliable
            </span>
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu} 
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: isDark ? '#e2e8f0' : '#1e293b'
          }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {['Home', 'Results', 'About', 'Contact'].map((item) => (
            <Link
              key={item}
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              style={{
                padding: '0.5rem 0.9rem',
                fontSize: '0.85rem',
                fontWeight: '500',
                color: isDark ? '#94a3b8' : '#64748b',
                textDecoration: 'none',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#6366f1';
                e.target.style.background = isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = isDark ? '#94a3b8' : '#64748b';
                e.target.style.background = 'transparent';
              }}
            >
              {item}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <>
              <Link
                to="/vote"
                style={{
                  padding: '0.5rem 0.9rem',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  color: isDark ? '#94a3b8' : '#64748b',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#6366f1';
                  e.target.style.background = isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = isDark ? '#94a3b8' : '#64748b';
                  e.target.style.background = 'transparent';
                }}
              >
                Vote
              </Link>
              <Link
                to="/profile"
                style={{
                  padding: '0.5rem 0.9rem',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  color: isDark ? '#94a3b8' : '#64748b',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#6366f1';
                  e.target.style.background = isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = isDark ? '#94a3b8' : '#64748b';
                  e.target.style.background = 'transparent';
                }}
              >
                Profile
              </Link>

             {isAdmin && (
  <div className="admin-dropdown" style={{ position: 'relative', display: 'inline-block' }}>
    <button
      className="admin-dropdown-btn"
      style={{
        padding: '0.5rem 1rem',
        fontSize: '0.85rem',
        fontWeight: '600',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 4px 16px rgba(99, 102, 241, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.3)';
      }}
    >
      ⚡ Admin Panel ▼
    </button>
    <div 
      className="admin-dropdown-content"
      style={{
        position: 'absolute',
        top: '100%',
        left: '0',
        marginTop: '0.5rem',
        background: isDark ? '#1e293b' : 'white',
        border: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`,
        borderRadius: '8px',
        minWidth: '200px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        zIndex: 1000,
        display: 'none',
        padding: '0.5rem 0'
      }}
    >
      <Link to="/admin/dashboard" style={{ 
        display: 'block', 
        padding: '0.6rem 1.2rem', 
        textDecoration: 'none', 
        color: isDark ? '#e2e8f0' : '#1e293b',
        transition: 'all 0.2s ease'
      }}>
        📊 Dashboard
      </Link>
      <Link to="/admin/elections" style={{ 
        display: 'block', 
        padding: '0.6rem 1.2rem', 
        textDecoration: 'none', 
        color: isDark ? '#e2e8f0' : '#1e293b',
        transition: 'all 0.2s ease'
      }}>
        🗳️ Elections
      </Link>
      <Link to="/admin/candidates" style={{ 
        display: 'block', 
        padding: '0.6rem 1.2rem', 
        textDecoration: 'none', 
        color: isDark ? '#e2e8f0' : '#1e293b',
        transition: 'all 0.2s ease'
      }}>
        👥 Candidates
      </Link>
      <Link to="/admin/users" style={{ 
        display: 'block', 
        padding: '0.6rem 1.2rem', 
        textDecoration: 'none', 
        color: isDark ? '#e2e8f0' : '#1e293b',
        transition: 'all 0.2s ease'
      }}>
        👤 Users
      </Link>
      <Link to="/admin/reports" style={{ 
        display: 'block', 
        padding: '0.6rem 1.2rem', 
        textDecoration: 'none', 
        color: isDark ? '#e2e8f0' : '#1e293b',
        transition: 'all 0.2s ease'
      }}>
        📈 Reports
      </Link>
    </div>
  </div>
)}
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 1.2rem',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  borderRadius: '8px',
                  border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
                  background: 'transparent',
                  color: '#ef4444',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#ef4444';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#ef4444';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  padding: '0.5rem 1.2rem',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  borderRadius: '8px',
                  border: `1px solid ${isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)'}`,
                  color: '#6366f1',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#6366f1';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#6366f1';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  padding: '0.5rem 1.2rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 16px rgba(99, 102, 241, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.3)';
                }}
              >
                Sign up
              </Link>
            </>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              border: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`,
              background: isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(241, 245, 249, 0.5)',
              cursor: 'pointer',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'rotate(15deg) scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'rotate(0deg) scale(1)';
            }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem 0',
          gap: '0.5rem',
          borderTop: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`,
          marginTop: '0.8rem'
        }}>
          {['Home', 'Results', 'About', 'Contact'].map((item) => (
            <Link
              key={item}
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              style={{
                padding: '0.6rem 0.9rem',
                fontSize: '0.95rem',
                color: isDark ? '#e2e8f0' : '#1e293b',
                textDecoration: 'none',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) => {
                e.target.style.background = isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}
            >
              {item}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;