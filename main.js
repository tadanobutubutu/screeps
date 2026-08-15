class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.users = new Map();
  }

  createRoom(roomId, options = {}) {
    if (this.rooms.has(roomId)) {
      throw new Error(`Room ${roomId} already exists`);
    }
    
    const room = {
      id: roomId,
      name: options.name || roomId,
      capacity: options.capacity || 10,
      users: [],
      createdAt: new Date(),
      isActive: true
    };
    
    this.rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  joinRoom(roomId, userId, userData = {}) {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }
    
    if (room.users.length >= room.capacity) {
      throw new Error(`Room ${roomId} is full`);
    }
    
    if (room.users.some(u => u.id === userId)) {
      throw new Error(`User ${userId} is already in room ${roomId}`);
    }
    
    const user = {
      id: userId,
      joinedAt: new Date(),
      ...userData
    };
    
    room.users.push(user);
    this.users.set(userId, roomId);
    
    return { room, user };
  }

  leaveRoom(roomId, userId) {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }
    
    const userIndex = room.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error(`User ${userId} not found in room ${roomId}`);
    }
    
    room.users.splice(userIndex, 1);
    this.users.delete(userId);
    
    if (room.users.length === 0) {
      room.isActive = false;
    }
    
    return true;
  }

  deleteRoom(roomId) {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }
    
    // Remove all users from the room
    room.users.forEach(user => {
      this.users.delete(user.id);
    });
    
    this.rooms.delete(roomId);
    return true;
  }

  getRoomUsers(roomId) {
    const room = this.rooms.get(roomId);
    return room ? room.users : [];
  }

  getUserRoom(userId) {
    const roomId = this.users.get(userId);
    return roomId ? this.rooms.get(roomId) : null;
  }

  getAllRooms() {
    return Array.from(this.rooms.values());
  }

  getActiveRooms() {
    return this.getAllRooms().filter(room => room.isActive);
  }

  updateRoom(roomId, updates) {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }
    
    const allowedUpdates = ['name', 'capacity', 'isActive'];
    
    for (const key of Object.keys(updates)) {
      if (allowedUpdates.includes(key)) {
        room[key] = updates[key];
      }
    }
    
    return room;
  }
}

module.exports = RoomManager;