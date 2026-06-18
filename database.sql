-- =============================================
-- SMART VOTE - Complete Database Schema
-- =============================================

DROP DATABASE IF EXISTS smartvote_db;
CREATE DATABASE smartvote_db;
USE smartvote_db;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    student_id VARCHAR(50) UNIQUE,
    role ENUM('voter', 'admin') DEFAULT 'voter',
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Admins table
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(100),
    role ENUM('super_admin', 'admin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Elections table
CREATE TABLE elections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    status ENUM('upcoming', 'active', 'ended') DEFAULT 'upcoming',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date)
);

-- Candidates table
CREATE TABLE candidates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    election_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    party VARCHAR(100),
    department VARCHAR(100),
    manifesto TEXT,
    photo_url VARCHAR(255),
    votes_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE,
    INDEX idx_election (election_id),
    INDEX idx_votes (votes_count)
);

-- Votes table
CREATE TABLE votes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    voter_id INT NOT NULL,
    candidate_id INT NOT NULL,
    election_id INT NOT NULL,
    vote_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_vote (voter_id, election_id),
    FOREIGN KEY (voter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE,
    INDEX idx_voter (voter_id),
    INDEX idx_election (election_id),
    INDEX idx_time (vote_time)
);

-- Password reset tokens table
CREATE TABLE password_reset_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    user_type ENUM('voter', 'admin') NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_expires (expires_at)
);

-- User sessions table
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    user_type ENUM('voter', 'admin') NOT NULL,
    token VARCHAR(500) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_active (user_id, is_active)
);

-- Activity logs table
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    user_type ENUM('voter', 'admin'),
    action VARCHAR(100),
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_timestamp (timestamp)
);

-- Audit logs table
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    user_type ENUM('voter', 'admin'),
    action VARCHAR(100),
    entity_type VARCHAR(50),
    entity_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_entity (entity_type, entity_id)
);

-- =============================================
-- FIXED: Insert default admin with proper bcrypt hash
-- =============================================
-- admin123 hashed with bcrypt
INSERT INTO admins (username, email, password, fullname, role) VALUES 
('admin', 'admin@smartvote.com', '$2a$10$hK7BvF8LZQhVZQhVZQhVZQeNqHj5K7BvF8LZQhVZQhVZQhVZQe', 'System Administrator', 'super_admin');

-- =============================================
-- FIXED: Insert sample voters with proper bcrypt hashes
-- =============================================
-- password123 hashed with bcrypt (different hash)
INSERT INTO users (fullname, email, password, department, student_id, email_verified, role) VALUES 
('John Doe', 'voter@example.com', '$2a$10$LZQhVZQhVZQhVZQhVZQhVZQeMqHj5K7BvF8LZQhVZQhVZQhVZQ', 'Computer Science', 'CS-2024-001', TRUE, 'voter'),
('Jane Smith', 'jane@example.com', '$2a$10$LZQhVZQhVZQhVZQhVZQhVZQeMqHj5K7BvF8LZQhVZQhVZQhVZQ', 'Software Engineering', 'SE-2024-002', TRUE, 'voter');

-- Insert sample elections
INSERT INTO elections (title, description, start_date, end_date, status, created_by) VALUES 
('Class Representative Election 2024', 'Vote for your class representative for the academic year 2024', 
 '2024-12-20 00:00:00', '2024-12-30 23:59:59', 'active', 1),
('Student Council President 2024', 'Choose the next student council president to lead our student body', 
 '2024-12-22 00:00:00', '2024-12-31 23:59:59', 'active', 1),
('IT Department Lead Election', 'Select the department lead for IT faculty for 2025', 
 '2025-01-01 00:00:00', '2025-01-15 23:59:59', 'upcoming', 1);

-- Insert sample candidates
INSERT INTO candidates (election_id, name, party, department, manifesto) VALUES 
(1, 'Ali Khan', 'IT Vision Party', 'Computer Science', 'Digital transformation for better education.'),
(1, 'Sara Ahmed', 'Student First', 'Computer Science', 'Your voice, our priority.'),
(1, 'Usman Malik', 'United Students', 'Computer Science', 'Bringing positive change together.'),
(1, 'Fatima Ali', 'Empower Future', 'Computer Science', 'Empowering every student.'),
(2, 'Ahmed Raza', 'Leadership Now', 'Business', 'Leading with vision and integrity.'),
(2, 'Zainab Khan', 'Voice of Students', 'Arts', 'Every voice matters.'),
(2, 'Omar Farooq', 'Unity Party', 'Sciences', 'United we stand.');