// Fixed version of roomManager.js
// Assuming the issue was a malformed export or syntax error

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(roomId, options = {}) {
    if (this.rooms.has(roomId)) {
      return this.rooms.get(roomId);
    }
    
    const room = {
      id: roomId,
      createdAt: Date.now(),
      options: options,
      users: []
    };
    
    this.rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId) || null;
  }

  deleteRoom(roomId) {
    return this.rooms.delete(roomId);
  }

  listRooms() {
    return Array.from(this.rooms.values());
  }
}

module.exports = RoomManager;