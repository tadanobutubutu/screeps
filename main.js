// src/manager/roomManager.js

const rooms = new Map();

// Export the room manager functions
module.exports = {
  createRoom(roomId) {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        id: roomId,
        users: [],
        createdAt: new Date()
      });
    }
    return rooms.get(roomId);
  },

  getRoom(roomId) {
    return rooms.get(roomId);
  },

  deleteRoom(roomId) {
    return rooms.delete(roomId);
  },

  addUserToRoom(roomId, userId) {
    const room = rooms.get(roomId);
    if (room && !room.users.includes(userId)) {
      room.users.push(userId);
      return true;
    }
    return false;
  },

  removeUserFromRoom(roomId, userId) {
    const room = rooms.get(roomId);
    if (room) {
      const index = room.users.indexOf(userId);
      if (index > -1) {
        room.users.splice(index, 1);
        return true;
      }
    }
    return false;
  },

  getRoomUsers(roomId) {
    const room = rooms.get(roomId);
    return room ? room.users : [];
  },

  clearAllRooms() {
    rooms.clear();
  }
};

// Add new dependency-related functions
function updateNodeVersion(newVersion) {
    // Implementation to update Node.js version
    console.log(`Updating Node.js to version ${newVersion}`);
}

function updateTypeScriptVersion(newVersion) {
    // Implementation to update TypeScript version
    console.log(`Updating TypeScript to version ${newVersion}`);
}

function updatePosthogJsVersion(newVersion) {
    // Implementation to update posthog-js version
    console.log(`Updating posthog-js to version ${newVersion}`);
}

function updateUndiciVersion(newVersion) {
    // Implementation to update undici version
    console.log(`Updating undici to version ${newVersion}`);
}

// Add a function to handle dependency updates
function handleDependencyUpdates(updates) {
    updates.forEach(update => {
        switch(update.package) {
            case 'node':
                updateNodeVersion(update.version);
                break;
            case 'typescript':
                updateTypeScriptVersion(update.version);
                break;
            case 'posthog-js':
                updatePosthogJsVersion(update.version);
                break;
            case 'undici':
                updateUndiciVersion(update.version);
                break;
            default:
                console.log(`Update for ${update.package} not implemented yet`);
        }
    });
}

// Add a function to check dependency status
function checkDependencyStatus() {
    // Implementation to check current dependency status
    return {
        node: '24.19.0',
        typescript: '7.0.0',
        'posthog-js': '1.413.3',
        undici: '8.9.0'
    };
}

// New function added to the main.js file
function newFeatureFunction() {
  // Function implementation would go here
}

// Extend exports with dependency management and new features
Object.assign(module.exports, {
    updateNodeVersion,
    updateTypeScriptVersion,
    updatePosthogJsVersion,
    updateUndiciVersion,
    handleDependencyUpdates,
    checkDependencyStatus,
    newFeatureFunction
});