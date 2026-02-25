import React from 'react';
import './ImagePicker.css';

// Single puzzle image
export const PUZZLE_IMAGE = {
  id: 'puzzle_main',
  label: 'Puzzle Image',
  type: 'image',
  url: '/puzzle-image.jpeg'
};

// Returns the background-position for a tile index (0-8) in a 3x3 grid
export function getTileBackground(index, imageSource) {
  const col = index % 3;
  const row = Math.floor(index / 3);
  const posX = col * 50; // 0%, 50%, 100%
  const posY = row * 50; // 0%, 50%, 100%

  // Custom uploaded image (base64 URL)
  return {
    backgroundImage: `url(${imageSource.url})`,
    backgroundSize: '300% 300%',
    backgroundPosition: `${posX}% ${posY}%`,
  };
}

export default function ImagePicker() {
  return (
    <div className="image-picker">
      <div className="picker-section">
        <span className="picker-label">// PUZZLE IMAGE</span>
        <div className="slice-preview">
          {Array(9).fill(0).map((_, i) => (
            <div
              key={i}
              className="slice-cell"
              style={{
                backgroundImage: `url(${PUZZLE_IMAGE.url})`,
                backgroundSize: '300% 300%',
                backgroundPosition: `${(i % 3) * 50}% ${Math.floor(i / 3) * 50}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
