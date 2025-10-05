import ScoreTable from '../components/ScoreTable';
import { useGame } from '../hooks/GameContext';
import { useState } from 'react';

export default function Scoreboard() {
  const { scores, setScores } = useGame();
  const [playerName, setPlayerName] = useState('');
  const [score, setScore] = useState('');

  const handleAddScore = () => {
    if (playerName.trim() && !isNaN(Number(score))) {
      setScores([...scores, { name: playerName, score: Number(score) }]);
      setPlayerName('');
      setScore('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
      <h1 className="text-3xl font-bold mb-4">Scoreboard</h1>
      <ScoreTable scores={scores} />
      <div className="flex gap-2 mt-4">
        <input
          className="border rounded px-3 py-2"
          placeholder="Player name..."
          value={playerName}
          onChange={e => setPlayerName(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Score..."
          value={score}
          onChange={e => setScore(e.target.value)}
        />
        <button className="bg-yellow-600 text-white px-4 py-2 rounded shadow" onClick={handleAddScore}>
          Add Score
        </button>
      </div>
    </div>
  );
}
