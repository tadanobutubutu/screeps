const updatedDependencies = {
  "posthog-js": "1.417.1",
  "typescript": "7.0.0",
  "@sentry/browser": "10.70.0",
  "undici": "8.9.0"
};

const supportedNodeVersions = ["20", "24"];

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

/**
 * Existing function placeholder
 */
function existingFunction() {
  // existing implementation
  console.log('Existing function executed');
  return true;
}

/**
 * New function wrapper for dependency update
 * @param {string} packageName - Name of the package
 * @param {string} version - Version to update to
 * @returns {boolean} Indicates success
 */
function newFunction(packageName, version) {
  // Implementation from Renovate update
  console.log(`New function: updating ${packageName} to ${version}`);
  return handleDependencyUpdate(packageName, version);
}

/**
 * Gets updated dependency
 * @param {string} packageName - Package name
 * @returns {string|null} Version or null
 */
function getUpdatedDependency(packageName) {
  return updatedDependencies[packageName] || null;
}

/**
 * Checks if a Node.js version is supported
 * @param {string} version - Node.js version string
 * @returns {boolean} True if supported
 */
function isNodeVersionSupported(version) {
  return supportedNodeVersions.includes(version);
}

/**
 * Handles dependency update
 * @param {string} packageName - Package name
 * @param {string} version - Version to update to
 */
function handleDependencyUpdate(packageName, version) {
  console.log(`Updating ${packageName} to version ${version}`);
  // Implementation would go here
  return true;
}

// Export all existing functions and add new ones
module.exports = {
  // Existing exports remain unchanged
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
  // Additional exports
  getUpdatedDependency,
  isNodeVersionSupported,
  handleDependencyUpdate,
  updatedDependencies
};