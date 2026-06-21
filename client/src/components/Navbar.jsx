import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAdminOpen, setMobileAdminOpen] = useState(false);

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
    setMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setMobileAdminOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileAdminOpen(false);
  };

  const isAdmin = user?.role === 'admin';

  const baseLinks = ['Home', 'Results', 'About', 'Contact'];
  const adminLinks = [
    { to: '/admin/dashboard', label: '📊 Dashboard' },
    { to: '/admin/elections', label: '🗳️ Elections' },
    { to: '/admin/candidates', label: '👥 Candidates' },
    { to: '/admin/users', label: '👤 Users' },
    { to: '/admin/reports', label: '📈 Reports' }
  ];

  const mobileLinkStyle = {
    display: 'block',
    padding: '0.8rem 1.2rem',
    fontSize: '1rem',
    fontWeight: '500',
    color: isDark ? '#e2e8f0' : '#1e293b',
    textDecoration: 'none',
    borderRadius: '8px',
    transition: 'all 0.2s ease'
  };

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
        <Link to="/" onClick={closeMobileMenu} style={{
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
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            flexShrink: 0
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
              color: '#94a3b8',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginTop: '-2px'
            }}>
              Secure • Transparent • Reliable
            </span>
          </div>
        </Link>

        {/* Desktop Navigation - hidden on mobile via CSS below */}
        <div className="navbar-desktop-nav" style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {baseLinks.map((item) => (
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
                <div
                  className="admin-dropdown"
                  style={{ position: 'relative', display: 'inline-block' }}
                  onMouseEnter={(e) => {
                    const content = e.currentTarget.querySelector('.admin-dropdown-content');
                    if (content) content.style.display = 'block';
                  }}
                  onMouseLeave={(e) => {
                    const content = e.currentTarget.querySelector('.admin-dropdown-content');
                    if (content) content.style.display = 'none';
                  }}
                >
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
                  >
                    ⚡ Admin Panel ▼
                  </button>
                  <div
                    className="admin-dropdown-content"
                    style={{
                      display: 'none',
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      marginTop: '0',
                      paddingTop: '0.5rem',
                      background: 'transparent',
                      zIndex: 1000,
                      minWidth: '200px'
                    }}
                  >
                    <div style={{
                      background: isDark ? '#1e293b' : 'white',
                      border: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`,
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      padding: '0.5rem 0'
                    }}>
                      {adminLinks.map((link) => (
                        <Link key={link.to} to={link.to} style={{
                          display: 'block',
                          padding: '0.6rem 1.2rem',
                          textDecoration: 'none',
                          color: isDark ? '#e2e8f0' : '#1e293b',
                          transition: 'all 0.2s ease'
                        }}>
                          {link.label}
                        </Link>
                      ))}
                    </div>
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
              justifyContent: 'center',
              flexShrink: 0
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

        {/* Hamburger - hidden on desktop, shown on mobile via CSS below */}
        <button
          className="navbar-hamburger"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.6rem',
            cursor: 'pointer',
            color: isDark ? '#e2e8f0' : '#1e293b',
            padding: '0.3rem 0.5rem',
            flexShrink: 0
          }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '0.8rem 0',
          gap: '0.2rem',
          borderTop: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`,
          marginTop: '0.8rem'
        }}>
          {baseLinks.map((item) => (
            <Link
              key={item}
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              style={mobileLinkStyle}
              onClick={closeMobileMenu}
              onMouseEnter={(e) => { e.target.style.background = isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)'; }}
              onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
            >
              {item}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link to="/vote" style={mobileLinkStyle} onClick={closeMobileMenu}>Vote</Link>
              <Link to="/profile" style={mobileLinkStyle} onClick={closeMobileMenu}>Profile</Link>

              {isAdmin && (
                <div>
                  <button
                    onClick={() => setMobileAdminOpen(!mobileAdminOpen)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.8rem 1.2rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: 'white',
                      cursor: 'pointer',
                      marginTop: '0.3rem'
                    }}
                  >
                    <span>⚡ Admin Panel</span>
                    <span>{mobileAdminOpen ? '▲' : '▼'}</span>
                  </button>
                  {mobileAdminOpen && (
                    <div style={{ paddingLeft: '0.8rem', marginTop: '0.2rem' }}>
                      {adminLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          style={{ ...mobileLinkStyle, fontSize: '0.9rem' }}
                          onClick={closeMobileMenu}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleLogout}
                style={{
                  marginTop: '0.5rem',
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.8rem 1.2rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  borderRadius: '8px',
                  border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
                  background: 'transparent',
                  color: '#ef4444',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{ ...mobileLinkStyle, color: '#6366f1', fontWeight: '600' }}
                onClick={closeMobileMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  ...mobileLinkStyle,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  fontWeight: '600',
                  marginTop: '0.3rem'
                }}
                onClick={closeMobileMenu}
              >
                Sign up
              </Link>
            </>
          )}

          <button
            onClick={toggleTheme}
            style={{
              marginTop: '0.5rem',
              width: '100%',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.8rem 1.2rem',
              fontSize: '1rem',
              fontWeight: '500',
              borderRadius: '8px',
              border: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`,
              background: 'transparent',
              color: isDark ? '#e2e8f0' : '#1e293b',
              cursor: 'pointer'
            }}
          >
            {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      )}

      <style>{`
        .navbar-hamburger {
          display: none;
        }
        @media (max-width: 768px) {
          .navbar-desktop-nav {
            display: none !important;
          }
          .navbar-hamburger {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;