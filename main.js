<<<<<<< HEAD
// src/managers/roomManager.js
class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.roomIdCounter = 0;
  }

  createRoom(name, options = {}) {
    const roomId = `room_${++this.roomIdCounter}`;
    const room = {
      id: roomId,
      name: name,
      options: options,
      createdAt: new Date(),
      users: [],
      isActive: true,
    };
    this.rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  getAllRooms() {
    return Array.from(this.rooms.values());
  }

  updateRoom(roomId, updates) {
    const room = this.rooms.get(roomId);
    if (room) {
      Object.assign(room, updates);
      return room;
    }
    return null;
  }

  deleteRoom(roomId) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.isActive = false;
      this.rooms.delete(roomId);
      return true;
    }
    return false;
  }

  addUserToRoom(roomId, user) {
    const room = this.rooms.get(roomId);
    if (room && room.isActive) {
      if (!room.users.includes(user)) {
        room.users.push(user);
      }
      return room;
    }
    return null;
  }

  removeUserFromRoom(roomId, user) {
    const room = this.rooms.get(roomId);
    if (room) {
      const index = room.users.indexOf(user);
      if (index > -1) {
        room.users.splice(index, 1);
      }
      return room;
    }
    return null;
  }

  getActiveRooms() {
    return this.getAllRooms().filter(room => room.isActive);
  }

  getRoomsByUser(user) {
    return this.getAllRooms().filter(
      room => room.users.includes(user) && room.isActive
    );
  }

  getRoomCount() {
    return this.rooms.size;
  }

  clearAllRooms() {
    this.rooms.clear();
    this.roomIdCounter = 0;
  }
}

export default RoomManager;
=======
// src/managers/roomManager.js
class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.roomIdCounter = 0;
  }

  createRoom(name, options = {}) {
    const roomId = `room_${++this.roomIdCounter}`;
    const room = {
      id: roomId,
      name: name,
      options: options,
      createdAt: new Date(),
      users: [],
      isActive: true,
    };
    this.rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  getAllRooms() {
    return Array.from(this.rooms.values());
  }

  updateRoom(roomId, updates) {
    const room = this.rooms.get(roomId);
    if (room) {
      Object.assign(room, updates);
      return room;
    }
    return null;
  }

  deleteRoom(roomId) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.isActive = false;
      this.rooms.delete(roomId);
      return true;
    }
    return false;
  }

  addUserToRoom(roomId, user) {
    const room = this.rooms.get(roomId);
    if (room && room.isActive) {
      if (!room.users.includes(user)) {
        room.users.push(user);
      }
      return room;
    }
    return null;
  }

  removeUserFromRoom(roomId, user) {
    const room = this.rooms.get(roomId);
    if (room) {
      const index = room.users.indexOf(user);
      if (index > -1) {
        room.users.splice(index, 1);
      }
      return room;
    }
    return null;
  }

  getActiveRooms() {
    return this.getAllRooms().filter(room => room.isActive);
  }

  getRoomsByUser(user) {
    return this.getAllRooms().filter(
      room => room.users.includes(user) && room.isActive
    );
  }

  getRoomCount() {
    return this.rooms.size;
  }

  clearAllRooms() {
    this.rooms.clear();
    this.roomIdCounter = 0;
  }
}

export default RoomManager;
>>>>>>> origin/main