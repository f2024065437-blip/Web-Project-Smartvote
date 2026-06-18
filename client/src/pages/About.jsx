import React from 'react';

const About = () => {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '1rem' }}>About SmartVote</h1>
        <p style={{ marginBottom: '2rem', color: 'var(--gray-600)' }}>
          SmartVote is a secure, transparent, and user-friendly online voting platform designed to modernize the voting process.
        </p>
        
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3>Our Mission</h3>
          <p style={{ marginTop: '0.5rem' }}>
            To provide accessible, secure, and transparent voting solutions that empower every voice to be heard.
          </p>
        </div>
        
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3>Key Features</h3>
          <ul style={{ marginTop: '1rem', listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>✓ Secure Authentication with JWT</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ Real-time Results with Charts</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ Email Verification</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ Password Reset Functionality</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ Dark Mode Support</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ Mobile Responsive Design</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ One-Person-One-Vote Mechanism</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ Admin Dashboard</li>
          </ul>
        </div>
        
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3>Technology Stack</h3>
          <ul style={{ marginTop: '1rem', listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>🎨 Frontend: React.js</li>
            <li style={{ marginBottom: '0.5rem' }}>⚙️ Backend: Node.js + Express</li>
            <li style={{ marginBottom: '0.5rem' }}>🗄️ Database: MySQL</li>
            <li style={{ marginBottom: '0.5rem' }}>🔐 Authentication: JWT + Bcrypt</li>
          </ul>
        </div>
        
        <div className="card">
          <h3>Our Team</h3>
          <p style={{ marginTop: '0.5rem' }}>
            Built with modern technology to ensure the best voting experience.
          </p>
          <p style={{ marginTop: '1rem', color: 'var(--primary)' }}>
            SmartVote Team © 2024
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;