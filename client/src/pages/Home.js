import React, { useState } from 'react';
import ImagePicker, { PUZZLE_IMAGE } from '../components/ImagePicker';
import './Home.css';

export default function Home({ onStart }) {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleStart = () => {
    if (!playerName.trim()) {
      alert('Please enter your name first!');
      return;
    }
    onStart({ playerName: playerName.trim(), imageSource: PUZZLE_IMAGE });
  };

  return (
    <div className="home">
      <div className="home-hero">
        <p className="hero-eyebrow">// SLIDING PUZZLE GAME v2</p>
        <h1 className="hero-title">
          PUZZLE<br /><span className="hero-outline">THE IMAGE</span>
        </h1>
        <p className="hero-desc">
          Slide the pieces back together. A classic 3x3 sliding puzzle game.
        </p>
      </div>

      <div className="home-body">
        <div className="form-col">
          <div className="field">
            <label className="field-label">// YOUR NAME</label>
            <input
              className="field-input"
              type="text"
              placeholder="player_name"
              maxLength={20}
              value={playerName}
              onChange={(e) => { setPlayerName(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            />
            {error && <span className="field-error">{error}</span>}
          </div>

          <ImagePicker />

          <button className="start-btn" onClick={handleStart}>
            START PUZZLE →
          </button>

          <div className="instructions">
            <span className="instr-title">// HOW TO PLAY</span>
            <p>Click any tile next to the blank space to slide it. Use ← → ↑ ↓ arrow keys too. Get all 8 tiles back in order — numbers 1-8, left to right, top to bottom.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
