import React, { useState } from 'react';
import { useGame } from '../hooks/GameContext';

export default function GameBoard() {
  const { secretWord, setSecretWord, players, masterIndex, playerName, proposals, proposeWord, connections, connectWord, roundActive, revealedCount, revealNextLetter, awardPoints, scores } = useGame();
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
  // revealedCount is now global from context

  // Only Master sees the full secret word
  let displayWord = '';
  if (isMaster) {
    displayWord = secretWord;
  } else if (secretWord) {
    // Only show revealed letters, hide word size
    displayWord = secretWord
      .split('')
      .map((ch, idx) => idx < revealedCount ? ch : '')
      .join('');
  } else {
    displayWord = '(Secret word hidden)';
  }


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
            {players
              .filter((p, idx) => p.name !== playerName && idx !== masterIndex)
              .map((p, idx) => (
                <option key={idx} value={p.name}>{p.name}</option>
              ))}
          </select>
          <button className="bg-green-600 text-white px-4 py-2 rounded shadow" onClick={() => {
            if (selectedProposal) {
              awardPoints(playerName, 10); // Give points to self
              awardPoints(selectedProposal, 10); // Give points to connected participant
              setSelectedProposal(null);
              revealNextLetter();
            }
          }}>
            Connect (+10 points to both)
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
          {scores.map((s, idx) => (
            <li key={idx}>
              {s.name}: {s.score || 0} pts
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
  // Award points to a player
