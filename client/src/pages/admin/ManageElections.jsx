import React, { useState, useEffect } from 'react';
import { getAllElections, createElection, updateElection, deleteElection } from '../../services/api';

const ManageElections = () => {
  const [elections, setElections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'upcoming'
  });

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = async () => {
    const result = await getAllElections();
    if (result.success) {
      setElections(result.data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    if (editing) {
      result = await updateElection(editing.id, formData);
    } else {
      result = await createElection(formData);
    }
    if (result.success) {
      loadElections();
      setShowForm(false);
      setEditing(null);
      setFormData({ title: '', description: '', start_date: '', end_date: '', status: 'upcoming' });
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this election? This action cannot be undone.')) {
      const result = await deleteElection(id);
      if (result.success) {
        loadElections();
        alert(result.message);
      } else {
        alert(result.message);
      }
    }
  };

  const handleEdit = (election) => {
    setEditing(election);
    setFormData({
      title: election.title,
      description: election.description || '',
      start_date: election.start_date.slice(0, 16),
      end_date: election.end_date.slice(0, 16),
      status: election.status
    });
    setShowForm(true);
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: '#10b981',
      upcoming: '#f59e0b',
      ended: '#6b7280'
    };
    return {
      background: colors[status] || '#6b7280',
      color: 'white',
      padding: '0.25rem 0.5rem',
      borderRadius: '20px',
      fontSize: '0.75rem',
      display: 'inline-block'
    };
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <section className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1>Manage Elections</h1>
          <button 
            className="btn-primary" 
            onClick={() => { setShowForm(!showForm); setEditing(null); setFormData({ title: '', description: '', start_date: '', end_date: '', status: 'upcoming' }); }}
            style={{
              padding: '0.6rem 1.5rem',
              fontSize: '0.95rem',
              fontWeight: '600',
              borderRadius: '8px',
              border: 'none',
              background: showForm ? '#ef4444' : '#6366f1',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 6px rgba(99, 102, 241, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!showForm) {
                e.target.style.background = '#4f46e5';
                e.target.style.boxShadow = '0 4px 10px rgba(99, 102, 241, 0.4)';
                e.target.style.transform = 'translateY(-2px)';
              } else {
                e.target.style.background = '#dc2626';
              }
            }}
            onMouseLeave={(e) => {
              if (!showForm) {
                e.target.style.background = '#6366f1';
                e.target.style.boxShadow = '0 2px 6px rgba(99, 102, 241, 0.3)';
                e.target.style.transform = 'translateY(0)';
              } else {
                e.target.style.background = '#ef4444';
              }
            }}
          >
            {showForm ? '✕ Cancel' : '+ New Election'}
          </button>
        </div>
        
        {showForm && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3>{editing ? 'Edit Election' : 'Create New Election'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-input" 
                  rows="3" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input 
                  type="datetime-local" 
                  className="form-input" 
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date *</label>
                <input 
                  type="datetime-local" 
                  className="form-input" 
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select 
                  className="form-input" 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button 
                  type="submit" 
                  className="btn-primary"
                  style={{
                    padding: '0.6rem 1.8rem',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#10b981',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#059669';
                    e.target.style.boxShadow = '0 4px 10px rgba(16, 185, 129, 0.4)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#10b981';
                    e.target.style.boxShadow = '0 2px 6px rgba(16, 185, 129, 0.3)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  {editing ? '✅ Update' : '✅ Create'}
                </button>
                <button 
                  type="button" 
                  className="btn-outline" 
                  onClick={() => { setShowForm(false); setEditing(null); }}
                  style={{
                    padding: '0.6rem 1.8rem',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    borderRadius: '8px',
                    border: '2px solid #ef4444',
                    color: '#ef4444',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#ef4444';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 10px rgba(239, 68, 68, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#ef4444';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  ✕ Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Candidates</th>
                <th>Votes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {elections.map(election => (
                <tr key={election.id}>
                  <td><strong>{election.title}</strong></td>
                  <td>{new Date(election.start_date).toLocaleDateString()}</td>
                  <td>{new Date(election.end_date).toLocaleDateString()}</td>
                  <td><span style={getStatusBadge(election.status)}>{election.status}</span></td>
                  <td>{election.total_candidates || 0}</td>
                  <td>{election.total_votes || 0}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn-outline" 
                        style={{ 
                          padding: '0.3rem 0.8rem',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          borderRadius: '6px',
                          border: '2px solid #6366f1',
                          color: '#6366f1',
                          background: 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => handleEdit(election)}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#6366f1';
                          e.target.style.color = 'white';
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#6366f1';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn-outline" 
                        style={{ 
                          padding: '0.3rem 0.8rem',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          borderRadius: '6px',
                          border: '2px solid #ef4444',
                          color: '#ef4444',
                          background: 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => handleDelete(election.id)}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#ef4444';
                          e.target.style.color = 'white';
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#ef4444';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {elections.length === 0 && (
          <p style={{ textAlign: 'center', padding: '2rem' }}>No elections found. Create your first election!</p>
        )}
      </div>
    </section>
  );
};

export default ManageElections;