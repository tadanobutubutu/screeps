// src/managers/roomManager.js
class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        id: roomId,
        createdAt: new Date(),
        participants: []
      });
      return true;
    }
    return false;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId) || null;
  }

  deleteRoom(roomId) {
    return this.rooms.delete(roomId);
  }

  addParticipant(roomId, participant) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.participants.push(participant);
      return true;
    }
    return false;
  }

  removeParticipant(roomId, participantId) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.participants = room.participants.filter(p => p.id !== participantId);
      return true;
    }
    return false;
  }

  getRoomCount() {
    return this.rooms.size;
  }

  clearAllRooms() {
    this.rooms.clear();
  }
}

module.exports = { RoomManager };