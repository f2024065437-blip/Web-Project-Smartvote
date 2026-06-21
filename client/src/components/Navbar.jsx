import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  console.log('🔍 Navbar - User:', user);
  console.log('🔍 Navbar - User role:', user?.role);
  console.log('🔍 Navbar - isAdmin:', user?.role === 'admin');
  console.log('🔍 Navbar - isAuthenticated:', isAuthenticated);

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
  console.log('🔍 Navbar - isAdmin variable:', isAdmin);

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
          textDecoration: 'none',
          flexShrink: 0
        }}>
          <div style={{
            width: 'clamp(36px, 5vw, 42px)',
            height: 'clamp(36px, 5vw, 42px)',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}>
            <span style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', color: 'white' }}>🗳️</span>
          </div>
          <div style={{ display: window.innerWidth < 480 ? 'none' : 'block' }}>
            <span style={{
              fontSize: 'clamp(1rem, 3vw, 1.4rem)',
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
              fontSize: '0.4rem',
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
            display: window.innerWidth < 768 ? 'block' : 'none',
            background: 'none',
            border: 'none',
            fontSize: '1.8rem',
            cursor: 'pointer',
            color: isDark ? '#e2e8f0' : '#1e293b',
            padding: '0.3rem 0.5rem',
            borderRadius: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Links - Desktop */}
        <div style={{
          display: window.innerWidth < 768 ? 'none' : 'flex',
          gap: '0.3rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {['Home', 'Results', 'About', 'Contact'].map((item) => (
            <Link
              key={item}
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              style={{
                padding: '0.4rem 0.7rem',
                fontSize: '0.8rem',
                fontWeight: '500',
                color: isDark ? '#94a3b8' : '#64748b',
                textDecoration: 'none',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
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
                  padding: '0.4rem 0.7rem',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  color: isDark ? '#94a3b8' : '#64748b',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
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
                  padding: '0.4rem 0.7rem',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  color: isDark ? '#94a3b8' : '#64748b',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
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
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.75rem',
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
                      gap: '0.3rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    ⚡ Admin ▼
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
                      minWidth: '180px'
                    }}
                  >
                    <div style={{
                      background: isDark ? '#1e293b' : 'white',
                      border: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`,
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      padding: '0.5rem 0'
                    }}>
                      <Link to="/admin/dashboard" style={{ 
                        display: 'block', 
                        padding: '0.5rem 1rem', 
                        textDecoration: 'none', 
                        fontSize: '0.8rem',
                        color: isDark ? '#e2e8f0' : '#1e293b',
                        transition: 'all 0.2s ease'
                      }}>
                        📊 Dashboard
                      </Link>
                      <Link to="/admin/elections" style={{ 
                        display: 'block', 
                        padding: '0.5rem 1rem', 
                        textDecoration: 'none', 
                        fontSize: '0.8rem',
                        color: isDark ? '#e2e8f0' : '#1e293b',
                        transition: 'all 0.2s ease'
                      }}>
                        🗳️ Elections
                      </Link>
                      <Link to="/admin/candidates" style={{ 
                        display: 'block', 
                        padding: '0.5rem 1rem', 
                        textDecoration: 'none', 
                        fontSize: '0.8rem',
                        color: isDark ? '#e2e8f0' : '#1e293b',
                        transition: 'all 0.2s ease'
                      }}>
                        👥 Candidates
                      </Link>
                      <Link to="/admin/users" style={{ 
                        display: 'block', 
                        padding: '0.5rem 1rem', 
                        textDecoration: 'none', 
                        fontSize: '0.8rem',
                        color: isDark ? '#e2e8f0' : '#1e293b',
                        transition: 'all 0.2s ease'
                      }}>
                        👤 Users
                      </Link>
                      <Link to="/admin/reports" style={{ 
                        display: 'block', 
                        padding: '0.5rem 1rem', 
                        textDecoration: 'none', 
                        fontSize: '0.8rem',
                        color: isDark ? '#e2e8f0' : '#1e293b',
                        transition: 'all 0.2s ease'
                      }}>
                        📈 Reports
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleLogout}
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  borderRadius: '8px',
                  border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
                  background: 'transparent',
                  color: '#ef4444',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap'
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
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  borderRadius: '8px',
                  border: `1px solid ${isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)'}`,
                  color: '#6366f1',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap'
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
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                  whiteSpace: 'nowrap'
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
              width: 'clamp(34px, 4vw, 38px)',
              height: 'clamp(34px, 4vw, 38px)',
              borderRadius: '10px',
              border: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`,
              background: isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(241, 245, 249, 0.5)',
              cursor: 'pointer',
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
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
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          display: window.innerWidth < 768 ? 'flex' : 'none',
          flexDirection: 'column',
          padding: '1rem 0',
          gap: '0.5rem',
          borderTop: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`,
          marginTop: '0.8rem'
        }}>
          {['Home', 'Vote', 'Results', 'About', 'Contact'].map((item) => (
            <Link
              key={item}
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              style={{
                padding: '0.7rem 0.9rem',
                fontSize: '1rem',
                color: isDark ? '#e2e8f0' : '#1e293b',
                textDecoration: 'none',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) => {
                e.target.style.background = isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}
            >
              {item === 'Home' && '🏠'}
              {item === 'Vote' && '🗳️'}
              {item === 'Results' && '📊'}
              {item === 'About' && 'ℹ️'}
              {item === 'Contact' && '📧'}
              {item}
            </Link>
          ))}
          
          {isAuthenticated && (
            <>
              <Link
                to="/profile"
                style={{
                  padding: '0.7rem 0.9rem',
                  fontSize: '1rem',
                  color: isDark ? '#e2e8f0' : '#1e293b',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onClick={() => setMobileMenuOpen(false)}
                onMouseEnter={(e) => {
                  e.target.style.background = isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                }}
              >
                👤 Profile
              </Link>
              {isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    style={{
                      padding: '0.7rem 0.9rem',
                      fontSize: '1rem',
                      color: isDark ? '#e2e8f0' : '#1e293b',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'rgba(99, 102, 241, 0.1)'
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ⚡ Admin Panel
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                style={{
                  padding: '0.7rem 0.9rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  borderRadius: '8px',
                  border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
                  background: 'transparent',
                  color: '#ef4444',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#ef4444';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#ef4444';
                }}
              >
                🚪 Logout
              </button>
            </>
          )}
          
          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                style={{
                  padding: '0.7rem 0.9rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  borderRadius: '8px',
                  border: `1px solid ${isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)'}`,
                  color: '#6366f1',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  padding: '0.7rem 0.9rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </>
          )}
          
          <button
            onClick={() => {
              toggleTheme();
              setMobileMenuOpen(false);
            }}
            style={{
              padding: '0.7rem 0.9rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`,
              background: 'transparent',
              cursor: 'pointer',
              color: isDark ? '#e2e8f0' : '#1e293b',
              transition: 'all 0.3s ease',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;