const GameState = { NOT_STARTED: 'NotStarted', PLAYING: 'Playing', CARD_EXCHANGE: 'CardExchange', ENDED: 'Ended' };
const PlayerState = { HIT: 'Hit', PASS: 'Pass', WAITING: 'Waiting', OUT_OF_GAME: 'OutOfGame' };
const CardExchangeType = { NONE: 'None', FREE: 'Free', BEST: 'Best' };

const GameSocketUrl = '/api/game/socket';

const GameValidation = {
  minPlayerNameLength: 1,
  maxPlayerNameLength: 12,
  minPlayerCount: 4,
  maxPlayerCount: 8,
  minGameCount: 1,
  maxGameCount: 100
};

exports.GameState = GameState;
exports.PlayerState = PlayerState;
exports.CardExchangeType = CardExchangeType;
exports.GameSocketUrl = GameSocketUrl;
exports.GameValidation = GameValidation;
