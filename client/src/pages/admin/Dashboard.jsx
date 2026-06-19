import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminDashboard } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_admins: 0,
    total_elections: 0,
    active_elections: 0,
    total_votes: 0,
    total_candidates: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const result = await getAdminDashboard();
    if (result.success) {
      setStats(result.data);
    }
    setLoading(false);
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  const statCards = [
    { label: 'Total Users', value: stats.total_users, icon: '👥', color: '#6366f1' },
    { label: 'Total Admins', value: stats.total_admins, icon: '👨‍💼', color: '#8b5cf6' },
    { label: 'Total Elections', value: stats.total_elections, icon: '🗳️', color: '#10b981' },
    { label: 'Active Elections', value: stats.active_elections, icon: '🔥', color: '#f59e0b' },
    { label: 'Total Votes', value: stats.total_votes, icon: '✓', color: '#6366f1' },
    { label: 'Candidates', value: stats.total_candidates, icon: '👥', color: '#ef4444' }
  ];

  return (
    <section className="section">
      <div className="container">
        <h1>Admin Dashboard</h1>
        <p style={{ color: 'var(--gray-500)', marginBottom: '2rem' }}>
          Welcome back, {user?.fullname || 'Administrator'}
        </p>
        
        <div className="stats-grid">
          {statCards.map((card, index) => (
            <div key={index} className="stat-card">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{card.icon}</div>
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">{card.label}</div>
            </div>
          ))}
        </div>
        
       <div className="card">
  <h3>Quick Actions</h3>
  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
    {/* Start New Election - Primary Button */}
    <Link 
      to="/admin/elections" 
      style={{
        padding: '0.7rem 1.8rem',
        fontSize: '0.95rem',
        fontWeight: '600',
        borderRadius: '8px',
        background: '#6366f1',
        color: 'white',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
        display: 'inline-block'
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
      🗳️ Start New Election
    </Link>

    {/* Manage Candidates - Outline Button */}
    <Link 
      to="/admin/candidates" 
      style={{
        padding: '0.7rem 1.8rem',
        fontSize: '0.95rem',
        fontWeight: '600',
        borderRadius: '8px',
        border: '2px solid #6366f1',
        color: '#6366f1',
        background: 'transparent',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        display: 'inline-block'
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
      👥 Manage Candidates
    </Link>

    {/* Manage Users - Outline Button */}
    <Link 
      to="/admin/users" 
      style={{
        padding: '0.7rem 1.8rem',
        fontSize: '0.95rem',
        fontWeight: '600',
        borderRadius: '8px',
        border: '2px solid #6366f1',
        color: '#6366f1',
        background: 'transparent',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        display: 'inline-block'
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
      👤 Manage Users
    </Link>

    {/* View Results - Outline Button */}
    <Link 
      to="/results" 
      style={{
        padding: '0.7rem 1.8rem',
        fontSize: '0.95rem',
        fontWeight: '600',
        borderRadius: '8px',
        border: '2px solid #6366f1',
        color: '#6366f1',
        background: 'transparent',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        display: 'inline-block'
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
      📊 View Results
    </Link>
  </div>
</div>
        {/* Admin Info */}
        <div className="card" style={{ marginTop: '1.5rem', background: 'var(--primary-bg)' }}>
          <h4 style={{ color: 'var(--primary)' }}>🔑 Admin Controls</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
            As an admin, you can:
          </p>
          <ul style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginTop: '0.5rem' }}>
            <li>✅ Create and manage elections</li>
            <li>✅ Add and manage candidates</li>
            <li>✅ View voter analytics</li>
            <li>✅ Monitor real-time results</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;