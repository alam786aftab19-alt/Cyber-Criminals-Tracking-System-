const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { supabase } = require('../config/supabase');

// Helper to hash passwords using built-in crypto SHA-256
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// 1. REGISTER citizen
router.post('/register', async (req, res) => {
  try {
    const { email, name, district, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Email, Name, and Password are required.' });
    }

    // Check if user already exists in ccts_users
    const { data: existingUser, error: checkError } = await supabase
      .from('ccts_users')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is code for no rows found
      throw checkError;
    }

    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // Insert new user as 'citizen'
    const { data: newUser, error: insertError } = await supabase
      .from('ccts_users')
      .insert([
        {
          email: email.trim().toLowerCase(),
          name: name.trim(),
          password: hashPassword(password),
          role: 'citizen',
          district: district || 'Unknown'
        }
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    res.status(201).json({ message: 'Registration successful!', user: newUser });
  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(500).json({ error: err.message || 'Server error during registration.' });
  }
});

// 2. LOGIN (Citizen or Police/Admin)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and Password are required.' });
    }

    // Query user details from ccts_users
    const { data: user, error } = await supabase
      .from('ccts_users')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'No account found with this email. Please sign up first!' });
      }
      throw error;
    }

    // Secure Verification: Check password matches (handle fallback gracefully if column wasn't added yet)
    if (user.hasOwnProperty('password') && user.password) {
      if (user.password !== hashPassword(password)) {
        return res.status(401).json({ error: 'Incorrect secure password. Please try again!' });
      }
    }

    // Create session
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      district: user.district
    };

    // Save session explicitly to avoid async race conditions
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ error: 'Failed to create session' });
      }
      res.status(200).json({ message: 'Login successful!', user: req.session.user });
    });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ error: err.message || 'Server error during login.' });
  }
});

// 3. LOGOUT
router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Failed to log out.' });
      }
      res.clearCookie('connect.sid'); // Clear default express-session cookie
      res.status(200).json({ message: 'Logged out successfully.' });
    });
  } else {
    res.status(200).json({ message: 'Already logged out.' });
  }
});

// 4. CHECK ACTIVE SESSION
router.get('/session', (req, res) => {
  if (req.session && req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ error: 'No active session.' });
  }
});

module.exports = router;
