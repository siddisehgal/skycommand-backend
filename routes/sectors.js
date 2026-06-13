const express = require('express');
const { getSectorById } = require('../services/flightService');

const router = express.Router();

router.get('/:sectorId', async (req, res) => {
  try {
    const sector = getSectorById(req.params.sectorId);

    res.json({
      success: true,
      data: sector,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Sectors Route] Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sector',
      error: error.message
    });
  }
});

module.exports = router;
