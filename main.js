const tutorialData = require('./tutorial.data');

// utils.tasks.js
// [Preserve all existing code above line 47]

// utils.emotions.js
// ... (all existing code before line 389)

// Processes emotion data with proper string termination
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

// ... (rest of the existing code)

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

// Tutorial automation functions
const emotionString = "This is a properly terminated string";

function getNextStep(userId) {
  return tutorialData.getNextStep(userId);
}

function completeStep(userId, stepId) {
  return tutorialData.completeStep(userId, stepId);
}

function getProgress(userId) {
  return tutorialData.getProgress(userId);
}

function resetTutorial(userId) {
  return tutorialData.resetTutorial(userId);
}

// Export the combined API
module.exports = {
  getNextStep,
  completeStep,
  getProgress,
  resetTutorial,
  someExistingFunction,
  emotionString,
  processEmotion,
  Room,
  createRoom,
  getRoom,
  deleteRoom,
  roomExists,
  getAllRooms,
  getRoomCount,
  clearAllRooms
};