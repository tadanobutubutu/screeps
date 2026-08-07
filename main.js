// src/manager/roomManager.js

const rooms = new Map();

// Export the room manager functions
module.exports = {
  createRoom(roomId) {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        id: roomId,
        users: [],
        createdAt: new Date()
      });
    }
    return rooms.get(roomId);
  },

  getRoom(roomId) {
    return rooms.get(roomId);
  },

  deleteRoom(roomId) {
    return rooms.delete(roomId);
  },

  addUserToRoom(roomId, userId) {
    const room = rooms.get(roomId);
    if (room && !room.users.includes(userId)) {
      room.users.push(userId);
      return true;
    }
    return false;
  },

  removeUserFromRoom(roomId, userId) {
    const room = rooms.get(roomId);
    if (room) {
      const index = room.users.indexOf(userId);
      if (index > -1) {
        room.users.splice(index, 1);
        return true;
      }
    }
    return false;
  },

  getRoomUsers(roomId) {
    const room = rooms.get(roomId);
    return room ? room.users : [];
  },

  clearAllRooms() {
    rooms.clear();
  }
};