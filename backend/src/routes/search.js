const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');

// Search offender registry
router.get('/', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required.' });
    }

    const sanitizedQuery = query.trim();

    // Query Supabase for matching phone number, UPI ID, or bank account
    const { data: offenders, error } = await supabase
      .from('ccts_cyber_offenders')
      .select('*')
      .or(`phone_number.eq.${sanitizedQuery},upi_id.eq.${sanitizedQuery},bank_account.eq.${sanitizedQuery}`);

    if (error) throw error;

    if (offenders && offenders.length > 0) {
      // Return matching offender(s)
      return res.status(200).json({
        found: true,
        offenders: offenders.map(off => ({
          id: off.id,
          fraud_type: off.fraud_type,
          complaint_count: off.complaint_count,
          risk_level: off.risk_level,
          district: off.district,
          status: off.status,
          warning_banner: `⚠️ Alert: Reported in ${off.complaint_count} cyber fraud complaints across Uttar Pradesh.`
        }))
      });
    }

    // No record found
    res.status(200).json({
      found: false,
      message: 'No reported cyber crime registry matches this query. Always exercise caution during transactions.'
    });
  } catch (err) {
    console.error('Error during Truecaller search:', err.message);
    res.status(500).json({ error: err.message || 'Server error during search.' });
  }
});

module.exports = router;
