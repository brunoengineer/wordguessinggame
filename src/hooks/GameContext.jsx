import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

const GameContext = createContext();

export function GameProvider({ children }) {
  // Award points to a player and sync with backend
  const awardPoints = (targetName, points = 10) => {
    if (!roomId || !targetName) return;
    // Find current score
    const currentScore = scores.find(s => s.name === targetName)?.score || 0;
    const newScore = currentScore + points;
    socketRef.current.emit('updateScore', { roomId, playerName: targetName, score: newScore });
  };
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState([]);
  const [secretWord, setSecretWord] = useState('');
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [masterIndex, setMasterIndex] = useState(0); // index of current Master
  const [roundActive, setRoundActive] = useState(false);
  const [revealedCount, setRevealedCount] = useState(1); // global revealed letter count
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
      setProposals(room.state?.proposals || []);
      setConnections(room.state?.connections || []);
      setRevealedCount(room.state?.revealedCount ?? 1);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, []);
  // Proposals and connections
  const [proposals, setProposals] = useState([]);
  const [connections, setConnections] = useState([]);

  const proposeWord = (word) => {
    if (roomId && playerName && word.trim()) {
      socketRef.current.emit('proposeWord', { roomId, playerName, word: word.trim() });
    }
  };

  const connectWord = (connectWord) => {
    if (roomId && playerName && connectWord.trim()) {
      socketRef.current.emit('connectWord', { roomId, playerName, connectWord: connectWord.trim() });
    }
  };

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

  // Reveal next letter for all
  const revealNextLetter = () => {
    const next = Math.min(revealedCount + 1, secretWord.length);
    setRevealedCount(next);
    syncState({ revealedCount: next });
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
      revealedCount, revealNextLetter,
      awardPoints,
      socketStatus, socketRef, roomId, playerName, joinRoom, leaveRoom,
      proposals, proposeWord, connections, connectWord
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
