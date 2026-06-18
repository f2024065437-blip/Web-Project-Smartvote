const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendVerificationEmail = async (email, name, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    
    const mailOptions = {
        from: `"SmartVote" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Verify Your Email - SmartVote',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #6366f1;">Welcome to SmartVote!</h1>
                <p>Hello ${name},</p>
                <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" 
                       style="display: inline-block; padding: 12px 24px; background-color: #6366f1; 
                              color: white; text-decoration: none; border-radius: 8px;">
                        Verify Email Address
                    </a>
                </div>
                <p>Or copy this link: <a href="${verificationUrl}">${verificationUrl}</a></p>
                <p>This link will expire in 24 hours.</p>
                <hr>
                <p style="color: #666; font-size: 12px;">If you didn't create an account, please ignore this email.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending error:', error);
        return false;
    }
};

const sendPasswordResetEmail = async (email, name, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    
    const mailOptions = {
        from: `"SmartVote" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Reset Your Password - SmartVote',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #6366f1;">Password Reset Request</h1>
                <p>Hello ${name},</p>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="display: inline-block; padding: 12px 24px; background-color: #6366f1; 
                              color: white; text-decoration: none; border-radius: 8px;">
                        Reset Password
                    </a>
                </div>
                <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending error:', error);
        return false;
    }
};

const sendVoteConfirmation = async (email, name, electionTitle, candidateName) => {
    const mailOptions = {
        from: `"SmartVote" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Vote Confirmation - SmartVote',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #10b981;">Vote Confirmed!</h1>
                <p>Hello ${name},</p>
                <p>Your vote has been successfully recorded in <strong>${electionTitle}</strong>.</p>
                <p>You voted for: <strong style="color: #6366f1;">${candidateName}</strong></p>
                <p>Thank you for participating in the democratic process!</p>
                <hr>
                <p style="color: #666; font-size: 12px;">This is an automated message. Please do not reply.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending error:', error);
        return false;
    }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendVoteConfirmation };