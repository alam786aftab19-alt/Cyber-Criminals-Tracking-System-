const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { requireAuth } = require('../middleware/auth');

// 1. REPORT fake news
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, media_url } = req.body;
    const reporterName = req.session.user.name;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }

    // A. Detect duplicate fake news (search for identical/similar titles)
    const { data: duplicates, error: dupError } = await supabase
      .from('ccts_fake_news_reports')
      .select('*')
      .ilike('title', `%${title.trim()}%`);

    if (dupError) throw dupError;

    let duplicateFound = false;
    let duplicateRecord = null;

    if (duplicates && duplicates.length > 0) {
      duplicateFound = true;
      duplicateRecord = duplicates[0];
    }

    // B. Insert news report
    const { data: newsReport, error: insertError } = await supabase
      .from('ccts_fake_news_reports')
      .insert([
        {
          title: title.trim(),
          description: description.trim(),
          media_url: media_url || null,
          verification_status: duplicateFound ? duplicateRecord.verification_status : 'UNDER REVIEW',
          reported_by: reporterName
        }
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    res.status(201).json({
      message: duplicateFound
        ? `Note: A similar report is already under investigation. Your submission has been linked to current review.`
        : 'Fake news report submitted for verification.',
      duplicateDetected: duplicateFound,
      report: newsReport
    });
  } catch (err) {
    console.error('Error reporting fake news:', err.message);
    res.status(500).json({ error: err.message || 'Server error reporting fake news.' });
  }
});

// 2. GET verified fake news & under review list (citizen catalog)
router.get('/', async (req, res) => {
  try {
    const { data: reports, error } = await supabase
      .from('ccts_fake_news_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(reports);
  } catch (err) {
    console.error('Error fetching fake news:', err.message);
    res.status(500).json({ error: err.message || 'Server error fetching fake news reports.' });
  }
});

module.exports = router;
