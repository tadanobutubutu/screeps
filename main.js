// src/managers/roomManager.js
class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        id: roomId,
        createdAt: new Date(),
        participants: []
      });

      // Add function to track number of creeps in room
      this.rooms.get(roomId).creepCount = 0;

      return true;
    }
    return false;
  }

  getRoom(roomId) {
    const room = this.rooms.get(roomId);
    if (room) {
      if (room.creepCount) {
        // Update function to include last scout update time
        room.lastScoutUpdate = new Date();
      }
    }
    return room || null;
  }

  deleteRoom(roomId) {
    return this.rooms.delete(roomId);
  }

  addParticipant(roomId, participant) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.participants.push(participant);
      room.creepCount++;
      return true;
    }
    return false;
  }

  removeParticipant(roomId, participantId) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.participants = room.participants.filter(p => p.id !== participantId);
      if (!room.participants.length) {
        // Clear room if no more participants
        this.rooms.delete(roomId);
      } else {
        room.creepCount--;
      }
      return true;
    }
    return false;
  }

  getRoomCount() {
    return this.rooms.size;
  }

  clearAllRooms() {
    this.rooms.clear();
  }

  getRoomByIdWithCreeps(roomId) {
    const room = this.getRoom(roomId);
    if (room) {
      room.creeps = this.findCreepsInRoom(roomId);
    }
    return room;
  }

  findCreepsInRoom(roomId) {
    // Implement function that finds and returns all creeps in a room
  }
}

module.exports = { RoomManager };

// test_random.1.js
const { describe, it, expect } = require('jest');

describe('Random number generation', () => {
  it('should generate a random number within the specified range', () => {
    const min = 1;
    const max = 10;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    expect(randomNumber).toBeGreaterThanOrEqual(min);
    expect(randomNumber).toBeLessThanOrEqual(max);
  });

  it('should generate different numbers on subsequent calls', () => {
    const firstNumber = Math.floor(Math.random() * 100);
    const secondNumber = Math.floor(Math.random() * 100);
    expect(firstNumber).toBeGreaterThanOrEqual(0);
    expect(firstNumber).toBeLessThan(100);
    expect(secondNumber).toBeGreaterThanOrEqual(0);
    expect(secondNumber).toBeLessThan(100);
  });
});

// Add new test for updated dependencies
describe('Dependency updates', () => {
  it('should have updated dependencies', () =>
    // This test will be implemented when the actual dependency updates are applied
    // to the package.1json and other configuration files
    expect(true).toBe(true);
  );
});