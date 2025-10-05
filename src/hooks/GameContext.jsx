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

  return (
    <GameContext.Provider value={{ players, setPlayers, scores, setScores, secretWord, setSecretWord }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
