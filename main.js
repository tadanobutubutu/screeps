// Room Manager - Manages room-related operations

const rooms = new Map();

/**
 * Creates a new room
 * @param {string} roomId - Unique identifier for the room
 * @param {Object} options - Room configuration options
 * @returns {Object} The created room object
 */
function createRoom(roomId, options = {}) {
  if (rooms.has(roomId)) {
    return rooms.get(roomId);
  }

  const room = {
    id: roomId,
    name: options.name || `Room ${roomId}`,
    capacity: options.capacity || 10,
    createdAt: new Date(),
    users: [],
    isActive: true,
  };

  rooms.set(roomId, room);
  return room;
}

/**
 * Gets a room by its ID
 * @param {string} roomId - The room ID to look up
 * @returns {Object|null} The room object or null if not found
 */
function getRoom(roomId) {
  return rooms.get(roomId) || null;
}

/**
 * Deletes a room by its ID
 * @param {string} roomId - The room ID to delete
 * @returns {boolean} True if deleted, false if not found
 */
function deleteRoom(roomId) {
  return rooms.delete(roomId);
}

/**
 * Gets all active rooms
 * @returns {Array} Array of all active room objects
 */
function getAllRooms() {
  return Array.from(rooms.values()).filter(room => room.isActive);
}

/**
 * Updates a room's properties
 * @param {string} roomId - The room ID to update
 * @param {Object} updates - Properties to update
 * @returns {Object|null} Updated room or null if not found
 */
function updateRoom(roomId, updates) {
  const room = rooms.get(roomId);
  if (!room) {
    return null;
  }

  Object.assign(room, updates);
  return room;
}

/**
 * Adds a user to a room
 * @param {string} roomId - The room ID
 * @param {string} userId - The user ID to add
 * @returns {boolean} True if user was added, false if room is full or not found
 */
function addUserToRoom(roomId, userId) {
  const room = rooms.get(roomId);
  if (!room || room.users.length >= room.capacity) {
    return false;
  }

  if (!room.users.includes(userId)) {
    room.users.push(userId);
    return true;
  }
  return false;
}

/**
 * Removes a user from a room
 * @param {string} roomId - The room ID
 * @param {string} userId - The user ID to remove
 * @returns {boolean} True if user was removed, false if not found
 */
function removeUserFromRoom(roomId, userId) {
  const room = rooms.get(roomId);
  if (!room) {
    return false;
  }

  const index = room.users.indexOf(userId);
  if (index !== -1) {
    room.users.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Gets all users in a room
 * @param {string} roomId - The room ID
 * @returns {Array|null} Array of user IDs or null if room not found
 */
function getRoomUsers(roomId) {
  const room = rooms.get(roomId);
  return room ? [...room.users] : null;
}

/**
 * Checks if a room is full
 * @param {string} roomId - The room ID
 * @returns {boolean|null} True if full, false if not full, null if room not found
 */
function isRoomFull(roomId) {
  const room = rooms.get(roomId);
  if (!room) {
    return null;
  }
  return room.users.length >= room.capacity;
}

module.exports = {
  createRoom,
  getRoom,
  deleteRoom,
  getAllRooms,
  updateRoom,
  addUserToRoom,
  removeUserFromRoom,
  getRoomUsers,
  isRoomFull,
};