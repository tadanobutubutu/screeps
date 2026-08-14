// src/managers/roomManager.js
'use strict';

class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.io = null;
  }

  initialize(io) {
    this.io = io;
  }

  createRoom(roomId, options = {}) {
    if (this.rooms.has(roomId)) {
      return false;
    }
    
    const room = {
      id: roomId,
      users: [],
      options: options,
      createdAt: Date.now()
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

  getAllRooms() {
    return Array.from(this.rooms.values());
  }

  addUserToRoom(roomId, userId) {
    const room = this.getRoom(roomId);
    if (room && !room.users.includes(userId)) {
      room.users.push(userId);
      return true;
    }
    return false;
  }

  removeUserFromRoom(roomId, userId) {
    const room = this.getRoom(roomId);
    if (room) {
      const index = room.users.indexOf(userId);
      if (index > -1) {
        room.users.splice(index, 1);
        return true;
      }
    }
    return false;
  }

  getUserRooms(userId) {
    return this.getAllRooms().filter(room => room.users.includes(userId));
  }

  isUserInRoom(roomId, userId) {
    const room = this.getRoom(roomId);
    return room ? room.users.includes(userId) : false;
  }

  getRoomUserCount(roomId) {
    const room = this.getRoom(roomId);
    return room ? room.users.length : 0;
  }

  clearAllRooms() {
    this.rooms.clear();
  }
}

module.exports = RoomManager;