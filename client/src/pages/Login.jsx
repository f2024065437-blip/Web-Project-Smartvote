import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔵 Form submitted!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    
    setLoading(true);
    setError('');

    try {
      console.log('🔄 Calling loginUser...');
      const result = await loginUser({ email, password });
      console.log('📝 Login result:', result);
      
      if (result.success) {
        console.log('✅ Login successful!');
        login(result.data);
        console.log('👤 User data saved:', result.data);
        console.log('🎯 Role:', result.data.role);
        
        if (result.data.role === 'admin') {
          console.log('➡️ Redirecting to admin dashboard...');
          navigate('/admin/dashboard');
        } else {
          console.log('➡️ Redirecting to home...');
          navigate('/');
        }
      } else {
        console.log('❌ Login failed:', result.message);
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('💥 Unexpected error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="form-container">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>Login to your account</p>
        
        {error && (
          <div style={{ background: '#fee', color: '#c00', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              placeholder="admin@smartvote.com"
            />
          </div>
          
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Password</label>
            <input 
              type={showPassword ? 'text' : 'password'} 
              className="form-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              placeholder="••••••••"
              style={{ paddingRight: '45px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '38px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
                color: 'var(--gray-500)',
                padding: '5px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = 'var(--primary)';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'var(--gray-500)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              )}
            </button>
          </div>
          
          <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
            <Link to="/forgot-password" style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>
              Forgot password?
            </Link>
          </div>
          
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              border: 'none',
              background: loading ? '#94a3b8' : '#6366f1',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = '#4f46e5';
                e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = '#6366f1';
                e.target.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.3)';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Sign up</Link>
          </p>
        </form>

        <hr style={{ margin: '1.5rem 0' }} />

        <div style={{ background: 'var(--primary-bg)', padding: '1rem', borderRadius: '0.5rem' }}>
          <p style={{ fontSize: '0.75rem', textAlign: 'center', color: 'var(--gray-500)' }}>
            🔒 Secure voting platform. Please login with your credentials.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;