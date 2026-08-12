// src/managers/roomManager.js
const { Room } = require('../models/room');

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(roomData) {
    const room = new Room(roomData);
    this.rooms.set(room.id, room);
    return room;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  deleteRoom(roomId) {
    return this.rooms.delete(roomId);
  }

  getAllRooms() {
    return Array.from(this.rooms.values());
  }
}

module.exports = RoomManager;