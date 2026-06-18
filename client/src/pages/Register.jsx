import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    student_id: '',
    department: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    const { confirmPassword, ...submitData } = formData;
    const result = await registerUser(submitData);
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="form-container">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Create Account</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>Join SmartVote today</p>
        
        {error && (
          <div style={{ background: '#fee', color: '#c00', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{ background: '#dfd', color: '#080', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              name="fullname"
              className="form-input" 
              value={formData.fullname}
              onChange={handleChange}
              required 
              placeholder="John Doe"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              name="email"
              className="form-input" 
              value={formData.email}
              onChange={handleChange}
              required 
              placeholder="you@example.com"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Department</label>
            <select 
              name="department"
              className="form-input" 
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              <option>Computer Science</option>
              <option>Software Engineering</option>
              <option>Information Technology</option>
              <option>Business Administration</option>
              <option>Electrical Engineering</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Student ID</label>
            <input 
              type="text" 
              name="student_id"
              className="form-input" 
              value={formData.student_id}
              onChange={handleChange}
              required 
              placeholder="CS-2024-001"
            />
          </div>
          
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Password</label>
            <input 
              type={showPassword ? 'text' : 'password'} 
              name="password"
              className="form-input" 
              value={formData.password}
              onChange={handleChange}
              required 
              placeholder="Create a password"
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
          
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Confirm Password</label>
            <input 
              type={showConfirmPassword ? 'text' : 'password'} 
              name="confirmPassword"
              className="form-input" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
              placeholder="Confirm your password"
              style={{ paddingRight: '45px' }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              {showConfirmPassword ? (
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
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
              marginTop: '0.5rem'
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
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
          
          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Register;