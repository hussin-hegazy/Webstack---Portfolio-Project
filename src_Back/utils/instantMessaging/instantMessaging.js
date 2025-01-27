// utils/instantMessaging/instantMessaging.js
const socketHandler = require('./socketHandler');

const sendInstantMessage = (userId, message) => {
  const io = socketHandler.getIO();

  if (!io) {
    throw new Error('Socket.IO not initialized!');
  }

  io.emit('instantMessage', {
    userId,
    message,
  });

  console.log(`Instant message sent to user ${userId}: ${message}`);
};

module.exports = {
  sendInstantMessage,
};