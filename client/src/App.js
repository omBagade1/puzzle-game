import React, { useState } from 'react';
import Home from './pages/Home';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import './App.css';

export default function App() {
  const [page, setPage] = useState('home');
  const [gameConfig, setGameConfig] = useState(null);

  const startGame = (config) => {
    setGameConfig(config);
    setPage('game');
  };

  return (
    <div className="app">
      <nav className="navbar">
        <button className="logo" onClick={() => setPage('home')}>
          PUZZLE<span className="logo-sub">_9</span>
        </button>
        <div className="nav-links">
          <button className={page === 'home' ? 'nav-btn active' : 'nav-btn'} onClick={() => setPage('home')}>HOME</button>
          <button className={page === 'leaderboard' ? 'nav-btn active' : 'nav-btn'} onClick={() => setPage('leaderboard')}>LEADERBOARD</button>
        </div>
      </nav>

      <main className="main-content">
        {page === 'home'        && <Home onStart={startGame} />}
        {page === 'game'        && <Game config={gameConfig} onBack={() => setPage('home')} onLeaderboard={() => setPage('leaderboard')} />}
        {page === 'leaderboard' && <Leaderboard onBack={() => setPage('home')} />}
      </main>
    </div>
  );
}
