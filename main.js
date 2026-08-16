// src/managers/roomManager.js

const rooms = new Map();

class RoomManager {
  static getInstance() {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }

  createRoom(roomId, options = {}) {
    if (rooms.has(roomId)) {
      return rooms.get(roomId);
    }
    const room = {
      id: roomId,
      users: new Set(),
      createdAt: new Date(),
      ...options
    };
    rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId) {
    return rooms.get(roomId);
  }

  deleteRoom(roomId) {
    return rooms.delete(roomId);
  }

  addUserToRoom(roomId, userId) {
    const room = rooms.get(roomId);
    if (room) {
      room.users.add(userId);
      return true;
    }
    return false;
  }

  removeUserFromRoom(roomId, userId) {
    const room = rooms.get(roomId);
    if (room) {
      room.users.delete(userId);
      return true;
    }
    return false;
  }

  getRooms() {
    return Array.from(rooms.values());
  }

  getRoomCount() {
    return rooms.size;
  }
}

module.exports = RoomManager;