// role.healer.js - merged with tutorial automation
// Ensure proper syntax throughout

const Healer = {
  // Your existing code here

  shouldHeal(creep) {
    // Proper comparison syntax
    if (creep.hits < creep.hitsMax * 0.7) {
      return true;
    }
    return false;
  },

  // Rest of your code
};

// tutorial automation functions
const emotionString = "This is a properly terminated string";
const tutorialData = require('./tutorial.data');

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

// Room manager and related classes
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

const rooms = new Map();

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

// Example utility function from origin/main
function existingFunction() {
  // existing implementation
}

// Export combined API
module.exports = {
  Healer,
  getNextStep,
  completeStep,
  getProgress,
  resetTutorial,
  emotionString,
  Room,
  createRoom,
  getRoom,
  deleteRoom,
  roomExists,
  getAllRooms,
  getRoomCount,
  clearAllRooms,
  existingFunction
};