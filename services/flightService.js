const openskySkyService = require('./openskySkyService');
const { mockFlights } = require('./mockFlights');

async function getLiveFlights() {
  try {
    // Try to get real flights from OpenSky
    return await openskySkyService.getLiveFlights();
  } catch (error) {
    console.log('[FlightService] Error fetching Amadeus data, using mock data:', error.message);
    // Fallback to mock data
    return mockFlights.map((flight) => ({
      id: flight.id,
      flightCode: flight.flightCode,
      departure: flight.departure,
      arrival: flight.arrival,
      currentAltitude: flight.currentAltitude,
      status: flight.status,
      progress: flight.progress,
      aircraftType: flight.aircraftType,
      departureTime: flight.departureTime,
      estimatedArrival: flight.estimatedArrival,
      lastUpdated: flight.lastUpdated,
      currentPosition: flight.currentPosition
    }));
  }
}

async function getFlightByCode(flightCode) {
  const flights = await getLiveFlights();
  return flights.find((flight) => flight.flightCode === flightCode) || null;
}

async function searchFlights(filters = {}) {
  const flights = await getLiveFlights();
  
  const normalized = {
    flightCode: filters.flightCode?.toLowerCase(),
    departure: filters.departure?.toUpperCase(),
    arrival: filters.arrival?.toUpperCase(),
    status: filters.status?.toUpperCase(),
    limit: Number(filters.limit) || 50,
    offset: Number(filters.offset) || 0
  };

  const matches = flights.filter((flight) => {
    if (normalized.flightCode && !flight.flightCode.toLowerCase().includes(normalized.flightCode)) {
      return false;
    }

    if (normalized.departure && flight.departure.iata !== normalized.departure) {
      return false;
    }

    if (normalized.arrival && flight.arrival.iata !== normalized.arrival) {
      return false;
    }

    if (normalized.status && flight.status !== normalized.status) {
      return false;
    }

    return true;
  });

  return {
    total: matches.length,
    limit: normalized.limit,
    offset: normalized.offset,
    data: matches.slice(normalized.offset, normalized.offset + normalized.limit)
  };
}

async function getAnalyticsStats() {
  const flights = await getLiveFlights();
  
  const delayedFlights = flights.filter((flight) => flight.status === 'Delayed').length;
  const averageAltitude = flights.length > 0 
    ? Math.round(flights.reduce((sum, flight) => sum + flight.currentAltitude, 0) / flights.length)
    : 0;

  return {
    totalFlights24h: Math.floor(Math.random() * 50000) + 10000,
    activeFlights: flights.length,
    delayedFlights,
    cancelledFlights: 0,
    onTimePercentage: 94.5,
    averageAltitude,
    networkLatency: '12ms'
  };
}

function getSectorById(sectorId) {
  const flights = mockFlights.filter((flight) => flight.sectorId === sectorId);

  return {
    sectorId,
    sectorName: sectorId === 'SECTOR_01' ? 'Atlantic Corridor' : sectorId === 'SECTOR_02' ? 'European Transit' : 'Pacific Gateway',
    activeFlights: flights.filter((flight) => ['IN-FLIGHT', 'ACTIVE'].includes(flight.status)).length,
    avgDensity: Number((flights.length * 3.2).toFixed(1)),
    flights
  };
}

module.exports = {
  getLiveFlights,
  getFlightByCode,
  searchFlights,
  getAnalyticsStats,
  getSectorById
};
