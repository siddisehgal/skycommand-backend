const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

function splitValues(value) {
  return (value || '')
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);
}

function getMROHubs() {
  return new Promise((resolve, reject) => {
    const results = [];
    const csvPath = path.join(__dirname, '../data/mro_hubs.csv');
    const stream = fs.createReadStream(csvPath);

    stream.on('error', reject);

    stream
      .pipe(csv())
      .on('data', (data) => {
        results.push({
          ...data,
          id: Number(data.id),
          latitude: Number(data.latitude),
          longitude: Number(data.longitude),
          capabilities: splitValues(data.capabilities),
          aircraft_supported: splitValues(data.aircraft_supported),
          hangars: Number(data.hangars),
          annual_capacity: Number(data.annual_capacity),
        });
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

module.exports = { getMROHubs };