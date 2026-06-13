const express = require('express');
const { getAnalyticsStats } = require('../services/flightService');

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const data = await getAnalyticsStats();
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Analytics Route] Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
});

module.exports = router;
