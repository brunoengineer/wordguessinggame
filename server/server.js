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

  // Propose a word
  socket.on('proposeWord', ({ roomId, playerName, word }) => {
    if (rooms[roomId]) {
      if (!rooms[roomId].state.proposals) rooms[roomId].state.proposals = [];
      rooms[roomId].state.proposals.push({ playerName, word });
      io.to(roomId).emit('roomUpdate', rooms[roomId]);
      console.log(`Player ${playerName} proposed word '${word}' in room ${roomId}`);
    }
  });

  // Connect response
  socket.on('connectWord', ({ roomId, playerName, connectWord }) => {
    if (rooms[roomId]) {
      if (!rooms[roomId].state.connections) rooms[roomId].state.connections = [];
      rooms[roomId].state.connections.push({ playerName, connectWord });
      io.to(roomId).emit('roomUpdate', rooms[roomId]);
      console.log(`Player ${playerName} connected with '${connectWord}' in room ${roomId}`);
    }
  });

  // Update score
  socket.on('updateScore', ({ roomId, playerName, score }) => {
    if (rooms[roomId]) {
      if (!rooms[roomId].state.scores) rooms[roomId].state.scores = [];
      const idx = rooms[roomId].state.scores.findIndex(s => s.name === playerName);
      if (idx >= 0) {
        rooms[roomId].state.scores[idx].score = score;
      } else {
        rooms[roomId].state.scores.push({ name: playerName, score });
      }
      io.to(roomId).emit('roomUpdate', rooms[roomId]);
      console.log(`Score updated for ${playerName} in room ${roomId}`);
    }
  });

  // Reveal next letter
  socket.on('revealLetter', ({ roomId, letter }) => {
    if (rooms[roomId]) {
      if (!rooms[roomId].state.revealedLetters) rooms[roomId].state.revealedLetters = [];
      rooms[roomId].state.revealedLetters.push(letter);
      io.to(roomId).emit('roomUpdate', rooms[roomId]);
      console.log(`Letter '${letter}' revealed in room ${roomId}`);
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
