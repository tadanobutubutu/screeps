// Room Manager Module
// Handles room creation, management, and deletion

const rooms = new Map();

const DEFAULT_OPTIONS = {
  maxUsers: 10,
  isPrivate: false,
  allowGuests: true
};

class Room {
  constructor(id, options = {}) {
    this.id = id;
    this.users = new Set();
    this.createdAt = Date.now();
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  addUser(userId) {
    if (this.users.size >= this.options.maxUsers) {
      return false;
    }
    this.users.add(userId);
    return true;
  }

  removeUser(userId) {
    return this.users.delete(userId);
  }

  hasUser(userId) {
    return this.users.has(userId);
  }

  getUserCount() {
    return this.users.size;
  }

  toJSON() {
    return {
      id: this.id,
      userCount: this.users.size,
      createdAt: this.createdAt,
      options: this.options
    };
  }
}

function createRoom(roomId, options = {}) {
  if (rooms.has(roomId)) {
    return rooms.get(roomId);
  }
  const room = new Room(roomId, options);
  rooms.set(roomId, room);
  return room;
}

function getRoom(roomId) {
  return rooms.get(roomId);
}

function deleteRoom(roomId) {
  return rooms.delete(roomId);
}

function roomExists(roomId) {
  return rooms.has(roomId);
}

function getAllRooms() {
  return Array.from(rooms.values());
}

function getRoomCount() {
  return rooms.size;
}

function clearAllRooms() {
  rooms.clear();
}

// New functions added based on the issue

/**
 * Updates room options
 * @param {string} roomId - The ID of the room to update
 * @param {Object} newOptions - New options to merge with existing ones
 * @returns {boolean} True if the room was found and updated, false otherwise
 */
function updateRoomOptions(roomId, newOptions) {
  const room = rooms.get(roomId);
  if (!room) return false;

  room.options = { ...room.options, ...newOptions };
  return true;
}

/**
 * Gets all users in a specific room
 * @param {string} roomId - The ID of the room
 * @returns {Array} Array of user IDs in the room, or empty array if room doesn't exist
 */
function getRoomUsers(roomId) {
  const room = rooms.get(roomId);
  return room ? Array.from(room.users) : [];
}

/**
 * Gets room creation timestamp
 * @param {string} roomId - The ID of the room
 * @returns {number|null} Timestamp when the room was created, or null if room doesn't exist
 */
function getRoomCreationTime(roomId) {
  const room = rooms.get(roomId);
  return room ? room.createdAt : null;
}

/**
 * Gets room options
 * @param {string} roomId - The ID of the room
 * @returns {Object|null} Room options object, or null if room doesn't exist
 */
function getRoomOptions(roomId) {
  const room = rooms.get(roomId);
  return room ? room.options : null;
}

/**
 * Checks if a room is full
 * @param {string} roomId - The ID of the room
 * @returns {boolean} True if the room is full, false otherwise or if room doesn't exist
 */
function isRoomFull(roomId) {
  const room = rooms.get(roomId);
  return room ? room.users.size >= room.options.maxUsers : false;
}

module.exports = {
  Room,
  createRoom,
  getRoom,
  deleteRoom,
  roomExists,
  getAllRooms,
  getRoomCount,
  clearAllRooms,
  updateRoomOptions,
  getRoomUsers,
  getRoomCreationTime,
  getRoomOptions,
  isRoomFull
};