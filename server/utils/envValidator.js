const logger = require('./logger');

const requiredEnvVars = [
    'PORT',
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'EMAIL_USER',
    'EMAIL_PASS'
];

const optionalEnvVars = [
    'NODE_ENV',
    'FRONTEND_URL',
    'UPLOAD_DIR',
    'MAX_FILE_SIZE',
    'LOG_LEVEL',
    'DB_PORT'
];

const validateEnv = () => {
    const missing = [];
    const invalid = [];

    requiredEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    });

    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
        invalid.push('JWT_SECRET must be at least 32 characters');
    }

    if (process.env.JWT_REFRESH_SECRET && process.env.JWT_REFRESH_SECRET.length < 32) {
        invalid.push('JWT_REFRESH_SECRET must be at least 32 characters');
    }

    if (process.env.PORT && isNaN(parseInt(process.env.PORT))) {
        invalid.push('PORT must be a number');
    }

    if (process.env.EMAIL_USER && !process.env.EMAIL_USER.includes('@')) {
        invalid.push('EMAIL_USER must be a valid email address');
    }

    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:');
        missing.forEach(varName => console.error(`   - ${varName}`));
    }

    if (invalid.length > 0) {
        console.error('❌ Invalid environment variables:');
        invalid.forEach(msg => console.error(`   - ${msg}`));
    }

    if (missing.length === 0 && invalid.length === 0) {
        console.log('✅ All environment variables are valid');
        const present = [];
        optionalEnvVars.forEach(varName => {
            if (process.env[varName]) {
                present.push(varName);
            }
        });
        if (present.length > 0) {
            console.log(`📋 Optional variables set: ${present.join(', ')}`);
        }
        return true;
    }

    console.error('\n💡 Please fix these issues and restart the server');
    process.exit(1);
};

module.exports = validateEnv;