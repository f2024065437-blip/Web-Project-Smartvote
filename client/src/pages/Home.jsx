import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getActiveElections } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = async () => {
    const result = await getActiveElections();
    if (result.success) {
      setElections(result.data);
    }
    setLoading(false);
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Secure Online Voting<br />Made Simple</h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--gray-600)', marginBottom: '2rem' }}>
            Cast your vote securely from anywhere. Real-time results. Complete transparency.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/vote" 
              className="btn btn-primary btn-large"
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '8px',
                background: '#6366f1',
                color: 'white',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                display: 'inline-block',
                width: 'auto'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#4f46e5';
                e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#6366f1';
                e.target.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.3)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Get Started →
            </Link>
            <Link 
              to="/results" 
              className="btn btn-outline btn-large"
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '8px',
                border: '2px solid #6366f1',
                color: '#6366f1',
                background: 'transparent',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                width: 'auto'
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
              View Results
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Active Elections</h2>
          <p style={{ textAlign: 'center', color: 'var(--gray-500)', marginBottom: '3rem' }}>
            Participate in ongoing elections
          </p>
          
          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : elections.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No active elections at the moment.</p>
          ) : (
            <div className="grid-3">
              {elections.map(election => (
                <div key={election.id} className="card">
                  <h3>{election.title}</h3>
                  <p style={{ color: 'var(--gray-600)', margin: '0.5rem 0' }}>{election.description}</p>
                  <p>📅 Ends: {new Date(election.end_date).toLocaleDateString()}</p>
                  <Link 
                    to="/vote" 
                    className="btn btn-primary"
                    style={{
                      marginTop: '1rem',
                      padding: '0.6rem 1.5rem',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      borderRadius: '8px',
                      background: '#6366f1',
                      color: 'white',
                      textDecoration: 'none',
                      display: 'inline-block',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 6px rgba(99, 102, 241, 0.25)',
                      width: 'auto'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#4f46e5';
                      e.target.style.boxShadow = '0 4px 10px rgba(99, 102, 241, 0.35)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#6366f1';
                      e.target.style.boxShadow = '0 2px 6px rgba(99, 102, 241, 0.25)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Vote Now →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section" style={{ background: 'var(--gray-100)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Why Choose SmartVote?</h2>
          <div className="grid-3">
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔒</div>
              <h3>Secure & Anonymous</h3>
              <p style={{ color: 'var(--gray-600)' }}>Your vote is encrypted and completely anonymous.</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
              <h3>Real-Time Results</h3>
              <p style={{ color: 'var(--gray-600)' }}>Watch votes update instantly with live charts.</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌓</div>
              <h3>Dark Mode</h3>
              <p style={{ color: 'var(--gray-600)' }}>Vote comfortably day or night.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;