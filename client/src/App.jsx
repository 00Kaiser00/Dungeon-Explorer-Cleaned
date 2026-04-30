import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import WelcomeScreen from './components/WelcomeScreen';
import Dashboard from './components/Dashboard';
import Music from './components/Music';

function App() {
  const [gameState, setGameState] = useState("general");
  return (
    <div className="min-h-screen flex items-center justify-center cursor-pointer text bg-cover"
      style={{ backgroundImage: "url('/Pixel Art/Tiles/Dungeon Tile.png')" }}
    >
      <Music gameState={gameState}/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/dashboard" element={<Dashboard setGameState={setGameState} />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
