
import PlayerList from '../components/PlayerList';
import { useGame } from '../hooks/GameContext';
import { useState } from 'react';

export default function Lobby() {
  const { players, masterIndex, setMaster, roundActive, startRound, socketStatus, roomId, playerName, joinRoom, leaveRoom } = useGame();
  const [roomInput, setRoomInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  const handleJoinRoom = () => {
    if (roomInput.trim() && nameInput.trim()) {
      joinRoom(roomInput.trim(), nameInput.trim());
    }
  };
  const handleLeaveRoom = () => {
    leaveRoom();
    setRoomInput('');
    setNameInput('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-purple-100 to-green-200">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold mb-6 text-blue-700 drop-shadow">Lobby</h1>
        <div className="mb-4 text-base text-gray-700">Socket status: <span className={socketStatus === 'connected' ? 'text-green-600' : socketStatus === 'error' ? 'text-yellow-600' : 'text-red-600'}>{socketStatus}</span></div>
        {!roomId ? (
          <div className="flex flex-col items-center mb-4 w-full">
            <input
              className="border-2 border-blue-300 rounded-lg px-4 py-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Room code..."
              value={roomInput}
              onChange={e => setRoomInput(e.target.value)}
            />
            <input
              className="border-2 border-blue-300 rounded-lg px-4 py-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your name..."
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
            />
            <button className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition mb-2 w-full" onClick={handleJoinRoom}>
              Join/Create Room
            </button>
          </div>
        ) : (
          <>
            <div className="mb-2 text-lg font-semibold text-blue-800">Room: {roomId}</div>
            <div className="mb-2 text-lg font-semibold text-green-700">You: {playerName}</div>
            <PlayerList players={players} />
            <div className="mb-4 w-full flex flex-col items-center">
              <label className="font-semibold mr-2 text-purple-700">Select Master:</label>
              <select
                className="border-2 border-purple-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={masterIndex}
                onChange={e => setMaster(Number(e.target.value))}
              >
                {players.map((p, idx) => (
                  <option key={idx} value={idx}>{p.name}</option>
                ))}
              </select>
            </div>
            {/* Only show Start Game button if round hasn't started yet */}
            {!roundActive && (
              <button
                className="bg-green-600 text-white font-bold px-6 py-2 rounded-lg shadow-lg hover:bg-green-700 transition mb-2 w-full"
                onClick={startRound}
              >
                Start Game
              </button>
            )}
            <button className="bg-gray-400 text-white font-bold px-6 py-2 rounded-lg shadow-lg hover:bg-gray-600 transition mt-2 w-full" onClick={handleLeaveRoom}>
              Leave Room
            </button>
          </>
        )}
      </div>
    </div>
  );
}
