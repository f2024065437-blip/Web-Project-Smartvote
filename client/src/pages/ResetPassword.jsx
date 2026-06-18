import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    const result = await resetPassword(token, password);
    if (result.success) {
      setMessage(result.message);
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="form-container">
        <h2>Reset Password</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>
          Create a new password for your account
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
            <label className="form-label">New Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              placeholder="Enter new password"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
              placeholder="Confirm new password"
            />
          </div>
          
          <button type="submit" className="btn-primary btn-block" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          
          <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/login" style={{ color: 'var(--primary)' }}>Back to Login</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;