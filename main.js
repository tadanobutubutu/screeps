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
}

module.exports = { RoomManager };