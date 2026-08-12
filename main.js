// src/managers/roomManager.js
const { Room } = require('../models/room'); // Example import

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  /**
   * Creates a new room
   * @param {string} roomId - Unique identifier for the room
   * @param {Object} options - Room configuration options
   * @returns {Room} The created room instance
   */
  createRoom(roomId, options = {}) {
    if (this.rooms.has(roomId)) {
      throw new Error(`Room ${roomId} already exists`);
    }

    const room = new Room(roomId, options);
    this.rooms.set(roomId, room);
    return room;
  }

  /**
   * Gets a room by ID
   * @param {string} roomId - Room identifier
   * @returns {Room|null} The room instance or null if not found
   */
  getRoom(roomId) {
    return this.rooms.get(roomId) || null;
  }

  /**
   * Removes a room by ID
   * @param {string} roomId - Room identifier
   * @returns {boolean} True if room was removed, false if not found
   */
  removeRoom(roomId) {
    return this.rooms.delete(roomId);
  }

  /**
   * Gets all active rooms
   * @returns {Array<Room>} Array of all active rooms
   */
  getAllRooms() {
    return Array.from(this.rooms.values());
  }
}

module.exports = RoomManager;