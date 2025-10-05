import React, { useState } from 'react';
import { useGame } from '../hooks/GameContext';

export default function GameBoard() {
  const { secretWord, setSecretWord, players, masterIndex, playerName, proposals, proposeWord, connections, connectWord, roundActive } = useGame();
  const [input, setInput] = useState('');
  const [proposalInput, setProposalInput] = useState('');
  const [connectInput, setConnectInput] = useState('');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const isMaster = players[masterIndex]?.name === playerName;

  // Only Master can set the secret word
  const handleSetSecretWord = () => {
    if (input.trim() && isMaster) {
      setSecretWord(input.trim());
      setInput('');
    }
  };

  // Track revealed letters
  const [revealedCount, setRevealedCount] = useState(1); // Start with first letter revealed

  // Only Master sees the full secret word
  let displayWord = '';
  if (isMaster) {
    displayWord = secretWord;
  } else if (secretWord) {
    // Only show revealed letters, hide word size
    displayWord = secretWord
      .split('')
      .filter((ch, idx) => idx < revealedCount)
      .join('');
  } else {
    displayWord = '(Secret word hidden)';
  }

  // Award points to a player
  const awardPoints = (targetName) => {
    if (targetName) {
      // TODO: Implement backend sync for points
      console.log(`Awarded 10 points to ${targetName}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <h1 className="text-3xl font-bold mb-4">Game Board</h1>
      <div className="mb-4 p-4 bg-white rounded shadow">
        <span className="text-lg font-semibold">Secret Word: <span className="text-blue-600">{displayWord}</span></span>
      </div>
      {isMaster ? (
        <div className="flex flex-col gap-2 w-full max-w-md mb-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="Enter the secret word..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={!roundActive}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow" onClick={handleSetSecretWord} disabled={!roundActive}>
            Set Secret Word
          </button>
          {!roundActive && (
            <span className="text-red-500 text-sm mt-2">Start the round to set the secret word.</span>
          )}
          {/* Master awards self points when guessing parallel word */}
          <button className="bg-purple-600 text-white px-4 py-2 rounded shadow mt-4" onClick={() => awardPoints(playerName)} disabled={!roundActive}>
            I guessed the parallel word (+10 points)
          </button>
        </div>
      ) : null}

      {/* Connect UI for participants: select who you connected with and award points, reveal next letter */}
      {!isMaster && roundActive && (
        <div className="flex flex-col gap-2 w-full max-w-md mb-4">
          <label className="mb-2">Select who you connected with:</label>
          <select
            className="border rounded px-3 py-2"
            value={selectedProposal || ''}
            onChange={e => setSelectedProposal(e.target.value)}
          >
            <option value="">Choose a player</option>
            {players.filter(p => p.name !== playerName).map((p, idx) => (
              <option key={idx} value={p.name}>{p.name}</option>
            ))}
          </select>
          <button className="bg-green-600 text-white px-4 py-2 rounded shadow" onClick={() => {
            if (selectedProposal) {
              awardPoints(selectedProposal);
              setSelectedProposal(null);
              // Reveal next letter
              setRevealedCount(c => Math.min(c + 1, secretWord.length));
            }
          }}>
            Connect (+10 points)
          </button>
        </div>
      )}

      {/* Guess field for participants to guess the master word */}
      {!isMaster && roundActive && (
        <div className="flex flex-col gap-2 w-full max-w-md mb-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="Guess the master's word..."
            value={proposalInput}
            onChange={e => setProposalInput(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow" onClick={() => {
            if (proposalInput.trim().toLowerCase() === secretWord.toLowerCase()) {
              awardPoints(playerName, 20); // Win 20 points for correct guess
              alert('Correct! You win 20 points!');
            } else {
              alert('Incorrect guess.');
            }
            setProposalInput('');
          }}>
            Guess Master Word (+20 points)
          </button>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Scoreboard</h2>
        <ul className="bg-white rounded shadow p-4">
          {players.map((p, idx) => (
            <li key={idx}>{p.name}: {p.score || 0} pts</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
  // Award points to a player
  // Award points to a player
  const awardPoints = (targetName, points = 10) => {
    if (targetName) {
      // TODO: Implement backend sync for points
      console.log(`Awarded ${points} points to ${targetName}`);
    }
  };
