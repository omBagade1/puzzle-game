import React, { useRef, useState } from 'react';
import './ImagePicker.css';

// Built-in gradient themes (no image needed)
export const THEMES = [
  { id: 'theme_aurora',  label: 'Aurora',    type: 'theme', gradient: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 30%,#0f3460 60%,#533483 100%)' },
  { id: 'theme_fire',    label: 'Embers',    type: 'theme', gradient: 'linear-gradient(135deg,#1a0000 0%,#7f0000 40%,#e25822 70%,#f8c471 100%)' },
  { id: 'theme_ocean',   label: 'Deep Sea',  type: 'theme', gradient: 'linear-gradient(135deg,#0d0d0d 0%,#003366 40%,#006994 70%,#00b4d8 100%)' },
  { id: 'theme_forest',  label: 'Canopy',    type: 'theme', gradient: 'linear-gradient(135deg,#0a1a0a 0%,#1b4332 40%,#40916c 70%,#b7e4c7 100%)' },
];

// Returns the background-position for a tile index (0-8) in a 3x3 grid
export function getTileBackground(index, imageSource) {
  const col = index % 3;
  const row = Math.floor(index / 3);
  const posX = col * 50; // 0%, 50%, 100%
  const posY = row * 50; // 0%, 50%, 100%

  if (imageSource.type === 'theme') {
    return {
      background: imageSource.gradient,
      backgroundSize: '300% 300%',
      backgroundPosition: `${posX}% ${posY}%`,
    };
  }

  // Custom uploaded image (base64 URL)
  return {
    backgroundImage: `url(${imageSource.url})`,
    backgroundSize: '300% 300%',
    backgroundPosition: `${posX}% ${posY}%`,
  };
}

export default function ImagePicker({ value, onChange }) {
  const fileRef = useRef();
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const loadFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, GIF, WEBP).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Image must be under 8MB.');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange({ id: 'custom_' + Date.now(), type: 'image', label: file.name.replace(/\.[^.]+$/, ''), url: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => loadFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    loadFile(e.dataTransfer.files[0]);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        loadFile(item.getAsFile());
        break;
      }
    }
  };

  return (
    <div className="image-picker" onPaste={handlePaste}>
      {/* Built-in themes */}
      <div className="picker-section">
        <span className="picker-label">// BUILT-IN THEMES</span>
        <div className="themes-grid">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              className={`theme-card ${value?.id === theme.id ? 'selected' : ''}`}
              onClick={() => onChange(theme)}
            >
              <div className="theme-preview" style={{ background: theme.gradient }}>
                <div className="preview-grid-overlay">
                  {Array(9).fill(0).map((_, i) => <div key={i} className="preview-cell" />)}
                </div>
              </div>
              <span className="theme-label">{theme.label}</span>
              {value?.id === theme.id && <span className="sel-badge">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Upload zone */}
      <div className="picker-section">
        <span className="picker-label">// YOUR IMAGE</span>
        <div
          className={`drop-zone ${dragOver ? 'drag-over' : ''} ${value?.type === 'image' ? 'has-image' : ''}`}
          onClick={() => fileRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {value?.type === 'image' ? (
            <div className="upload-preview">
              <img src={value.url} alt="puzzle" />
              <div className="upload-preview-overlay">
                <span>↑ CLICK TO CHANGE</span>
              </div>
              {/* Show how it'll look sliced */}
              <div className="slice-preview">
                {Array(9).fill(0).map((_, i) => (
                  <div
                    key={i}
                    className="slice-cell"
                    style={{
                      backgroundImage: `url(${value.url})`,
                      backgroundSize: '300% 300%',
                      backgroundPosition: `${(i % 3) * 50}% ${Math.floor(i / 3) * 50}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="drop-placeholder">
              <div className="drop-icon">⊞</div>
              <p className="drop-main">Drop image here</p>
              <p className="drop-sub">or click to browse • paste with Ctrl+V</p>
              <p className="drop-formats">JPG · PNG · GIF · WEBP · max 8MB</p>
            </div>
          )}
        </div>
        {error && <p className="picker-error">⚠ {error}</p>}
        {value?.type === 'image' && (
          <p className="picker-filename">
            <span className="picker-check">✓</span> {value.label}
            <button className="clear-btn" onClick={(e) => { e.stopPropagation(); onChange(THEMES[0]); }}>✕ CLEAR</button>
          </p>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileInput} />
    </div>
  );
}
