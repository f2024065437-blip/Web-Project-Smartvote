import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyEmail } from '../services/api';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    verify();
  }, []);

  const verify = async () => {
    const result = await verifyEmail(token);
    if (result.success) {
      setStatus('success');
      setMessage(result.message);
    } else {
      setStatus('error');
      setMessage(result.message);
    }
  };

  return (
    <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '500px' }}>
        {status === 'verifying' && (
          <>
            <div className="spinner" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: '1rem' }}>Verifying your email...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div style={{ fontSize: '4rem' }}>✓</div>
            <h2 style={{ color: '#10b981', marginTop: '1rem' }}>Email Verified!</h2>
            <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>{message}</p>
            <Link to="/login" className="btn-primary">Login Now</Link>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div style={{ fontSize: '4rem' }}>❌</div>
            <h2 style={{ color: '#ef4444', marginTop: '1rem' }}>Verification Failed</h2>
            <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>{message}</p>
            <Link to="/login" className="btn-primary">Go to Login</Link>
          </>
        )}
      </div>
    </section>
  );
};

export default VerifyEmail;