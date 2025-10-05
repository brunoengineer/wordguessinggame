import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [players, setPlayers] = useState([
    { name: 'Alice', isMaster: true },
    { name: 'Bob', isMaster: false },
    { name: 'Carol', isMaster: false },
  ]);
  const [scores, setScores] = useState([
    { name: 'Alice', score: 25 },
    { name: 'Bob', score: 15 },
    { name: 'Carol', score: 10 },
  ]);
  const [secretWord, setSecretWord] = useState('C _ _ _ _');
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
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Helper to set Master by index
  const setMaster = (idx) => {
    setPlayers(players.map((p, i) => ({ ...p, isMaster: i === idx })));
    setMasterIndex(idx);
  };

  // Start a new round
  const startRound = () => {
    setRoundActive(true);
    setSecretWord(''); // Reset secret word for new round
  };

  // End the current round
  const endRound = () => {
    setRoundActive(false);
  };

  return (
    <GameContext.Provider value={{ players, setPlayers, scores, setScores, secretWord, setSecretWord, masterIndex, setMaster, roundActive, startRound, endRound, socketStatus, socketRef }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
