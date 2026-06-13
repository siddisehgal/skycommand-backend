const mockFlights = [
  {
    id: 'flight_123',
    flightCode: 'SK-402',
    airline: 'SkyCommand Airlines',
    departure: {
      iata: 'LHR',
      name: 'London Heathrow',
      country: 'UK',
      scheduledTime: '2026-05-13T08:00:00Z'
    },
    arrival: {
      iata: 'JFK',
      name: 'John F. Kennedy',
      country: 'USA',
      scheduledTime: '2026-05-13T16:30:00Z'
    },
    aircraft: {
      type: 'B787',
      registration: 'G-TUID',
      manufacturer: 'Boeing'
    },
    status: 'IN-FLIGHT',
    currentAltitude: 34000,
    currentPosition: {
      latitude: 51.5074,
      longitude: -0.1278,
      altitude: 34000,
      speed: 450
    },
    progress: 65,
    aircraftType: 'COMMERCIAL',
    departureTime: '2026-05-13T08:00:00Z',
    estimatedArrival: '2026-05-13T16:30:00Z',
    lastUpdated: '2026-05-13T13:45:00Z',
    remainingTime: '2h 45m',
    sectorId: 'SECTOR_01'
  },
  {
    id: 'flight_456',
    flightCode: 'CG-991',
    airline: 'Cargo Global',
    departure: {
      iata: 'CDG',
      name: 'Paris Charles de Gaulle',
      country: 'France',
      scheduledTime: '2026-05-13T09:15:00Z'
    },
    arrival: {
      iata: 'DXB',
      name: 'Dubai International',
      country: 'UAE',
      scheduledTime: '2026-05-13T18:20:00Z'
    },
    aircraft: {
      type: 'A330F',
      registration: 'F-CARGO',
      manufacturer: 'Airbus'
    },
    status: 'DELAYED',
    currentAltitude: 28000,
    currentPosition: {
      latitude: 45.764,
      longitude: 3.128,
      altitude: 28000,
      speed: 410
    },
    progress: 41,
    aircraftType: 'CARGO',
    departureTime: '2026-05-13T09:15:00Z',
    estimatedArrival: '2026-05-13T18:20:00Z',
    lastUpdated: '2026-05-13T13:40:00Z',
    remainingTime: '4h 12m',
    sectorId: 'SECTOR_02'
  },
  {
    id: 'flight_789',
    flightCode: 'QA-117',
    airline: 'Q Aero',
    departure: {
      iata: 'HND',
      name: 'Tokyo Haneda',
      country: 'Japan',
      scheduledTime: '2026-05-13T05:30:00Z'
    },
    arrival: {
      iata: 'SYD',
      name: 'Sydney Kingsford Smith',
      country: 'Australia',
      scheduledTime: '2026-05-13T15:45:00Z'
    },
    aircraft: {
      type: 'A350',
      registration: 'JA-QA1',
      manufacturer: 'Airbus'
    },
    status: 'PENDING',
    currentAltitude: 0,
    currentPosition: {
      latitude: 35.5494,
      longitude: 139.7798,
      altitude: 0,
      speed: 0
    },
    progress: 0,
    aircraftType: 'COMMERCIAL',
    departureTime: '2026-05-13T05:30:00Z',
    estimatedArrival: '2026-05-13T15:45:00Z',
    lastUpdated: '2026-05-13T13:30:00Z',
    remainingTime: '10h 15m',
    sectorId: 'SECTOR_03'
  },
  {
    id: 'flight_012',
    flightCode: 'SK-518',
    airline: 'SkyCommand Airlines',
    departure: {
      iata: 'ATL',
      name: 'Atlanta Hartsfield-Jackson',
      country: 'USA',
      scheduledTime: '2026-05-13T07:20:00Z'
    },
    arrival: {
      iata: 'LAX',
      name: 'Los Angeles International',
      country: 'USA',
      scheduledTime: '2026-05-13T11:10:00Z'
    },
    aircraft: {
      type: 'B737',
      registration: 'N518SC',
      manufacturer: 'Boeing'
    },
    status: 'ACTIVE',
    currentAltitude: 31000,
    currentPosition: {
      latitude: 38.5,
      longitude: -97.0,
      altitude: 31000,
      speed: 465
    },
    progress: 58,
    aircraftType: 'COMMERCIAL',
    departureTime: '2026-05-13T07:20:00Z',
    estimatedArrival: '2026-05-13T11:10:00Z',
    lastUpdated: '2026-05-13T13:42:00Z',
    remainingTime: '1h 42m',
    sectorId: 'SECTOR_01'
  }
];

module.exports = { mockFlights };
