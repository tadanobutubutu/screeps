'use strict';

const roomManager = {
  rooms: new Map(),
  
  createRoom(roomId, options = {}) {
    if (this.rooms.has(roomId)) {
      return this.rooms.get(roomId);
    }
    const room = {
      id: roomId,
      name: options.name || roomId,
      capacity: options.capacity || 10,
      createdAt: new Date(),
      users: new Set()
    };
    this.rooms.set(roomId, room);
    return room;
  },
  
  getRoom(roomId) {
    return this.rooms.get(roomId);
  },
  
  deleteRoom(roomId) {
    return this.rooms.delete(roomId);
  },
  
  addUserToRoom(roomId, userId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }
    if (room.users.size >= room.capacity) {
      throw new Error(`Room ${roomId} is full`);
    }
    room.users.add(userId);
    return room;
  },
  
  removeUserFromRoom(roomId, userId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return false;
    }
    return room.users.delete(userId);
  },
  
  getRoomUsers(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return [];
    }
    return Array.from(room.users);
  },
  
  clearAllRooms() {
    this.rooms.clear();
  },
  
  getAllRooms() {
    return Array.from(this.rooms.values());
  }
};

module.exports = roomManager;