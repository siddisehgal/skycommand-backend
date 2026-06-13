const express = require('express');
const {
  getLiveFlights,
  getFlightByCode,
  searchFlights
} = require('../services/flightService');

const router = express.Router();

router.get('/live', async (req, res) => {
  try {
    const data = await getLiveFlights();

    res.json({
      success: true,
      data,
      total: data.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Flights Route] Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch flights',
      error: error.message
    });
  }
});

router.get('/search', async (req, res) => {
  try {
    const result = await searchFlights(req.query);

    res.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Flights Route] Search error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to search flights',
      error: error.message
    });
  }
});

router.get('/:flightCode', async (req, res) => {
  try {
    const flight = await getFlightByCode(req.params.flightCode);

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    res.json({
      success: true,
      data: flight,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Flights Route] Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch flight',
      error: error.message
    });
  }
});

module.exports = router;
