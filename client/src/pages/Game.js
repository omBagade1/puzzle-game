import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { getTileBackground } from '../components/ImagePicker';
import './Game.css';

const SIZE = 3;
const TOTAL = SIZE * SIZE; // 9
const SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // 0 = blank

const isSolved = (tiles) => tiles.every((v, i) => v === SOLVED[i]);

const getValidMoves = (emptyIdx) => {
  const r = Math.floor(emptyIdx / SIZE);
  const c = emptyIdx % SIZE;
  const moves = [];
  if (r > 0)        moves.push(emptyIdx - SIZE); // tile above can slide down
  if (r < SIZE - 1) moves.push(emptyIdx + SIZE); // tile below can slide up
  if (c > 0)        moves.push(emptyIdx - 1);    // tile left can slide right
  if (c < SIZE - 1) moves.push(emptyIdx + 1);    // tile right can slide left
  return moves;
};

// Generate solvable shuffle via random moves from solved state
const shuffleTiles = () => {
  let tiles = [...SOLVED];
  let emptyIdx = tiles.indexOf(0);
  let prev = -1;
  for (let i = 0; i < 300; i++) {
    const moves = getValidMoves(emptyIdx).filter((m) => m !== prev);
    const next = moves[Math.floor(Math.random() * moves.length)];
    prev = emptyIdx;
    [tiles[emptyIdx], tiles[next]] = [tiles[next], tiles[emptyIdx]];
    emptyIdx = next;
  }
  return tiles;
};

const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export default function Game({ config, onBack, onLeaderboard }) {
  const { playerName, imageSource } = config;

  const [tiles, setTiles]       = useState(() => shuffleTiles());
  const [moves, setMoves]       = useState(0);
  const [time, setTime]         = useState(0);
  const [won, setWon]           = useState(false);
  const [flash, setFlash]       = useState(null); // index that just moved
  const [submitting, setSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef(null);

  // Timer
  useEffect(() => {
    if (!won) {
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [won]);

  const moveTile = useCallback((idx) => {
    if (won) return;
    const emptyIdx = tiles.indexOf(0);
    if (!getValidMoves(emptyIdx).includes(idx)) return;

    setFlash(idx);
    setTimeout(() => setFlash(null), 120);

    setTiles((prev) => {
      const next = [...prev];
      [next[emptyIdx], next[idx]] = [next[idx], next[emptyIdx]];
      if (isSolved(next)) {
        clearInterval(timerRef.current);
        setWon(true);
      }
      return next;
    });
    setMoves((m) => m + 1);
  }, [tiles, won]);

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      const emptyIdx = tiles.indexOf(0);
      const r = Math.floor(emptyIdx / SIZE);
      const c = emptyIdx % SIZE;
      const map = {
        ArrowUp:    r < SIZE - 1 ? emptyIdx + SIZE : null,
        ArrowDown:  r > 0        ? emptyIdx - SIZE : null,
        ArrowLeft:  c < SIZE - 1 ? emptyIdx + 1   : null,
        ArrowRight: c > 0        ? emptyIdx - 1   : null,
      };
      const target = map[e.key];
      if (target != null) { e.preventDefault(); moveTile(target); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [moveTile, tiles]);

  const reset = () => {
    setTiles(shuffleTiles());
    setMoves(0);
    setTime(0);
    setWon(false);
    setSubmitted(false);
    setSubmit(false);
  };

  const saveScore = async () => {
    setSubmit(true);
    try {
      await axios.post('/api/scores', {
        playerName, moves, time,
        puzzleType: imageSource.type === 'image' ? 'custom' : imageSource.id,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
    setSubmit(false);
  };

  const emptyIdx = tiles.indexOf(0);

  return (
    <div className="game-page">
      {/* Header */}
      <div className="gp-header">
        <button className="pill-btn" onClick={onBack}>← BACK</button>
        <span className="gp-player">{playerName}</span>
        <span className="gp-source">
          {imageSource.type === 'image' ? `📷 ${imageSource.label}` : imageSource.label}
        </span>
      </div>

      <div className="gp-layout">
        {/* Sidebar stats */}
        <aside className="gp-stats">
          <div className="stat">
            <span className="stat-lbl">MOVES</span>
            <span className="stat-val moves-val">{moves}</span>
          </div>
          <div className="stat">
            <span className="stat-lbl">TIME</span>
            <span className="stat-val time-val">{fmt(time)}</span>
          </div>
          <div className="stat">
            <span className="stat-lbl">STATUS</span>
            <span className={`stat-val status-val ${won ? 'solved' : ''}`}>
              {won ? 'SOLVED!' : 'ACTIVE'}
            </span>
          </div>

          {/* Mini solved reference */}
          <div className="reference">
            <span className="stat-lbl">TARGET ORDER</span>
            <div className="ref-grid">
              {SOLVED.map((n, i) => (
                <div
                  key={i}
                  className={`ref-cell ${n === 0 ? 'ref-empty' : ''}`}
                  style={n !== 0 ? getTileBackground(
                    /* map tile value (1-8) to its solved position index */
                    SOLVED.indexOf(n), imageSource
                  ) : {}}
                >
                  {n !== 0 && <span className="ref-num">{n}</span>}
                </div>
              ))}
            </div>
          </div>

          <button className="pill-btn reset" onClick={reset}>↺ SHUFFLE</button>
          <p className="kbd-hint">Arrow keys work too</p>
        </aside>

        {/* Board */}
        <div className="board-wrap">
          <div className="board">
            {tiles.map((tile, idx) => {
              const isEmpty  = tile === 0;
              const canMove  = !isEmpty && getValidMoves(emptyIdx).includes(idx);
              const flashing = flash === idx;

              // For the visual background, we always show where this tile BELONGS in the
              // solved image — i.e. tile value 1 = position 0, tile value 2 = position 1…
              const solvedPos = isEmpty ? -1 : tile - 1; // 0-indexed position in image

              return (
                <div
                  key={idx}
                  className={[
                    'tile',
                    isEmpty  ? 'tile-empty'   : '',
                    canMove  ? 'tile-movable'  : '',
                    flashing ? 'tile-flash'   : '',
                  ].join(' ')}
                  onClick={() => moveTile(idx)}
                  style={!isEmpty ? {
                    ...getTileBackground(solvedPos, imageSource),
                  } : {}}
                >
                  {!isEmpty && (
                    <>
                      <span className="tile-num">{tile}</span>
                      <div className="tile-gloss" />
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Win overlay */}
          {won && (
            <div className="win-overlay">
              <div className="win-card">
                <p className="win-emoji">🎉</p>
                <h2 className="win-heading">PUZZLE SOLVED</h2>
                <div className="win-stats">
                  <div><span>MOVES</span><strong>{moves}</strong></div>
                  <div><span>TIME</span><strong>{fmt(time)}</strong></div>
                </div>
                {!submitted
                  ? <button className="save-btn" onClick={saveScore} disabled={submitting}>
                      {submitting ? 'SAVING…' : 'SAVE SCORE'}
                    </button>
                  : <p className="saved-ok">✓ Score saved!</p>
                }
                <div className="win-actions">
                  <button className="pill-btn" onClick={reset}>PLAY AGAIN</button>
                  <button className="pill-btn gold" onClick={onLeaderboard}>LEADERBOARD</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
