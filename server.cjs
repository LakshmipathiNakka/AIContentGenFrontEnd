require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs').promises;

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-username:your-password@your-cluster.mongodb.net/content-generator?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('MongoDB connected successfully');
  // Start the server only after MongoDB connection is established
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Press Ctrl+C to stop the server');
    
    // Open browser automatically
    const { exec } = require('child_process');
    const start = process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open';
    exec(`${start} http://localhost:${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Please try a different port.`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Settings Schema
const settingsSchema = new mongoose.Schema({
  azureOpenAIEndpoint: String,
  azureApiKey: String,
  googleSheetId: String,
  googleKeyfilePath: String,
  theme: { type: String, default: 'light' },
  email: String,
  name: String,
  bio: String,
  twoFactorAuth: { type: Boolean, default: false },
  loginHistory: { type: Array, default: [] },
  emailNotifications: { type: Boolean, default: true },
  pushNotifications: { type: Boolean, default: true },
  promotionalEmails: { type: Boolean, default: false },
  layout: { type: String, default: 'default' },
  compactMode: { type: Boolean, default: false }
});

const Settings = mongoose.model('Settings', settingsSchema);

// Middleware
app.use(cors());
app.use(express.json());

// Disable caching for development
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = new Settings({
        azureOpenAIEndpoint: '',
        azureApiKey: '',
        googleSheetId: '',
        googleKeyfilePath: '',
        theme: 'light',
        email: '',
        name: '',
        bio: '',
        twoFactorAuth: false,
        loginHistory: [],
        emailNotifications: true,
        pushNotifications: true,
        promotionalEmails: false,
        layout: 'default',
        compactMode: false
      });
      await defaultSettings.save();
      return res.json(defaultSettings);
    }
    res.json(settings);
  } catch (error) {
    console.error('Error reading settings:', error);
    res.status(500).json({ error: 'Failed to read settings' });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const newSettings = req.body;
    
    // Validate required fields
    const requiredFields = ['azureOpenAIEndpoint', 'azureApiKey', 'googleSheetId', 'googleKeyfilePath'];
    const missingFields = requiredFields.filter(field => !newSettings[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: missingFields
      });
    }

    // Update or create settings
    const settings = await Settings.findOne();
    if (settings) {
      Object.assign(settings, newSettings);
      await settings.save();
    } else {
      await new Settings(newSettings).save();
    }
    
    res.json({ message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

// Handle all routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
}); 