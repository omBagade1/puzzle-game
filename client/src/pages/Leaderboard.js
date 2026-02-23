import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Leaderboard.css';

const MEDALS = ['🥇', '🥈', '🥉'];
const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
const fmtDate = (d) => new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'2-digit'});
const fmtType = (t) => {
  if (!t || t === 'custom') return '📷 Custom';
  return t.replace('theme_','').replace(/^\w/,c=>c.toUpperCase());
};

export default function Leaderboard({ onBack }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    axios.get('/api/scores')
      .then(r => { setScores(r.data); setLoading(false); })
      .catch(() => { setErr('Could not reach server.'); setLoading(false); });
  }, []);

  return (
    <div className="lb-page">
      <div className="lb-top">
        <button className="pill-btn" onClick={onBack}>← BACK</button>
        <div>
          <p className="lb-eyebrow">// HALL OF FAME</p>
          <h2 className="lb-title">LEADERBOARD</h2>
        </div>
      </div>

      {loading && <div className="lb-status"><span className="spinner" /> LOADING…</div>}
      {err     && <div className="lb-error">⚠ {err}</div>}
      {!loading && !err && scores.length === 0 && (
        <div className="lb-empty">No scores yet. Be the first to solve the puzzle!</div>
      )}

      {!loading && scores.length > 0 && (
        <div className="lb-table">
          <div className="lb-thead">
            <span>RANK</span><span>PLAYER</span><span>MOVES</span>
            <span>TIME</span><span>PUZZLE</span><span>DATE</span>
          </div>
          {scores.map((s, i) => (
            <div key={s._id} className={`lb-row ${i < 3 ? `top-${i+1}` : ''}`}>
              <span className="lb-rank">{MEDALS[i] ?? `#${i+1}`}</span>
              <span className="lb-name">{s.playerName}</span>
              <span className="lb-moves">{s.moves}</span>
              <span className="lb-time">{fmt(s.time)}</span>
              <span className="lb-type">{fmtType(s.puzzleType)}</span>
              <span className="lb-date">{fmtDate(s.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
