const GameState = { NOT_STARTED: 'NotStarted', PLAYING: 'Playing', CARD_EXCHANGE: 'CardExchange', ENDED: 'Ended' };
const PlayerState = { PLAYING: 'Playing', OUT_OF_GAME: 'OutOfGame' };
const PlayerHitState = { HIT: 'Hit', PASS: 'Pass', WAITING: 'Waiting' };
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
exports.PlayerHitState = PlayerHitState;
exports.CardExchangeType = CardExchangeType;
exports.GameSocketUrl = GameSocketUrl;
exports.GameValidation = GameValidation;
