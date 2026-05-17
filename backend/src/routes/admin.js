const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { requirePoliceOrAdmin } = require('../middleware/auth');

// Apply police/admin check to all routes in this file
router.use(requirePoliceOrAdmin);

// 1. GET all complaints
router.get('/complaints', async (req, res) => {
  try {
    const { data: complaints, error } = await supabase
      .from('ccts_cyber_complaints')
      .select('*, ccts_users(name, email)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(complaints);
  } catch (err) {
    console.error('Error fetching admin complaints:', err.message);
    res.status(500).json({ error: 'Failed to fetch complaints.' });
  }
});

// 2. UPDATE complaint status
router.put('/complaints/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }

    const { data: updated, error } = await supabase
      .from('ccts_cyber_complaints')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json({ message: 'Complaint status updated!', complaint: updated });
  } catch (err) {
    console.error('Error updating complaint status:', err.message);
    res.status(500).json({ error: 'Failed to update complaint status.' });
  }
});

// 3. GET all fake news reports
router.get('/fake-news', async (req, res) => {
  try {
    const { data: reports, error } = await supabase
      .from('ccts_fake_news_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(reports);
  } catch (err) {
    console.error('Error fetching admin fake news:', err.message);
    res.status(500).json({ error: 'Failed to fetch fake news reports.' });
  }
});

// 4. VERIFY fake news status
router.put('/fake-news/:id', async (req, res) => {
  try {
    const { verification_status } = req.body;
    const { id } = req.params;

    if (!verification_status) {
      return res.status(400).json({ error: 'Verification status is required.' });
    }

    const { data: updated, error } = await supabase
      .from('ccts_fake_news_reports')
      .update({ verification_status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json({ message: 'Fake news status updated!', report: updated });
  } catch (err) {
    console.error('Error verifying fake news:', err.message);
    res.status(500).json({ error: 'Failed to verify fake news report.' });
  }
});

// 5. ADD new offender to Cyber Registry (Truecaller)
router.post('/offenders', async (req, res) => {
  try {
    const { phone_number, upi_id, bank_account, fraud_type, risk_level, district } = req.body;

    if (!fraud_type) {
      return res.status(400).json({ error: 'Fraud type is required.' });
    }

    if (!phone_number && !upi_id && !bank_account) {
      return res.status(400).json({ error: 'At least one identifier (Phone, UPI, or Bank Account) is required.' });
    }

    const { data: offender, error } = await supabase
      .from('ccts_cyber_offenders')
      .insert([
        {
          phone_number: phone_number || null,
          upi_id: upi_id || null,
          bank_account: bank_account || null,
          fraud_type,
          risk_level: risk_level || 'medium',
          district: district || 'Lucknow',
          status: 'verified',
          complaint_count: 1
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Offender registered successfully!', offender });
  } catch (err) {
    console.error('Error adding offender:', err.message);
    res.status(500).json({ error: 'Failed to add offender to registry.' });
  }
});

// 6. CREATE live safety alert
router.post('/alerts', async (req, res) => {
  try {
    const { title, message, alert_type, district } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required.' });
    }

    const { data: alert, error } = await supabase
      .from('ccts_alerts')
      .insert([
        {
          title,
          message,
          alert_type: alert_type || 'scam',
          district: district || 'All Districts'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Alert published successfully!', alert });
  } catch (err) {
    console.error('Error publishing alert:', err.message);
    res.status(500).json({ error: 'Failed to publish alert.' });
  }
});

// 7. GET dashboard analytical aggregates
router.get('/analytics', async (req, res) => {
  try {
    // Get total complaints
    const { count: totalComplaints, error: c1 } = await supabase
      .from('ccts_cyber_complaints')
      .select('*', { count: 'exact', head: true });

    if (c1) throw c1;

    // Get resolved complaints
    const { count: resolvedComplaints, error: c2 } = await supabase
      .from('ccts_cyber_complaints')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'RESOLVED');

    if (c2) throw c2;

    // Get fake news counts
    const { count: totalFakeNews, error: c3 } = await supabase
      .from('ccts_fake_news_reports')
      .select('*', { count: 'exact', head: true });

    if (c3) throw c3;

    // Get offenders count
    const { count: totalOffenders, error: c4 } = await supabase
      .from('ccts_cyber_offenders')
      .select('*', { count: 'exact', head: true });

    if (c4) throw c4;

    // Fetch district aggregated reports (mock dynamic or pull top 5 districts)
    const { data: complaintsList, error: c5 } = await supabase
      .from('ccts_cyber_complaints')
      .select('location');

    if (c5) throw c5;

    const districtCounts = {};
    complaintsList.forEach(item => {
      const loc = item.location || 'Unknown';
      districtCounts[loc] = (districtCounts[loc] || 0) + 1;
    });

    const districtChartData = Object.keys(districtCounts).map(d => ({
      district: d,
      complaints: districtCounts[d]
    })).sort((a,b) => b.complaints - a.complaints).slice(0, 5);

    res.status(200).json({
      metrics: {
        totalComplaints: totalComplaints || 0,
        resolvedComplaints: resolvedComplaints || 0,
        totalFakeNews: totalFakeNews || 0,
        totalOffenders: totalOffenders || 0,
        resolutionRate: totalComplaints ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0
      },
      districtAnalytics: districtChartData
    });
  } catch (err) {
    console.error('Error fetching analytics:', err.message);
    res.status(500).json({ error: 'Failed to aggregate analytics data.' });
  }
});

module.exports = router;
