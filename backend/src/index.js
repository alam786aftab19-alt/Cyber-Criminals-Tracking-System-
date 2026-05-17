const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
const complaintsRoutes = require('./routes/complaints');
const fakeNewsRoutes = require('./routes/fakeNews');
const adminRoutes = require('./routes/admin');
const { supabase } = require('./config/supabase');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. CORS Configuration (Allows session cookie sharing with frontend)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Request Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isProduction = process.env.NODE_ENV === 'production';

// Trust proxy for secure cookies behind Render's load balancers
if (isProduction) {
  app.set('trust proxy', 1);
}

// 3. Express Session Setup
app.use(session({
  name: 'ccts_session',
  secret: process.env.SESSION_SECRET || 'up_police_cyber_shield_secret_key_2026_xyz',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction, // Set to true if running behind production HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 Hours
    sameSite: isProduction ? 'none' : 'lax' // 'none' allows cross-domain cookies on Render
  }
}));

// 4. API Endpoint Mappings
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/fake-news', fakeNewsRoutes);
app.use('/api/admin', adminRoutes);

// Public API for Emergency Alert Ticker
app.get('/api/alerts', async (req, res) => {
  try {
    const { data: alerts, error } = await supabase
      .from('ccts_alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    res.status(200).json(alerts);
  } catch (err) {
    console.error('Error fetching public alerts:', err.message);
    res.status(500).json({ error: 'Failed to fetch public safety alerts.' });
  }
});

// Simple Healthcheck
app.get('/', (req, res) => {
  res.status(200).send('<h1>UP Police Cyber Shield API Server is active</h1>');
});

// Start listening
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`🛡️  UP Police Cyber Shield Session Engine active`);
  console.log(`=================================================`);
});
