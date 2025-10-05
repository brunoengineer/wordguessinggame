import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState([]);
  const [secretWord, setSecretWord] = useState('');
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [masterIndex, setMasterIndex] = useState(0); // index of current Master
  const [roundActive, setRoundActive] = useState(false);
  const [socketStatus, setSocketStatus] = useState('disconnected');
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:4000', {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      timeout: 2000,
    });
    socketRef.current.on('connect', () => {
      setSocketStatus('connected');
      console.log('Socket connected:', socketRef.current.id);
    });
    socketRef.current.on('disconnect', (reason) => {
      setSocketStatus('disconnected');
      console.log('Socket disconnected:', reason);
    });
    socketRef.current.on('connect_error', (err) => {
      setSocketStatus('error');
      console.error('Socket connection error:', err.message);
    });
    socketRef.current.on('roomUpdate', (room) => {
      setPlayers(room.players || []);
      setScores(room.state?.scores || []);
      setSecretWord(room.state?.secretWord || '');
      setMasterIndex(room.state?.masterIndex ?? 0);
      setRoundActive(room.state?.roundActive ?? false);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Join a room
  const joinRoom = (roomId, playerName) => {
    setRoomId(roomId);
    setPlayerName(playerName);
    socketRef.current.emit('joinRoom', { roomId, player: { name: playerName, isMaster: false } });
  };

  // Leave a room
  const leaveRoom = () => {
    socketRef.current.emit('leaveRoom', { roomId, playerName });
    setRoomId('');
    setPlayerName('');
    setPlayers([]);
    setScores([]);
    setSecretWord('');
    setMasterIndex(0);
    setRoundActive(false);
  };

  // Sync game state to backend
  const syncState = (state) => {
    if (roomId) {
      socketRef.current.emit('updateState', { roomId, state });
    }
  };

  // Helper to set Master by index
  const setMaster = (idx) => {
    setPlayers(players.map((p, i) => ({ ...p, isMaster: i === idx })));
    setMasterIndex(idx);
    syncState({ masterIndex: idx });
  };

  // Start a new round
  const startRound = () => {
    setRoundActive(true);
    setSecretWord('');
    syncState({ roundActive: true, secretWord: '' });
  };

  // End the current round
  const endRound = () => {
    setRoundActive(false);
    syncState({ roundActive: false });
  };

  return (
    <GameContext.Provider value={{
      players, setPlayers, scores, setScores, secretWord, setSecretWord: (word) => { setSecretWord(word); syncState({ secretWord: word }); },
      masterIndex, setMaster, roundActive, startRound, endRound,
      socketStatus, socketRef, roomId, playerName, joinRoom, leaveRoom
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
