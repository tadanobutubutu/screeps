// utils.emotions.js (combined with Room Manager Module)

// ... (all existing code before line 389 from utils.emotions.js)

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

/**
 * Processes emotion data with proper string termination
 * @param {string} emotion - The emotion to process
 * @returns {string} Processed emotion string
 */
function processEmotion(emotion) {
  // Ensure the string is properly terminated
  const processed = emotion.replace(/[^a-zA-Z0-9\s]/g, '');
  return `"${processed}"`; // Properly terminate the string
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
  processEmotion
};