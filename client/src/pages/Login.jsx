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
    e.preventDefault();  // ✅ THIS STOPS PAGE REFRESH
    console.log('🔵 Login attempted');
    
    setLoading(true);
    setError('');

    try {
      const result = await loginUser({ email, password });
      console.log('📝 Login result:', result);
      
      if (result.success) {
        login(result.data);
        if (result.data.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('💥 Error:', error);
      setError('An unexpected error occurred.');
    }
    
    setLoading(false);
  };

  return (
    <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="form-container">
        <h2>Welcome Back</h2>
        <p style={{ color: 'var(--gray-500)' }}>Login to your account</p>
        
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
              placeholder="admin@test.com"
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
                padding: '5px'
              }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
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
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Sign up</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;