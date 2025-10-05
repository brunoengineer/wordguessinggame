import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Lobby from './pages/Lobby';
import GameBoard from './pages/GameBoard';
// ...existing code...

function App() {
  return (
    <Router>
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center">
          <nav className="custom-nav">
            <Link to="/" className="custom-nav-link">Lobby</Link>
            <Link to="/game" className="custom-nav-link">Game Board</Link>
          </nav>
          <div className="w-full">
            <Routes>
              <Route path="/" element={<Lobby />} />
              <Route path="/game" element={<GameBoard />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
