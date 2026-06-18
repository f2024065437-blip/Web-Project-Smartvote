import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" style={{ padding: '2rem 5% 1.5rem', marginTop: '2rem' }}>
      <div className="container">
        {/* Main Footer - 4 Columns */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '1.5rem', 
          marginBottom: '1.5rem'
        }}>
          {/* Brand */}
          <div>
            <h3 style={{ 
              fontSize: '1.2rem', 
              fontWeight: '800', 
              marginBottom: '0.5rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              SmartVote
            </h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.8rem', lineHeight: '1.5' }}>
              Secure, transparent online voting platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--gray-700)' }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <Link to="/" style={{ color: 'var(--gray-500)', fontSize: '0.8rem', textDecoration: 'none' }}>Home</Link>
              <Link to="/about" style={{ color: 'var(--gray-500)', fontSize: '0.8rem', textDecoration: 'none' }}>About</Link>
              <Link to="/results" style={{ color: 'var(--gray-500)', fontSize: '0.8rem', textDecoration: 'none' }}>Results</Link>
              <Link to="/contact" style={{ color: 'var(--gray-500)', fontSize: '0.8rem', textDecoration: 'none' }}>Contact</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--gray-700)' }}>
              Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <a href="#" style={{ color: 'var(--gray-500)', fontSize: '0.8rem', textDecoration: 'none' }}>FAQ</a>
              <a href="#" style={{ color: 'var(--gray-500)', fontSize: '0.8rem', textDecoration: 'none' }}>Help Center</a>
              <a href="#" style={{ color: 'var(--gray-500)', fontSize: '0.8rem', textDecoration: 'none' }}>Privacy</a>
              <a href="#" style={{ color: 'var(--gray-500)', fontSize: '0.8rem', textDecoration: 'none' }}>Terms</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--gray-700)' }}>
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>📧 support@smartvote.com</span>
              <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>📞 +92 300 1234567</span>
              <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>📍 Karachi, Pakistan</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr style={{ border: 'none', borderTop: '1px solid var(--gray-200)', margin: '1rem 0' }} />

        {/* Bottom Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.7rem', margin: 0 }}>
            © {currentYear} SmartVote. All rights reserved.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" style={{ color: 'var(--gray-500)', fontSize: '0.7rem', textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ color: 'var(--gray-500)', fontSize: '0.7rem', textDecoration: 'none' }}>Terms</a>
            <a href="#" style={{ color: 'var(--gray-500)', fontSize: '0.7rem', textDecoration: 'none' }}>Cookies</a>
          </div>
        </div>

        {/* Made with love */}
        <div style={{ textAlign: 'center', marginTop: '0.8rem' }}>
          <p style={{ color: 'var(--gray-400)', fontSize: '0.65rem', margin: 0 }}>
            Made with ❤️ for democracy
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;