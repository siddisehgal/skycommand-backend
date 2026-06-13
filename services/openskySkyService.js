const axios = require('axios');
const config = require('../config/env');

/**
 * Get live flight data from OpenSky Network
 */
async function getLiveFlights() {
  try {
    // OpenSky requires basic auth with username:password in URL
    const auth = `${config.OPENSKY_CLIENT_ID}:${config.OPENSKY_CLIENT_SECRET}`;
    const encodedAuth = Buffer.from(auth).toString('base64');

    // Get all states (flights) - this endpoint requires authentication for unrestricted access
    const response = await axios.get(
      'https://opensky-network.org/api/states/all',
      {
        headers: {
          Authorization: `Basic ${encodedAuth}`,
        },
        params: {
          lamin: 48.0,  // Min latitude (Europe)
          lamax: 52.0,  // Max latitude
          lomin: -2.0,  // Min longitude
          lomax: 5.0,   // Max longitude (covers UK, France, Germany area)
        },
      }
    );

    // Transform OpenSky response to our format
    const flights = response.data.states
      .filter(state => state !== null && state.length > 0)
      .map((state, index) => {
        // OpenSky state format: [icao24, callsign, origin_country, time_position, time_velocity, latitude, longitude, 
        //                        baro_altitude, on_ground, velocity, true_track, vertical_rate, sensors, geo_altitude,
        //                        squawk, spi, position_source]
        
        const [
          icao24,
          callsign,
          originCountry,
          timePosition,
          timeVelocity,
          latitude,
          longitude,
          baroAltitude,
          onGround,
          velocity,
          trueTrack,
          verticalRate,
          sensors,
          geoAltitude,
          squawk,
          spi,
          positionSource
        ] = state;

        return {
          id: `opensky-${icao24}`,
          flightCode: callsign ? callsign.trim() : `FL-${index}`,
          departure: {
            iata: 'LHR',
            name: 'London Heathrow',
            scheduledTime: new Date(timePosition * 1000).toISOString(),
          },
          arrival: {
            iata: 'CDG',
            name: 'Paris Charles de Gaulle',
            scheduledTime: new Date((timePosition + 3600) * 1000).toISOString(),
          },
          aircraft: {
            type: 'A320',
            registration: icao24.toUpperCase(),
          },
          status: onGround ? 'On Ground' : 'On Time',
          currentAltitude: baroAltitude || 0,
          currentPosition: {
            latitude: latitude || 50.0,
            longitude: longitude || 2.0,
          },
          progress: onGround ? 0 : Math.round((velocity || 0) / 2.4),
          aircraftType: 'A320',
          velocity: velocity || 0,
          track: trueTrack || 0,
          verticalRate: verticalRate || 0,
        };
      })
      .slice(0, 20); // Limit to 20 flights for display

    console.log(`[OpenSky] Retrieved ${flights.length} flights`);
    return flights;
  } catch (error) {
    console.error('[OpenSky] Flight data error:', error.message);
    // Fallback to mock data if OpenSky fails
    return getFallbackFlights();
  }
}

/**
 * Fallback to mock data if OpenSky API fails
 */
function getFallbackFlights() {
  console.log('[OpenSky] Using fallback mock data');
  return [
    {
      id: '1',
      flightCode: 'BAW112',
      departure: { iata: 'LHR', name: 'London Heathrow', scheduledTime: '2026-05-13T10:30:00Z' },
      arrival: { iata: 'CDG', name: 'Paris Charles de Gaulle', scheduledTime: '2026-05-13T12:45:00Z' },
      aircraft: { type: 'B787', registration: 'N12345' },
      status: 'On Time',
      currentAltitude: 35000,
      currentPosition: { latitude: 50.5, longitude: 2.5 },
      progress: 65,
      aircraftType: 'B787',
      velocity: 480,
      track: 90,
      verticalRate: 0,
    },
    {
      id: '2',
      flightCode: 'AFR420',
      departure: { iata: 'CDG', name: 'Paris Charles de Gaulle', scheduledTime: '2026-05-13T14:15:00Z' },
      arrival: { iata: 'HND', name: 'Tokyo Narita', scheduledTime: '2026-05-14T08:30:00Z' },
      aircraft: { type: 'A380', registration: 'N54321' },
      status: 'On Time',
      currentAltitude: 42000,
      currentPosition: { latitude: 45.0, longitude: 15.0 },
      progress: 45,
      aircraftType: 'A380',
      velocity: 490,
      track: 120,
      verticalRate: 100,
    },
  ];
}

module.exports = {
  getLiveFlights,
};
