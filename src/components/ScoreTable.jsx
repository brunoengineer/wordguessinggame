export default function ScoreTable({ scores }) {
  return (
    <table className="min-w-full bg-white shadow rounded">
      <thead>
        <tr>
          <th className="py-2 px-4">Player</th>
          <th className="py-2 px-4">Score</th>
        </tr>
      </thead>
      <tbody>
        {scores.map((row, idx) => (
          <tr key={idx}>
            <td className="py-2 px-4">{row.name}</td>
            <td className="py-2 px-4">{row.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
