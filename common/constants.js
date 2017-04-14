const GameState = { NOT_STARTED: 'NotStarted', PLAYING: 'Playing', CARD_EXCHANGE: 'CardExchange', ENDED: 'Ended' };
const CardExchangeType = { NONE: 'None', FREE: 'Free', BEST: 'Best' };

const GameSocketUrl = '/api/game/socket';

const GameValidation = {
  minPlayerNameLength: 1,
  maxPlayerNameLength: 12,
  minPlayerCount: 4,
  maxPlayerCount: 8
};

exports.GameState = GameState;
exports.CardExchangeType = CardExchangeType;
exports.GameSocketUrl = GameSocketUrl;
exports.GameValidation = GameValidation;
