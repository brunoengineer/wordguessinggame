import React, { createContext, useContext, useState } from 'react';

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
    <GameContext.Provider value={{ players, setPlayers, scores, setScores, secretWord, setSecretWord, masterIndex, setMaster, roundActive, startRound, endRound }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
