import PlayerList from '../components/PlayerList';
import { useGame } from '../hooks/GameContext';

export default function Lobby() {
  const { players } = useGame();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <h1 className="text-3xl font-bold mb-4">Lobby</h1>
      <PlayerList players={players} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded shadow">Create Game</button>
      <button className="bg-green-600 text-white px-4 py-2 rounded shadow mt-2">Join Game</button>
    </div>
  );
}
