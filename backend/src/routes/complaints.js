const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { requireAuth } = require('../middleware/auth');

// 1. FILE a complaint
router.post('/', requireAuth, async (req, res) => {
  try {
    const { incident_type, description, evidence_url, location } = req.body;
    const userId = req.session.user.id;

    if (!incident_type || !description || !location) {
      return res.status(400).json({ error: 'Incident type, description, and location are required.' });
    }

    // Generate unique 10-digit tracking ID: CCTS-XXXXXX (6 random characters)
    const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
    const trackingId = `CCTS-${randomChars}`;

    // Insert complaint
    const { data: complaint, error } = await supabase
      .from('ccts_cyber_complaints')
      .insert([
        {
          tracking_id: trackingId,
          user_id: userId,
          incident_type,
          description,
          evidence_url: evidence_url || null,
          location,
          status: 'PENDING'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Complaint registered successfully!',
      tracking_id: trackingId,
      complaint
    });
  } catch (err) {
    console.error('Error filing complaint:', err.message);
    res.status(500).json({ error: err.message || 'Server error while filing complaint.' });
  }
});

// 2. GET citizen's own complaints
router.get('/my', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;

    const { data: complaints, error } = await supabase
      .from('ccts_cyber_complaints')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(complaints);
  } catch (err) {
    console.error('Error fetching complaints:', err.message);
    res.status(500).json({ error: err.message || 'Server error fetching complaints.' });
  }
});

// 3. TRACK a complaint by tracking_id
router.get('/track/:trackingId', async (req, res) => {
  try {
    const { trackingId } = req.params;

    if (!trackingId) {
      return res.status(400).json({ error: 'Tracking ID is required.' });
    }

    const { data: complaint, error } = await supabase
      .from('ccts_cyber_complaints')
      .select('*, ccts_users(name, email)')
      .eq('tracking_id', trackingId.trim().toUpperCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Complaint not found. Please verify the tracking ID.' });
      }
      throw error;
    }

    res.status(200).json(complaint);
  } catch (err) {
    console.error('Error tracking complaint:', err.message);
    res.status(500).json({ error: err.message || 'Server error tracking complaint.' });
  }
});

module.exports = router;
