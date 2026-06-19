const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { testConnection } = require('./config/database');

dotenv.config();

const app = express();

app.use(cors({
    origin: '*',  // Allows ALL origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const authRoutes = require('./routes/auth');
const voteRoutes = require('./routes/votes');
const resultRoutes = require('./routes/results');
const electionRoutes = require('./routes/elections');
const candidateRoutes = require('./routes/candidates');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    console.log('🔌 Testing database connection...');
    try {
        const dbConnected = await testConnection();
        if (!dbConnected) {
            console.log('⚠️ Database connection failed, but server will continue');
        }
    } catch (error) {
        console.log('⚠️ Database error:', error.message);
    }
    
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
};

startServer();