import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    const result = await forgotPassword(email);
    if (result.success) {
      setMessage(result.message);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="form-container">
        <h2>Forgot Password?</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>
          Enter your email to receive a reset link
        </p>
        
        {message && (
          <div style={{ background: '#dfd', color: '#080', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
            {message}
          </div>
        )}
        
        {error && (
          <div style={{ background: '#fee', color: '#c00', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              placeholder="you@example.com"
            />
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
  {loading ? 'Sending...' : 'Send Reset Link'}
</button>  
          <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/login" style={{ color: 'var(--primary)' }}>Back to Login</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;