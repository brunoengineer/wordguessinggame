import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Lobby from './pages/Lobby';
import GameBoard from './pages/GameBoard';
import Scoreboard from './pages/Scoreboard';

function App() {
  return (
    <Router>
      <nav className="flex justify-center gap-4 p-4 bg-gray-100 shadow">
        <Link to="/" className="font-bold text-blue-600">Lobby</Link>
        <Link to="/game" className="font-bold text-green-600">Game Board</Link>
        <Link to="/scoreboard" className="font-bold text-yellow-600">Scoreboard</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/game" element={<GameBoard />} />
        <Route path="/scoreboard" element={<Scoreboard />} />
      </Routes>
    </Router>
  );
}

export default App;
