const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

const { validateEnv } = require('./config/env');
const { connectDatabase } = require('./config/database');
const { registerFlightSockets } = require('./sockets/flightUpdates');
const flightsRouter = require('./routes/flights');
const analyticsRouter = require('./routes/analytics');
const sectorsRouter = require('./routes/sectors');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

dotenv.config();
validateEnv();

function isAllowedOrigin(origin) {
  if (!origin || origin === 'null') {
    return true;
  }

  if (origin === process.env.FRONTEND_URL) {
    return true;
  }

  return origin.startsWith('file://');
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, isAllowedOrigin(origin)),
    credentials: false
  }
});

app.use(cors({ origin: (origin, callback) => callback(null, isAllowedOrigin(origin)), credentials: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'stitch_global_air_traffic_dashboard')));

app.get('/', (req, res) => {
  res.redirect('/skycommand_landing_page/code.html');
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/flights', flightsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/sectors', sectorsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

registerFlightSockets(io);

const port = Number(process.env.PORT) || 5000;

async function start() {
  await connectDatabase();

  server.listen(port, () => {
    console.log(`SKYCOMMAND backend running on http://localhost:${port}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error('Failed to start server:', error);
    process.exitCode = 1;
  });
}

module.exports = { app, server };
