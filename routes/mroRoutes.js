const express = require('express');
const { getMROHubs } = require('../services/mroService');

const router = express.Router();

function normalize(value) {
  return value.trim().toLowerCase();
}

function distanceKm(lat1, lon1, lat2, lon2) {
  const toRadians = (degrees) => degrees * Math.PI / 180;
  const earthRadius = 6371;

  const latitudeDifference = toRadians(lat2 - lat1);
  const longitudeDifference = toRadians(lon2 - lon1);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(longitudeDifference / 2) ** 2;

  const clamped = Math.min(1, Math.max(0, a));

  return earthRadius * 2 * Math.atan2(
    Math.sqrt(clamped),
    Math.sqrt(1 - clamped)
  );
}

router.get('/', async (req, res) => {
  try {
    const { aircraft, capability, latitude, longitude } = req.query;
    const values = [aircraft, capability, latitude, longitude];

    if (values.some((value) =>
      value !== undefined && typeof value !== 'string'
    )) {
      return res.status(400).json({
        success: false,
        error: 'Query parameters must be single text values',
      });
    }

    const hasLatitude = latitude !== undefined;
    const hasLongitude = longitude !== undefined;

    if (hasLatitude !== hasLongitude) {
      return res.status(400).json({
        success: false,
        error: 'Provide both latitude and longitude',
      });
    }

    let originLatitude;
    let originLongitude;

    if (hasLatitude && hasLongitude) {
      originLatitude = Number(latitude);
      originLongitude = Number(longitude);

      if (
        !latitude.trim() ||
        !longitude.trim() ||
        !Number.isFinite(originLatitude) ||
        !Number.isFinite(originLongitude) ||
        originLatitude < -90 ||
        originLatitude > 90 ||
        originLongitude < -180 ||
        originLongitude > 180
      ) {
        return res.status(400).json({
          success: false,
          error: 'Latitude must be between -90 and 90, and longitude between -180 and 180',
        });
      }
    }

    const aircraftFilter = aircraft ? normalize(aircraft) : '';
    const capabilityFilter = capability ? normalize(capability) : '';

    const hubs = await getMROHubs();

    let matches = hubs.filter((hub) => {
      const matchesAircraft =
        !aircraftFilter ||
        hub.aircraft_supported.some(
          (item) => normalize(item) === aircraftFilter
        );

      const matchesCapability =
        !capabilityFilter ||
        hub.capabilities.some(
          (item) => normalize(item) === capabilityFilter
        );

      return matchesAircraft && matchesCapability;
    });

    if (hasLatitude && hasLongitude) {
      matches = matches
        .filter((hub) =>
          Number.isFinite(hub.latitude) &&
          Number.isFinite(hub.longitude) &&
          Math.abs(hub.latitude) <= 90 &&
          Math.abs(hub.longitude) <= 180
        )
        .map((hub) => ({
          ...hub,
          distance_km: distanceKm(
            originLatitude,
            originLongitude,
            hub.latitude,
            hub.longitude
          ),
        }))
        .sort((a, b) =>
          a.distance_km - b.distance_km || a.id - b.id
        );
    }

    res.json(matches);
  } catch (err) {
    console.error('Error loading MRO hubs:', err);

    res.status(500).json({
      success: false,
      error: 'Unable to load MRO hubs',
    });
  }
});

module.exports = router;