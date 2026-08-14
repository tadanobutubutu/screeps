// src/managers/roomManager.js
const { v4: uuidv4 } = require('uuid');

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom() {
    const roomId = uuidv4();
    this.rooms.set(roomId, { id: roomId, participants: new Set() });
    return roomId;
  }

  joinRoom(roomId, participantId) {
    if (!this.rooms.has(roomId)) {
      throw new Error('Room does not exist');
    }
    this.rooms.get(roomId).participants.add(participantId);
  }

  leaveRoom(roomId, participantId) {
    if (!this.rooms.has(roomId)) {
      throw new Error('Room does not exist');
    }
    this.rooms.get(roomId).participants.delete(participantId);
  }

  getRoomParticipants(roomId) {
    if (!this.rooms.has(roomId)) {
      throw new Error('Room does not exist');
    }
    return Array.from(this.rooms.get(roomId).participants);
  }

  deleteRoom(roomId) {
    this.rooms.delete(roomId);
  }
}

module.exports = RoomManager;