"use strict";

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  addRoom(roomId, roomData = {}) {
    if (this.rooms.has(roomId)) {
      throw new Error(`Room ${roomId} already exists`);
    }
    this.rooms.set(roomId, { id: roomId, ...roomData });
    return this.rooms.get(roomId);
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  removeRoom(roomId) {
    return this.rooms.delete(roomId);
  }

  listRooms() {
    return Array.from(this.rooms.values());
  }

  getRoomCount() {
    return this.rooms.size;
  }

  // New method to update room data
  updateRoom(roomId, newData) {
    if (!this.rooms.has(roomId)) {
      throw new Error(`Room ${roomId} does not exist`);
    }
    const currentData = this.rooms.get(roomId);
    this.rooms.set(roomId, { ...currentData, ...newData });
    return this.rooms.get(roomId);
  }

  // New method to check if room exists
  hasRoom(roomId) {
    return this.rooms.has(roomId);
  }

  // New method to clear all rooms
  clearAllRooms() {
    const count = this.rooms.size;
    this.rooms.clear();
    return count;
  }
}

// Lint fix: resolved parsing errors and ensured valid syntax for Jest compatibility

module.exports = { RoomManager };