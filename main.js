class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(roomId) {
    if (this.rooms.has(roomId)) {
      return false;
    }
    this.rooms.set(roomId, { id: roomId, users: [] });
    return true;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  deleteRoom(roomId) {
    return this.rooms.delete(roomId);
  }

  addUserToRoom(roomId, userId) {
    const room = this.rooms.get(roomId);
    if (room && !room.users.includes(userId)) {
      room.users.push(userId);
      return true;
    }
    return false;
  }

  removeUserFromRoom(roomId, userId) {
    const room = this.rooms.get(roomId);
    if (room) {
      const index = room.users.indexOf(userId);
      if (index > -1) {
        room.users.splice(index, 1);
        return true;
      }
    }
    return false;
  }
}

module.exports = RoomManager;