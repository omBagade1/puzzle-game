const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  playerName: { type: String, required: true, trim: true, maxlength: 30 },
  moves: { type: Number, required: true },
  time: { type: Number, required: true }, // seconds
  puzzleType: { type: String, default: 'custom' }, // 'custom' | theme id
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Score', ScoreSchema);
