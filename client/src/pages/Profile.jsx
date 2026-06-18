import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getVotingHistory } from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const result = await getVotingHistory();
    if (result.success) {
      setHistory(result.data);
    }
    setLoading(false);
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
              borderRadius: '50%', 
              margin: '0 auto 1rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '3rem', 
              color: 'white' 
            }}>
              {user?.fullname?.charAt(0) || 'U'}
            </div>
            <h2>{user?.fullname}</h2>
            <p style={{ color: 'var(--gray-500)' }}>{user?.email}</p>
            <p>
              <span style={{ 
                background: user?.role === 'admin' ? '#ef4444' : '#10b981', 
                color: 'white', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '20px', 
                fontSize: '0.75rem' 
              }}>
                {user?.role === 'admin' ? 'Administrator' : 'Voter'}
              </span>
            </p>
          </div>
          
          <hr style={{ margin: '1.5rem 0' }} />
          
          <h3 style={{ marginBottom: '1rem' }}>Voting History</h3>
          {history.length === 0 ? (
            <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: '2rem' }}>
              No voting history yet.
            </p>
          ) : (
            history.map(vote => (
              <div key={vote.id} className="card" style={{ marginBottom: '1rem' }}>
                <p><strong>🗳️ {vote.election_title}</strong></p>
                <p>Voted for: <strong style={{ color: '#6366f1' }}>{vote.candidate_name}</strong> ({vote.party})</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                  Date: {new Date(vote.vote_time).toLocaleString()}
                </p>
              </div>
            ))
          )}
          
          <hr style={{ margin: '1.5rem 0' }} />
          
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Account Information</h3>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Department:</strong> {user?.department || 'Not specified'}</p>
            <p><strong>Student ID:</strong> {user?.student_id || 'Not specified'}</p>
            <p><strong>Member since:</strong> {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;