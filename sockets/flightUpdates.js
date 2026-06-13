function registerFlightSockets(io) {
  io.on('connection', (socket) => {
    socket.on('join-flight', (flightCode) => {
      socket.join(`flight:${flightCode}`);
    });

    socket.on('leave-flight', (flightCode) => {
      socket.leave(`flight:${flightCode}`);
    });

    socket.on('disconnect', () => {
      // No-op for now; hook for future cleanup.
    });
  });
}

module.exports = { registerFlightSockets };
