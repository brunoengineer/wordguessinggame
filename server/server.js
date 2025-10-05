// Basic Express server setup for Connect & Guess game
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
});

app.get('/', (req, res) => {
  res.send('Connect & Guess backend is running!');
});

// In-memory game rooms
const rooms = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a room
  socket.on('joinRoom', ({ roomId, player }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = { players: [], state: {} };
    }
    rooms[roomId].players.push(player);
    socket.join(roomId);
    io.to(roomId).emit('roomUpdate', rooms[roomId]);
    console.log(`Player ${player.name} joined room ${roomId}`);
  });

  // Leave a room
  socket.on('leaveRoom', ({ roomId, playerName }) => {
    if (rooms[roomId]) {
      rooms[roomId].players = rooms[roomId].players.filter(p => p.name !== playerName);
      socket.leave(roomId);
      io.to(roomId).emit('roomUpdate', rooms[roomId]);
      console.log(`Player ${playerName} left room ${roomId}`);
    }
  });

  // Sync game state (e.g., set word, update scores)
  socket.on('updateState', ({ roomId, state }) => {
    if (rooms[roomId]) {
      rooms[roomId].state = { ...rooms[roomId].state, ...state };
      io.to(roomId).emit('roomUpdate', rooms[roomId]);
      console.log(`Room ${roomId} state updated`);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Optionally: remove player from all rooms
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
