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
    try {
      const result = await getAdminDashboard();
      console.log('📊 Dashboard API Response:', result);
      
      if (result.success) {
        setStats(result.data);
      } else {
        console.error('Failed to load stats:', result.message);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

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
        <h1>📊 Admin Dashboard</h1>
        <p style={{ color: 'var(--gray-500)', marginBottom: '2rem' }}>
          Welcome back, <strong>{user?.fullname || 'Administrator'}</strong> 👋
        </p>
        
        {/* Stats Grid */}
        <div className="stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {statCards.map((card, index) => (
            <div key={index} className="stat-card" style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{card.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: card.color }}>
                {card.value}
              </div>
              <div style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
                {card.label}
              </div>
            </div>
          ))}
        </div>
        
        {/* Quick Actions */}
        <div className="card" style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3>⚡ Quick Actions</h3>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginTop: '1rem', 
            flexWrap: 'wrap' 
          }}>
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
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#6366f1';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              🗳️ Start New Election
            </Link>

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
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#6366f1';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              👥 Manage Candidates
            </Link>

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
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#6366f1';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              👤 Manage Users
            </Link>

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
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#6366f1';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              📊 View Results
            </Link>
          </div>
        </div>

        {/* Admin Info */}
        <div className="card" style={{ 
          marginTop: '1.5rem', 
          background: '#f0f4ff',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{ color: '#6366f1' }}>🔑 Admin Controls</h4>
          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
            As an admin, you can:
          </p>
          <ul style={{ fontSize: '0.875rem', color: '#4b5563', marginTop: '0.5rem' }}>
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