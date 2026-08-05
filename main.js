// src/managers/roomManager.js

const rooms = new Map();

function createRoom(roomId, roomData) {
  if (rooms.has(roomId)) {
    throw new Error(`Room with id ${roomId} already exists`);
  }
  rooms.set(roomId, roomData);
  return roomData;
}

function getRoom(roomId) {
  return rooms.get(roomId);
}

function updateRoom(roomId, roomData) {
  if (!rooms.has(roomId)) {
    throw new Error(`Room with id ${roomId} does not exist`);
  }
  rooms.set(roomId, roomData);
  return roomData;
}

function deleteRoom(roomId) {
  return rooms.delete(roomId);
}

function listRooms() {
  return Array.from(rooms.values());
}

module.exports = {
  createRoom,
  getRoom,
  updateRoom,
  deleteRoom,
  listRooms,
};