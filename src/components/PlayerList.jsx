export default function PlayerList({ players }) {
  return (
    <ul className="mb-4">
      {players.map((player, idx) => (
        <li key={idx} className="py-1 px-2 rounded bg-white shadow mb-2 text-gray-800">
          {player.name} {player.isMaster && <span className="text-blue-500">(Master)</span>}
        </li>
      ))}
    </ul>
  );
}
