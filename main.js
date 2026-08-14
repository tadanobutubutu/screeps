// src/managers/roomManager.js
class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(roomId, options = {}) {
    if (this.rooms.has(roomId)) {
      throw new Error(`Room ${roomId} already exists`);
    }
    const room = {
      id: roomId,
      ...options,
      participants: new Set(),
    };
    this.rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  deleteRoom(roomId) {
    return this.rooms.delete(roomId);
  }

  addParticipant(roomId, participantId) {
    const room = this.getRoom(roomId);
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }
    room.participants.add(participantId);
    return room;
  }

  removeParticipant(roomId, participantId) {
    const room = this.getRoom(roomId);
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }
    room.participants.delete(participantId);
    return room;
  }

  getParticipants(roomId) {
    const room = this.getRoom(roomId);
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }
    return Array.from(room.participants);
  }
}

module.exports = RoomManager;