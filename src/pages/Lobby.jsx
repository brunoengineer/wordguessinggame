
import PlayerList from '../components/PlayerList';
import { useGame } from '../hooks/GameContext';
import { useState } from 'react';

export default function Lobby() {
  const { players, masterIndex, setMaster, roundActive, startRound, endRound, socketStatus, roomId, playerName, joinRoom, leaveRoom } = useGame();
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <h1 className="text-3xl font-bold mb-4">Lobby</h1>
      <div className="mb-2 text-sm text-gray-600">Socket status: <span className={socketStatus === 'connected' ? 'text-green-600' : socketStatus === 'error' ? 'text-yellow-600' : 'text-red-600'}>{socketStatus}</span></div>
      {!roomId ? (
        <div className="flex flex-col items-center mb-4">
          <input
            className="border rounded px-3 py-2 mb-2"
            placeholder="Room code..."
            value={roomInput}
            onChange={e => setRoomInput(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2 mb-2"
            placeholder="Your name..."
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow" onClick={handleJoinRoom}>
            Join/Create Room
          </button>
        </div>
      ) : (
        <>
          <div className="mb-2 text-lg font-semibold">Room: {roomId}</div>
          <div className="mb-2 text-lg font-semibold">You: {playerName}</div>
          <PlayerList players={players} />
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
          {/* Only show Start Game button if round hasn't started yet */}
          {!roundActive && (
            <button
              className="bg-green-600 text-white px-4 py-2 rounded shadow mb-2"
              onClick={startRound}
            >
              Start Game
            </button>
          )}
          <button className="bg-gray-400 text-white px-4 py-2 rounded shadow mt-2" onClick={handleLeaveRoom}>
            Leave Room
          </button>
        </>
      )}
    </div>
  );
}
