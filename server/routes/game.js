const express = require('express');
const gameService = require('../services/gameService');
const { GameState } = require('../../common/constants');

const router = express.Router();

const getAndValidateGame = (req, res, gameState = null) => {
  let game = gameService.getGame(req.params.id);
  if (game == null) {
    res.status(404).json({ error: 'The game doesn\'t exist' });
  }
  else if (gameState && gameState !== game.state) {
    res.status(403).json({ error: 'The operation is forbidden' });
    game = null;
  }
  return game;
};

// Initializes a new game
router.post('/', (req, res) => {
  const game = gameService.createGame();
  res.json({
    player: game.player,
    playerIndex: game.game._players.indexOf(game.player),
    game: game.game
  });
});

// Player makes a hit for the specified game
router.post('/:id/hit', (req, res) => {
  const game = getAndValidateGame(req, res, GameState.PLAYING);
  if (game != null) {
    if (!game.validateHit(req.body.clientId, req.body.cards)) {
      res.status(403).json({ error: 'The hit is forbidden' });
    }
    else {
      let cards = game.playTurn(req.body.cards);
      res.json({ cards: cards });
    }
  }
});

router.get('/:id/cardExchange', (req, res) => {
  const game = getAndValidateGame(req, res, GameState.CARD_EXCHANGE);
  if (game != null) {
    let cardsForExchange = game.getCardsForExchange(req.query.clientId);
    if (cardsForExchange == null) {
      res.status(403).json({ error: 'The request is forbidden' });
    }
    else {
      res.json({
        cards: cardsForExchange.cards,
        exchangeRule: cardsForExchange.exchangeRule,
        game: game
      });
    }
  }
});

router.post('/:id/cardsForExchange', (req, res) => {
  const game = getAndValidateGame(req, res, GameState.CARD_EXCHANGE);
  if (game != null) {
    let success = game.setCardsForExchange(req.body.clientId, req.body.cards);
    if (!success) {
      res.status(403).json({ error: 'The operation is forbidden' });
    }
    else {
      res.sendStatus(200);
    }
  }
});

module.exports = router;
