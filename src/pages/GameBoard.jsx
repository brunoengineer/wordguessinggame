export default function GameBoard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <h1 className="text-3xl font-bold mb-4">Game Board</h1>
      <div className="mb-4 p-4 bg-white rounded shadow">
        <span className="text-lg font-semibold">Secret Word: <span className="text-blue-600">C _ _ _ _</span></span>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-md">
        <input className="border rounded px-3 py-2" placeholder="Propose a word..." />
        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow">Send</button>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Connections</h2>
        <ul className="bg-white rounded shadow p-4">
          <li>Bob: connect - Cat</li>
          <li>Carol: connect - Car</li>
        </ul>
      </div>
    </div>
  );
}
