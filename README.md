# 🧩 Puzzle_9 v2 — Image Sliding Puzzle (MERN)

A 9-piece sliding puzzle where **you play with your own photo**. Upload any image and it gets sliced into a 3×3 grid using pure CSS `background-position` magic — no canvas, no server upload needed.

## How the Image Slicing Works

Each tile receives:
```css
background-image: url(<base64 or URL>);
background-size: 300% 300%;   /* 3 cols × 3 rows = 300% */
background-position: 0% 0%;   /* top-left tile */
                     50% 0%;  /* top-center tile */
                    100% 0%;  /* top-right tile */
                     0% 50%;  /* mid-left tile */
                    ...etc
```
The tile number determines which slice of the image it displays. When solved, the whole image appears seamlessly. The blank tile (value 0) simply hides its background.

## Features
- 📷 Upload any JPG/PNG/GIF/WEBP (up to 8MB) — processed entirely client-side via FileReader API
- 🎨 4 built-in gradient themes if you don't have an image handy
- 🖼️ Live split-preview on the Home screen shows you exactly how your photo will look sliced
- ⌨️ Arrow key support
- ⏱️ Move counter + timer
- 🏆 Leaderboard via MongoDB

## Tech Stack
| | |
|---|---|
| Frontend | React 18 |
| Backend  | Express 4 |
| Database | MongoDB + Mongoose |

## Quick Start

```bash
cd puzzle-game-v2
cp .env.example .env         # set your MONGO_URI
npm run install-all          # installs server + client deps
npm run dev                  # http://localhost:3000
```

## Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Start both Express (5000) + React (3000) |
| `npm run build` | Build React for production |
| `npm start` | Serve everything from Express |
| `npm run install-all` | Install all dependencies |

## API
| Method | Route | Description |
|---|---|---|
| GET | `/api/scores` | Top 10 scores sorted by moves then time |
| POST | `/api/scores` | Submit a score `{playerName, moves, time, puzzleType}` |

## Deployment
Set these env vars: `MONGO_URI`, `NODE_ENV=production`  
Build cmd: `npm run install-all && npm run build`  
Start cmd: `npm start`

Works on Render, Railway, Fly.io, Heroku, etc.

## Privacy Note
Uploaded images are **never sent to the server**. They live only in the browser's memory for the duration of the session. Refreshing the page clears them.
