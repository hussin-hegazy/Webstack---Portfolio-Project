// utils/instantMessaging/index.js
const socketHandler = require('./socketHandler');
const { sendInstantMessage } = require('./instantMessaging');

module.exports = {
  socketHandler,
  sendInstantMessage,
};