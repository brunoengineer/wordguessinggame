import ScoreTable from '../components/ScoreTable';

const mockScores = [
  { name: 'Alice', score: 25 },
  { name: 'Bob', score: 15 },
  { name: 'Carol', score: 10 },
];

export default function Scoreboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
      <h1 className="text-3xl font-bold mb-4">Scoreboard</h1>
      <ScoreTable scores={mockScores} />
    </div>
  );
}
