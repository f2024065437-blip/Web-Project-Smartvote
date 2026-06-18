import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../services/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const result = await getAllUsers();
    if (result.success) {
      setUsers(result.data.users || []);
    }
    setLoading(false);
  };

  const filteredUsers = users.filter(user =>
    user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.student_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <section className="section">
      <div className="container">
        <h1 style={{ marginBottom: '0.5rem' }}>Manage Users</h1>
        <p style={{ color: 'var(--gray-500)', marginBottom: '2rem' }}>
          Total registered voters: {users.length}
        </p>
        
        <div className="search-bar" style={{ justifyContent: 'flex-start' }}>
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 Search by name, email, or student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: '300px' }}
          />
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Student ID</th>
                <th>Verified</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td><strong>{user.fullname}</strong></td>
                  <td>{user.email}</td>
                  <td>{user.department || '-'}</td>
                  <td>{user.student_id || '-'}</td>
                  <td>
                    {user.email_verified ? (
                      <span style={{ color: '#10b981' }}>✓ Verified</span>
                    ) : (
                      <span style={{ color: '#f59e0b' }}>⚠ Pending</span>
                    )}
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <p style={{ textAlign: 'center', padding: '2rem' }}>No users found.</p>
        )}
      </div>
    </section>
  );
};

export default ManageUsers;