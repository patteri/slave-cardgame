const express = require('express');
const gameService = require('../services/gameService');

const router = express.Router();

// Initializes a new game
router.post('/', (req, res) => {
  const game = gameService.createGame();
  res.json({
    player: game.player,
    game: game.game
  });
});

// Player makes a hit for the specified game
router.post('/:id/hit', (req, res) => {
  const game = gameService.getGame(req.params.id);
  if (game == null) {
    res.status(404).json({ error: 'The game doesn\'t exist' });
  }
  else if (!game.validateHit(req.body.clientId, req.body.cards)) {
    res.status(403).json({ error: 'The hit is forbidden' });
  }
  else {
    let cards = game.playTurn(req.body.cards);
    res.json({ cards: cards });
  }
});

module.exports = router;
