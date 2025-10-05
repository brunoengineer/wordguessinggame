
import PlayerList from '../components/PlayerList';
import { useGame } from '../hooks/GameContext';
import { useState } from 'react';

export default function Lobby() {
  const { players, setPlayers, masterIndex, setMaster, roundActive, startRound, endRound } = useGame();
  const [newPlayer, setNewPlayer] = useState('');

  const handleAddPlayer = () => {
    if (newPlayer.trim()) {
      setPlayers([...players, { name: newPlayer, isMaster: false }]);
      setNewPlayer('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <h1 className="text-3xl font-bold mb-4">Lobby</h1>
      <PlayerList players={players} />
      <div className="flex gap-2 mb-4">
        <input
          className="border rounded px-3 py-2"
          placeholder="Add player name..."
          value={newPlayer}
          onChange={e => setNewPlayer(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow" onClick={handleAddPlayer}>
          Add Player
        </button>
      </div>
      <div className="mb-4">
        <label className="font-semibold mr-2">Select Master:</label>
        <select
          className="border rounded px-3 py-2"
          value={masterIndex}
          onChange={e => setMaster(Number(e.target.value))}
        >
          {players.map((p, idx) => (
            <option key={idx} value={idx}>{p.name}</option>
          ))}
        </select>
      </div>
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded shadow mb-2"
        onClick={startRound}
        disabled={roundActive}
      >
        Start Round
      </button>
      <button
        className="bg-red-600 text-white px-4 py-2 rounded shadow mb-2"
        onClick={endRound}
        disabled={!roundActive}
      >
        End Round
      </button>
    </div>
  );
}
