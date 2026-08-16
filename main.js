// src/managers/roomManager.js
const { v4: uuidv4 } = require('uuid');

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom() {
    const roomId = uuidv4();
    this.rooms.set(roomId, { id: roomId, users: new Set() });
    return roomId;
  }

  joinRoom(roomId, userId) {
    if (!this.rooms.has(roomId)) {
      throw new Error('Room does not exist');
    }
    this.rooms.get(roomId).users.add(userId);
  }

  leaveRoom(roomId, userId) {
    if (!this.rooms.has(roomId)) {
      throw new Error('Room does not exist');
    }
    this.rooms.get(roomId).users.delete(userId);
  }

  getRoomUsers(roomId) {
    if (!this.rooms.has(roomId)) {
      throw new Error('Room does not exist');
    }
    return Array.from(this.rooms.get(roomId).users);
  }

  deleteRoom(roomId) {
    this.rooms.delete(roomId);
  }
}

module.exports = RoomManager;