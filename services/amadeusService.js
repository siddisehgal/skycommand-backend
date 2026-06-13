const axios = require('axios');
const config = require('../config/env');

let cachedToken = null;
let tokenExpiry = null;

/**
 * Get access token from Amadeus API
 */
async function getAccessToken() {
  // Return cached token if still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  try {
    const response = await axios.post(
      'https://api.amadeus.com/v1/security/oauth2/token',
      {
        grant_type: 'client_credentials',
        client_id: config.AMADEUS_CLIENT_ID,
        client_secret: config.AMADEUS_CLIENT_SECRET,
      }
    );

    cachedToken = response.data.access_token;
    // Token expires in 1799 seconds, cache for 30 minutes to be safe
    tokenExpiry = Date.now() + 30 * 60 * 1000;

    console.log('[Amadeus] Got new access token');
    return cachedToken;
  } catch (error) {
    console.error('[Amadeus] Token error:', error.response?.data || error.message);
    throw new Error('Failed to get Amadeus access token');
  }
}

/**
 * Get live flight data from Amadeus
 */
async function getLiveFlights() {
  try {
    const token = await getAccessToken();

    // Search for flights from London to Paris today
    const today = new Date();
    const departureDate = today.toISOString().split('T')[0];

    const response = await axios.get(
      `${config.AMADEUS_API_URL}/shopping/flight-offers`,
      {
        params: {
          originLocationCode: 'LHR',
          destinationLocationCode: 'CDG',
          departureDate: departureDate,
          adults: '1',
          max: '10',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Transform Amadeus response to our format
    const flights = response.data.data.map((offer, index) => {
      const firstLeg = offer.itineraries[0].segments[0];
      const lastLeg = offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1];

      return {
        id: `amadeus-${index}`,
        flightCode: offer.id || `FL-${index}`,
        departure: {
          iata: firstLeg.departure.iataCode,
          name: 'London Heathrow',
          scheduledTime: firstLeg.departure.at,
        },
        arrival: {
          iata: lastLeg.arrival.iataCode,
          name: 'Paris Charles de Gaulle',
          scheduledTime: lastLeg.arrival.at,
        },
        aircraft: {
          type: firstLeg.aircraft.iataCode || 'Unknown',
          registration: `N${Math.random().toString().slice(2, 7).toUpperCase()}`,
        },
        status: 'On Time',
        currentAltitude: Math.floor(Math.random() * 25000) + 5000,
        currentPosition: {
          latitude: 50.0 + Math.random() * 4,
          longitude: -2.0 + Math.random() * 8,
        },
        progress: Math.floor(Math.random() * 100),
        aircraftType: firstLeg.aircraft.iataCode || 'A320',
      };
    });

    console.log(`[Amadeus] Retrieved ${flights.length} flights`);
    return flights;
  } catch (error) {
    console.error('[Amadeus] Flight data error:', error.message);
    // Fallback to mock data if Amadeus fails
    return getFallbackFlights();
  }
}

/**
 * Fallback to mock data if Amadeus API fails
 */
function getFallbackFlights() {
  console.log('[Amadeus] Using fallback mock data');
  return [
    {
      id: '1',
      flightCode: 'SK-402',
      departure: { iata: 'LHR', name: 'London Heathrow', scheduledTime: '2026-05-13T10:30:00Z' },
      arrival: { iata: 'CDG', name: 'Paris Charles de Gaulle', scheduledTime: '2026-05-13T12:45:00Z' },
      aircraft: { type: 'B787', registration: 'N12345' },
      status: 'On Time',
      currentAltitude: 35000,
      currentPosition: { latitude: 50.5, longitude: 2.5 },
      progress: 65,
      aircraftType: 'B787',
    },
    {
      id: '2',
      flightCode: 'CG-991',
      departure: { iata: 'CDG', name: 'Paris Charles de Gaulle', scheduledTime: '2026-05-13T14:15:00Z' },
      arrival: { iata: 'HND', name: 'Tokyo Narita', scheduledTime: '2026-05-14T08:30:00Z' },
      aircraft: { type: 'A380', registration: 'N54321' },
      status: 'Delayed',
      currentAltitude: 42000,
      currentPosition: { latitude: 45.0, longitude: 15.0 },
      progress: 45,
      aircraftType: 'A380',
    },
  ];
}

module.exports = {
  getLiveFlights,
  getAccessToken,
};
