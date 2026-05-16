const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.options('*', cors());
app.use(express.json());

// Routes
const candidateRoutes = require('./routes/candidates');
const matchRoutes = require('./routes/match');
const aiRoutes = require('./routes/ai');

app.use('/api/candidates', candidateRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'TalentMatch AI — Candidate Shortlisting API 🚀',
    liveUrl: 'https://aifsd-ese-1.onrender.com',
    endpoints: {
      addCandidate:    'POST  /api/candidates',
      getCandidates:   'GET   /api/candidates',
      matchCandidates: 'POST  /api/match',
      aiShortlist:     'POST  /api/ai/shortlist',
    },
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Connect DB & Start Server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
