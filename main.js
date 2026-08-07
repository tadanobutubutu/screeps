const myString = 'This is a string';  

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

module.exports = {  
  createRoom,  
  getRoom,  
  deleteRoom,  
  getAllRooms,  
  updateRoom,  
};