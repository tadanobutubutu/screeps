// src/managers/roomManager.js
const { v4: uuidv4 } = require('uuid');

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom() {
    const roomId = uuidv4();
    this.rooms.set(roomId, {
      id: roomId,
      participants: new Set(),
      messages: []
    });
    return roomId;
  }

  joinRoom(roomId, userId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    room.participants.add(userId);
    return room;
  }

  leaveRoom(roomId, userId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    room.participants.delete(userId);
    return room;
  }

  addMessage(roomId, message) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    room.messages.push(message);
    return room;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  getAllRooms() {
    return Array.from(this.rooms.values());
  }
}

module.exports = RoomManager;