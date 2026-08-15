class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.users = new Map();
  }

  createRoom(roomId, options = {}) {
    if (this.rooms.has(roomId)) {
      throw new Error(`Room ${roomId} already exists`);
    }
    
    const room = {
      id: roomId,
      name: options.name || roomId,
      capacity: options.capacity || 10,
      users: [],
      createdAt: new Date(),
      isActive: true
    };
    
    this.rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  joinRoom(roomId, userId, userData = {}) {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }
    
    if (room.users.length >= room.capacity) {
      throw new Error(`Room ${roomId} is full`);
    }
    
    if (room.users.some(u => u.id === userId)) {
      throw new Error(`User ${userId} is already in room ${roomId}`);
    }
    
    const user = {
      id: userId,
      joinedAt: new Date(),
      ...userData
    };
    
    room.users.push(user);
    this.users.set(userId, roomId);
    
    return { room, user };
  }

  leaveRoom(roomId, userId) {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }
    
    const userIndex = room.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error(`User ${userId} not found in room ${roomId}`);
    }
    
    room.users.splice(userIndex, 1);
    this.users.delete(userId);
    
    if (room.users.length === 0) {
      room.isActive = false;
    }
    
    return true;
  }

  deleteRoom(roomId) {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }
    
    // Remove all users from the room
    room.users.forEach(user => {
      this.users.delete(user.id);
    });
    
    this.rooms.delete(roomId);
    return true;
  }

  getRoomUsers(roomId) {
    const room = this.rooms.get(roomId);
    return room ? room.users : [];
  }

  getUserRoom(userId) {
    const roomId = this.users.get(userId);
    return roomId ? this.rooms.get(roomId) : null;
  }

  getAllRooms() {
    return Array.from(this.rooms.values());
  }

  getActiveRooms() {
    return this.getAllRooms().filter(room => room.isActive);
  }

  updateRoom(roomId, updates) {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }
    
    const allowedUpdates = ['name', 'capacity', 'isActive'];
    
    for (const key of Object.keys(updates)) {
      if (allowedUpdates.includes(key)) {
        room[key] = updates[key];
      }
    }
    
    return room;
  }
}

module.exports = RoomManager;

// Example fix for unterminated string
function processEmotion(emotion) {
  // ... other code ...

  // Line 389 - before fix:
  // const message = 'This is an unterminated string;

  // After fix:
  const message = 'This is a properly terminated string';

  // ... rest of the function ...
}

// Test file for RoomManager
describe('RoomManager', () => {
  let roomManager;

  beforeEach(() => {
    roomManager = new RoomManager();
  });

  describe('createRoom', () => {
    test('should create a room with default values', () => {
      const room = roomManager.createRoom('room1');
      expect(room.id).toBe('room1');
      expect(room.name).toBe('room1');
      expect(room.capacity).toBe(10);
      expect(room.users).toEqual([]);
      expect(room.isActive).toBe(true);
      expect(room.createdAt).toBeInstanceOf(Date);
    });

    test('should create a room with custom options', () => {
      const room = roomManager.createRoom('room1', { name: 'Test Room', capacity: 20 });
      expect(room.name).toBe('Test Room');
      expect(room.capacity).toBe(20);
    });

    test('should throw error if room already exists', () => {
      roomManager.createRoom('room1');
      expect(() => roomManager.createRoom('room1')).toThrow('Room room1 already exists');
    });
  });

  describe('joinRoom', () => {
    test('should join a user to a room', () => {
      const room = roomManager.createRoom('room1');
      const result = roomManager.joinRoom('room1', 'user1');
      expect(result.user.id).toBe('user1');
      expect(result.room.users).toHaveLength(1);
      expect(roomManager.getUserRoom('user1')).toBe(room);
    });

    test('should throw error if room not found', () => {
      expect(() => roomManager.joinRoom('nonexistent', 'user1')).toThrow('Room nonexistent not found');
    });

    test('should throw error if room is full', () => {
      const room = roomManager.createRoom('room1', { capacity: 1 });
      roomManager.joinRoom('room1', 'user1');
      expect(() => roomManager.joinRoom('room1', 'user2')).toThrow('Room room1 is full');
    });

    test('should throw error if user already in room', () => {
      const room = roomManager.createRoom('room1');
      roomManager.joinRoom('room1', 'user1');
      expect(() => roomManager.joinRoom('room1', 'user1')).toThrow('User user1 is already in room room1');
    });
  });

  describe('leaveRoom', () => {
    test('should remove a user from a room', () => {
      const room = roomManager.createRoom('room1');
      roomManager.joinRoom('room1', 'user1');
      const result = roomManager.leaveRoom('room1', 'user1');
      expect(result).toBe(true);
      expect(room.users).toHaveLength(0);
      expect(roomManager.getUserRoom('user1')).toBeNull();
    });

    test('should set room inactive when last user leaves', () => {
      const room = roomManager.createRoom('room1');
      roomManager.joinRoom('room1', 'user1');
      roomManager.leaveRoom('room1', 'user1');
      expect(room.isActive).toBe(false);
    });

    test('should throw error if room not found', () => {
      expect(() => roomManager.leaveRoom('nonexistent', 'user1')).toThrow('Room nonexistent not found');
    });

    test('should throw error if user not in room', () => {
      const room = roomManager.createRoom('room1');
      expect(() => roomManager.leaveRoom('room1', 'user1')).toThrow('User user1 not found in room room1');
    });
  });

  describe('deleteRoom', () => {
    test('should delete a room and all its users', () => {
      const room = roomManager.createRoom('room1');
      roomManager.joinRoom('room1', 'user1');
      roomManager.deleteRoom('room1');
      expect(roomManager.getRoom('room1')).toBeUndefined();
      expect(roomManager.getUserRoom('user1')).toBeNull();
    });

    test('should throw error if room not found', () => {
      expect(() => roomManager.deleteRoom('nonexistent')).toThrow('Room nonexistent not found');
    });
  });

  describe('getActiveRooms', () => {
    test('should return only active rooms', () => {
      const room1 = roomManager.createRoom('room1');
      const room2 = roomManager.createRoom('room2');
      roomManager.joinRoom('room1', 'user1');
      roomManager.leaveRoom('room1', 'user1');
      expect(roomManager.getActiveRooms()).toHaveLength(1);
      expect(roomManager.getActiveRooms()[0].id).toBe('room2');
    });
  });
});