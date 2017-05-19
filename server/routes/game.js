const express = require('express');
const gameService = require('../services/gameService');
const authService = require('../services/authService');
const { GameState } = require('../../client/src/shared/constants');

const router = express.Router();

const validateUser = req => new Promise((resolve, reject) => {
  if (req.body.playerName) {
    return authService.findUserByUsername(req.body.playerName).then((user) => {
      if (user) {
        const token = authService.parseTokenFromReq(req);
        if (token) {
          const userByToken = authService.findUserByToken(token);
          if (userByToken) {
            return userByToken.then((user) => {
              if (user && user.username === req.body.playerName) {
                resolve();
              }
              reject();
            });
          }
        }
        return reject();
      }
      return resolve();
    });
  }
  return reject();
});

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

const handleGameQueryResult = (res, result) => {
  if (result == null) {
    res.status(400).json({ error: 'The request is invalid' });
  }
  else {
    res.json({
      player: result.player,
      playerIndex: result.game._players.indexOf(result.player),
      game: result.game
    });
  }
};

// Initializes a new game
router.post('/', (req, res) => {
  validateUser(req).then(() => {
    const result = gameService.createGame(req.body.playerName, req.body.playerCount, req.body.cpuPlayerCount,
      req.body.gameCount);
    handleGameQueryResult(res, result);
  }).catch(() => {
    res.status(401).json({ error: 'Unauthorized' });
  });
});

// Joins to an existing game
router.post('/:id/join', (req, res) => {
  validateUser(req).then(() => {
    const game = getAndValidateGame(req, res, GameState.NOT_STARTED);
    if (game != null) {
      const result = gameService.joinGame(game, req.body.playerName);
      handleGameQueryResult(res, result);
    }
  }).catch(() => {
    res.status(401).json({ error: 'Unauthorized' });
  });
});

// Quits from a game
router.post('/:id/quit', (req, res) => {
  const game = getAndValidateGame(req, res);
  if (game != null) {
    if (!gameService.quitGame(game, req.body.clientId)) {
      res.status(403).json({ error: 'The request is forbidden' });
    }
    else {
      res.sendStatus(200);
    }
  }
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
