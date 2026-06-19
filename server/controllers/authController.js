const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { executeQuery, getOne, insertOne, updateRecord } = require('../config/database');

const generateToken = (id, email, role) => {
    return jwt.sign({ id, email, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

const generateRandomToken = () => crypto.randomBytes(32).toString('hex');

const register = async (req, res) => {
    const { fullname, email, password, department, student_id } = req.body;

    console.log('📝 Registration attempt:', { fullname, email, department, student_id });

    // Validate
    if (!fullname || !email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Full name, email and password are required' 
        });
    }

    if (password.length < 6) {
        return res.status(400).json({ 
            success: false, 
            message: 'Password must be at least 6 characters' 
        });
    }

    // Check if user exists
    const existingUser = await getOne('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.success && existingUser.data) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email already registered' 
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateRandomToken();

        const result = await insertOne(
            `INSERT INTO users (fullname, email, password, department, student_id, verification_token, email_verified) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [fullname, email, hashedPassword, department || null, student_id || null, verificationToken, true]
        );

        if (result.success) {
            console.log(`✅ User registered: ${email}`);
            res.status(201).json({
                success: true,
                message: 'Registration successful! You can now login.',
                data: { id: result.id }
            });
        } else {
            console.error('❌ Insert failed:', result.error);
            res.status(500).json({ 
                success: false, 
                message: 'Registration failed: ' + result.error 
            });
        }
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Registration failed: ' + error.message 
        });
    }
};

const verifyEmail = async (req, res) => {
    const { token } = req.params;
    
    const user = await getOne('SELECT id FROM users WHERE verification_token = $1 AND email_verified = false', [token]);
    
    if (!user.success || !user.data) {
        return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
    
    await updateRecord('UPDATE users SET email_verified = true, verification_token = NULL WHERE id = $1', [user.data.id]);
    
    res.json({ success: true, message: 'Email verified successfully!' });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    
    console.log('🔑 Login attempt for:', email);
    
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email and password are required' 
        });
    }
    
    try {
        // ✅ FIRST: Check in users table
        console.log('🔍 Checking users table first...');
        let userResult = await getOne('SELECT * FROM users WHERE email = $1', [email]);
        let role = 'voter';
        let isAdmin = false;
        
        // ✅ If found in users table
        if (userResult.success && userResult.data) {
            console.log('✅ User found in users table');
            console.log('👤 User role from DB:', userResult.data.role);
            role = userResult.data.role || 'voter';
        } else {
            // ✅ SECOND: If not found, check in admins table
            console.log('🔍 User not in users table, checking admins table...');
            const adminResult = await getOne('SELECT * FROM admins WHERE email = $1', [email]);
            if (adminResult.success && adminResult.data) {
                userResult = adminResult;
                role = 'admin';
                isAdmin = true;
                console.log('✅ Admin found in admins table');
            }
        }
        
        if (!userResult.success || !userResult.data) {
            console.log('❌ User not found in any table');
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
        
        const user = userResult.data;
        console.log('✅ User found:', user.email);
        console.log('✅ Role:', role);
        
        // Compare passwords
        const isValid = await bcrypt.compare(password, user.password);
        console.log('✅ Password valid:', isValid);
        
        if (!isValid) {
            console.log('❌ Password invalid');
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
        
        // Get the role
        const finalRole = isAdmin ? 'admin' : (user.role || 'voter');
        console.log('✅ Returning role:', finalRole);
        
        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: finalRole },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
        
        console.log('✅ Login successful for:', email);
        
        res.json({
            success: true,
            data: {
                id: user.id,
                fullname: user.fullname || user.username || 'User',
                email: user.email,
                role: finalRole,
                token: token
            }
        });
        
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Login failed: ' + error.message 
        });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await getOne('SELECT * FROM users WHERE email = $1', [email]);
    
    if (user.success && user.data) {
        const resetToken = generateRandomToken();
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1);
        
        await insertOne(
            `INSERT INTO password_reset_tokens (user_id, user_type, token, expires_at) VALUES ($1, $2, $3, $4)`,
            [user.data.id, 'voter', resetToken, expiry]
        );
        
        console.log(`📧 Password reset token for ${email}: ${resetToken}`);
    }
    
    res.json({ success: true, message: 'If your email is registered, you will receive a reset link' });
};

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    
    const resetToken = await getOne(
        `SELECT * FROM password_reset_tokens WHERE token = $1 AND used = false AND expires_at > NOW()`,
        [token]
    );
    
    if (!resetToken.success || !resetToken.data) {
        return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateRecord('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, resetToken.data.user_id]);
    await updateRecord('UPDATE password_reset_tokens SET used = true WHERE id = $1', [resetToken.data.id]);
    
    res.json({ success: true, message: 'Password reset successful!' });
};

const logout = async (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
};

const getMe = async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;
    
    let user;
    if (role === 'admin') {
        user = await getOne('SELECT id, username, email, fullname, role FROM admins WHERE id = $1', [userId]);
    } else {
        user = await getOne('SELECT id, fullname, email, department, student_id, role, email_verified FROM users WHERE id = $1', [userId]);
    }
    
    res.json({ success: true, data: user.data });
};

// Create admin if missing
const createAdminIfMissing = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const existing = await getOne('SELECT * FROM admins WHERE email = $1', ['admin@smartvote.com']);
        
        if (existing.success && existing.data) {
            await updateRecord('UPDATE admins SET password = $1 WHERE email = $2', [hashedPassword, 'admin@smartvote.com']);
            return res.json({ success: true, message: 'Admin password updated!' });
        }
        
        const result = await insertOne(
            'INSERT INTO admins (username, email, password, fullname, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            ['admin', 'admin@smartvote.com', hashedPassword, 'System Administrator', 'super_admin']
        );
        
        if (result.success) {
            res.json({ success: true, message: 'Admin created successfully! Login with admin@smartvote.com / admin123' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to create admin' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { 
    register, 
    verifyEmail, 
    login, 
    forgotPassword, 
    resetPassword, 
    logout, 
    getMe,
    createAdminIfMissing 
};