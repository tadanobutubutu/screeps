const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const { v4: uuidV4 } = require('uuid');

// Mock database for demonstration - replace with actual database integration
class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(userId, videoUrl, subtitleUrl, config = {}) {
    const roomId = uuidV4();
    const room = {
      id: roomId,
      hostId: userId,
      videoUrl,
      subtitleUrl,
      currentTime: 0,
      isPlaying: false,
      participants: [userId],
      createdAt: new Date(),
      config: {
        maxParticipants: config.maxParticipants || 10,
        requireApproval: config.requireApproval || false,
        allowPublicViewing: config.allowPublicViewing !== false,
        customCSS: config.customCSS || null,
        customLogo: config.customLogo || null,
        chatEnabled: config.chatEnabled !== false,
        chatModeration: config.chatModeration || 'anyone',
        ...config
      },
      chatMessages: [],
      bannedUsers: new Set()
    };
    this.rooms.set(roomId, room);
    return { roomId, room };
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  getAllRooms() {
    return Array.from(this.rooms.values());
  }

  joinRoom(roomId, userId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.participants.includes(userId)) {
      return { success: true, room, message: 'Already in room' };
    }

    if (room.participants.length >= room.config.maxParticipants) {
      return { success: false, message: 'Room is full' };
    }

    if (room.bannedUsers.has(userId)) {
      return { success: false, message: 'You are banned from this room' };
    }

    room.participants.push(userId);
    return { success: true, room, message: 'Joined successfully' };
  }

  leaveRoom(roomId, userId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    const index = room.participants.indexOf(userId);
    if (index > -1) {
      room.participants.splice(index, 1);
    }

    if (room.participants.length === 0) {
      this.rooms.delete(roomId);
    }

    return { success: true };
  }

  updatePlaybackState(roomId, userId, state) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.hostId !== userId) {
      throw new Error('Only the host can control playback');
    }

    if (state.currentTime !== undefined) {
      room.currentTime = state.currentTime;
    }
    if (state.isPlaying !== undefined) {
      room.isPlaying = state.isPlaying;
    }

    return room;
  }

  addChatMessage(roomId, userId, message) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (!room.config.chatEnabled) {
      throw new Error('Chat is disabled in this room');
    }

    const chatMessage = {
      id: uuidV4(),
      userId,
      message,
      timestamp: new Date()
    };

    room.chatMessages.push(chatMessage);
    return chatMessage;
  }

  banUser(roomId, hostId, userIdToBan) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.hostId !== hostId) {
      throw new Error('Only the host can ban users');
    }

    room.bannedUsers.add(userIdToBan);
    
    // Also remove from participants
    const index = room.participants.indexOf(userIdToBan);
    if (index > -1) {
      room.participants.splice(index, 1);
    }

    return { success: true };
  }

  unbanUser(roomId, hostId, userIdToUnban) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.hostId !== hostId) {
      throw new Error('Only the host can unban users');
    }

    room.bannedUsers.delete(userIdToUnban);
    return { success: true };
  }

  deleteRoom(roomId, userId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.hostId !== userId) {
      throw new Error('Only the host can delete the room');
    }

    this.rooms.delete(roomId);
    return { success: true };
  }
}

class SyncServer {
  constructor(port = 3000) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server(this.server);
    this.roomManager = new RoomManager();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupSocketHandlers();
  }

  setupMiddleware() {
    this.app.use(express.json());
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok' });
    });

    // Room management endpoints
    this.app.post('/api/rooms', (req, res) => {
      try {
        const { userId, videoUrl, subtitleUrl, config } = req.body;
        const result = this.roomManager.createRoom(userId, videoUrl, subtitleUrl, config);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.get('/api/rooms', (req, res) => {
      res.json({ rooms: this.roomManager.getAllRooms() });
    });

    this.app.get('/api/rooms/:roomId', (req, res) => {
      try {
        const room = this.roomManager.getRoom(req.params.roomId);
        if (!room) {
          return res.status(404).json({ error: 'Room not found' });
        }
        res.json({ room });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.delete('/api/rooms/:roomId', (req, res) => {
      try {
        const userId = req.headers['x-user-id'];
        this.roomManager.deleteRoom(req.params.roomId, userId);
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('join-room', ({ roomId, userId }) => {
        socket.join(roomId);
        const result = this.roomManager.joinRoom(roomId, userId);
        
        if (result.success) {
          socket.to(roomId).emit('user-joined', { userId, participants: this.roomManager.getRoom(roomId).participants });
        }
        socket.emit('join-result', result);
      });

      socket.on('leave-room', ({ roomId, userId }) => {
        socket.leave(roomId);
        const result = this.roomManager.leaveRoom(roomId, userId);
        socket.to(roomId).emit('user-left', { userId });
      });

      socket.on('sync-playback', ({ roomId, userId, state }) => {
        try {
          const updatedRoom = this.roomManager.updatePlaybackState(roomId, userId, state);
          socket.to(roomId).emit('playback-sync', updatedRoom);
        } catch (error) {
          socket.emit('sync-error', { error: error.message });
        }
      });

      socket.on('chat-message', ({ roomId, userId, message }) => {
        try {
          const chatMessage = this.roomManager.addChatMessage(roomId, userId, message);
          this.io.to(roomId).emit('new-chat-message', chatMessage);
        } catch (error) {
          socket.emit('chat-error', { error: error.message });
        }
      });

      socket.on('kick-user', ({ roomId, hostId, userIdToKick }) => {
        try {
          this.roomManager.banUser(roomId, hostId, userIdToKick);
          this.io.to(roomId).emit('user-kicked', { userId: userIdToKick });
        } catch (error) {
          socket.emit('kick-error', { error: error.message });
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }

  start() {
    this.server.listen(3000, () => {
      console.log('Sync Server running on port 3000');
    });
  }
}

module.exports = { RoomManager, SyncServer };

// Start server if run directly
if (require.main === module) {
  const server = new SyncServer();
  server.start();
}