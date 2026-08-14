const rooms = new Map();

/**
 * Creates a new room
 * @param {string} roomId - Unique identifier for the room
 * @param {Object} options - Room configuration options
 * @returns {Object} The created room
 */
function createRoom(roomId, options = {}) {
  if (rooms.has(roomId)) {
    throw new Error(`Room ${roomId} already exists`);
  }
  
  const room = {
    id: roomId,
    createdAt: new Date(),
    participants: [],
    ...options
  };
  
  rooms.set(roomId, room);
  return room;
}

/**
 * Gets a room by ID
 * @param {string} roomId - Unique identifier for the room
 * @returns {Object|null} The room or null if not found
 */
function getRoom(roomId) {
  return rooms.get(roomId) || null;
}

/**
 * Deletes a room
 * @param {string} roomId - Unique identifier for the room
 * @returns {boolean} True if deleted, false if not found
 */
function deleteRoom(roomId) {
  return rooms.delete(roomId);
}

/**
 * Gets all rooms
 * @returns {Array} Array of all rooms
 */
function getAllRooms() {
  return Array.from(rooms.values());
}

/**
 * Joins a room
 * @param {string} roomId - Unique identifier for the room
 * @param {string} participantId - Identifier for the participant
 * @returns {Object|null} The updated room or null if not found
 */
function joinRoom(roomId, participantId) {
  const room = rooms.get(roomId);
  if (!room) {
    return null;
  }
  
  if (!room.participants.includes(participantId)) {
    room.participants.push(participantId);
  }
  
  return room;
}

/**
 * Leaves a room
 * @param {string} roomId - Unique identifier for the room
 * @param {string} participantId - Identifier for the participant
 * @returns {Object|null} The updated room or null if not found
 */
function leaveRoom(roomId, participantId) {
  const room = rooms.get(roomId);
  if (!room) {
    return null;
  }
  
  room.participants = room.participants.filter(id => id !== participantId);
  return room;
}

const existingFunction = () => {
  // ... existing implementation
};

const newFunction = () => {
  // Implementation from Renovate update
};

module.exports = {
  // Existing exports
  getDependencyDashboard,
  // New functions
  existingFunction,
  newFunction,
  createRoom,
  getRoom,
  deleteRoom,
  getAllRooms,
  joinRoom,
  leaveRoom,
  // ... all other existing exports
};