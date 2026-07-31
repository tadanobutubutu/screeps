// main.js - Application entry point

var roomManager = require('./src/managers/roomManager');

function main() {
  var rooms = roomManager.getRooms();
  console.log('Active rooms:', rooms.length);
}

function setupRoom(roomId, options) {
  var room = roomManager.createRoom(roomId, options);
  return room;
}

function closeRoom(roomId) {
  var result = roomManager.removeRoom(roomId);
  return result;
}

module.exports = {
  main: main,
  setupRoom: setupRoom,
  closeRoom: closeRoom
};