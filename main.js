const { v4: uuidv4 } = require('uuid');

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom() {
    const roomId = uuidv4();
    this.rooms.set(roomId, { id: roomId, users: new Set() });
    return roomId;
  }

  joinRoom(roomId, userId) {
    if (!this.rooms.has(roomId)) {
      throw new Error('Room does not exist');
    }
    this.rooms.get(roomId).users.add(userId);
  }

  leaveRoom(roomId, userId) {
    if (!this.rooms.has(roomId)) {
      throw new Error('Room does not exist');
    }
    this.rooms.get(roomId).users.delete(userId);
  }

  getRoomUsers(roomId) {
    if (!this.rooms.has(roomId)) {
      throw new Error('Room does not exist');
    }
    return Array.from(this.rooms.get(roomId).users);
  }

  deleteRoom(roomId) {
    this.rooms.delete(roomId);
  }
}

// Random utilities
function randomInt(min, max) {
  if (min > max) {
    throw new Error('min must be <= max');
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error('Array must be non-empty');
  }
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

module.exports = {
  RoomManager,
  randomInt,
  randomChoice,
};

// Jest tests for random functionality
describe('random utilities', () => {
  test('randomInt generates integer in range', () => {
    const result = randomInt(1, 10);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(10);
    expect(Number.isInteger(result)).toBe(true);
  });

  test('randomChoice selects from array', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = randomChoice(arr);
    expect(arr).toContain(result);
  });

  test('randomInt returns inclusive bounds', () => {
    const min = 5;
    const max = 5;
    const result = randomInt(min, max);
    expect(result).toBe(5);
  });
});