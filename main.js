// src/managers/roomManager.js
class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(roomId, roomData) {
    if (this.rooms.has(roomId)) {
      throw new Error(`Room ${roomId} already exists`);
    }
    this.rooms.set(roomId, roomData);
    return roomId;
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