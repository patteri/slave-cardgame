const express = require('express');
const gameService = require('../services/gameService');

const router = express.Router();

// Initializes a new game
router.post('/', (req, res) => {
  let game = gameService.createGame();
  res.json({
    player: game.player,
    game: game.game
  });
});

module.exports = router;
