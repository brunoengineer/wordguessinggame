import ScoreTable from '../components/ScoreTable';
import { useGame } from '../hooks/GameContext';

export default function Scoreboard() {
  const { scores } = useGame();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
      <h1 className="text-3xl font-bold mb-4">Scoreboard</h1>
      <ScoreTable scores={scores} />
    </div>
  );
}
