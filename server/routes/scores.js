const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

// GET top 10
router.get('/', async (req, res) => {
  try {
    const scores = await Score.find().sort({ moves: 1, time: 1 }).limit(10);
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new score
router.post('/', async (req, res) => {
  const { playerName, moves, time, puzzleType } = req.body;
  if (!playerName || moves == null || time == null)
    return res.status(400).json({ message: 'Missing required fields' });
  try {
    const score = new Score({ playerName, moves, time, puzzleType });
    const saved = await score.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
