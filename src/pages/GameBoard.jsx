import { useGame } from '../hooks/GameContext';
import { useState } from 'react';

export default function GameBoard() {
  const { secretWord, setSecretWord, players, masterIndex, playerName } = useGame();
  const [input, setInput] = useState('');
  const isMaster = players[masterIndex]?.name === playerName;

  // Only Master can set the secret word
  const handleSetSecretWord = () => {
    if (input.trim() && isMaster) {
      setSecretWord(input.trim());
      setInput('');
    }
  };

  // Reveal logic for non-Master: show only first letter (and revealed letters)
  let displayWord = '';
  if (isMaster) {
    displayWord = secretWord;
  } else if (secretWord) {
    displayWord = secretWord[0] + ' ' + '_ '.repeat(secretWord.length - 1).trim();
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
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow" onClick={handleSetSecretWord}>
            Set Secret Word
          </button>
        </div>
      ) : null}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Connections</h2>
        <ul className="bg-white rounded shadow p-4">
          {/* TODO: Render proposals and connections here */}
        </ul>
      </div>
    </div>
  );
}
