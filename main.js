// src/managers/roomManager.js
const { v4: uuidv4 } = require('uuid');

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(name) {
    const roomId = uuidv4();
    this.rooms.set(roomId, {
      id: roomId,
      name,
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

  addMessage(roomId, userId, content) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    if (!room.participants.has(userId)) {
      throw new Error('User not in room');
    }
    const message = {
      id: uuidv4(),
      userId,
      content,
      timestamp: new Date()
    };
    room.messages.push(message);
    return message;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  getAllRooms() {
    return Array.from(this.rooms.values());
  }
}

module.exports = RoomManager;