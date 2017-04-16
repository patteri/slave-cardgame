import { expect } from 'chai';
import gameReducer from '../components/Game/reducers/gameReducer';
import {
  gameStarted,
  gameEnded,
  selectedCardsChanged,
  cardsHit,
  cardExchangeRequested,
  cardsGiven,
  cardsExchanged,
  newRoundStarted } from '../components/Game/actions';
import Card from '../../../common/card';
import { GameState, CardExchangeType } from '../../../common/constants';

const getGameData = () => ({
  game: {
    id: 1,
    players: [
      { name: 'Player1', turn: true },
      { name: 'Player2' },
      { name: 'Player3' },
      { name: 'Player4' }
    ],
    previousHit: [],
    state: GameState.PLAYING,
    isFirstTurn: true,
    isRevolution: false
  },
  player: {
    id: 1,
    cards: [
      { suit: Card.Suits.CLUBS, value: 2 }
    ]
  },
  playerIndex: 0
});

const getCardExchangeData = (exchangeType) => {
  const gameData = getGameData().game;
  gameData.state = GameState.CARD_EXCHANGE;
  return {
    cards: [
      { suit: Card.Suits.CLUBS, value: 1 },
      { suit: Card.Suits.CLUBS, value: 2 },
      { suit: Card.Suits.CLUBS, value: 3 }
    ],
    exchangeRule: {
      exchangeCount: 1,
      exchangeType: exchangeType,
      toPlayer: { name: 'Player2' }
    },
    game: gameData
  };
};

const getReducerAfterGameRequested = () => {
  const initialState = gameReducer(undefined, { type: '' });
  const data = getGameData();
  return gameReducer(initialState, gameStarted(data));
};

describe('Player reducer', () => {
  it('gameStarted', () => {
    const initialState = gameReducer(undefined, { type: '' });
    const data = getGameData();
    const reducer = gameReducer(initialState, gameStarted(data));
    expect(reducer.player.player).to.equal(data.game.players[data.playerIndex]);
    expect(reducer.player.cards.length).to.equal(1);
    expect(reducer.player.buttonText).to.equal('Pass');
  });

  it('gameEnded', () => {
    const initialState = gameReducer(undefined, { type: '' });
    const data = {
      results: [
        { name: 'Player1' },
        { name: 'Player2' }
      ]
    };

    const reducer = gameReducer(initialState, gameEnded(data));
    expect(reducer.player.canHit).to.equal(false);
  });

  it('selectedCardsChanged - a legal card selected', () => {
    let reducer = getReducerAfterGameRequested();

    const selectedCards = [
      { suit: Card.Suits.CLUBS, value: 2 }
    ];
    reducer = gameReducer(reducer, selectedCardsChanged(selectedCards));
    expect(reducer.player.selectedCards.length).to.equal(1);
    expect(reducer.player.buttonText).to.equal('Hit');
    expect(reducer.player.canHit).to.equal(true);
  });

  it('selectedCardsChanged - an illegal card selected', () => {
    let reducer = getReducerAfterGameRequested();

    const selectedCards = [
      { suit: Card.Suits.CLUBS, value: 1 }
    ];
    reducer = gameReducer(reducer, selectedCardsChanged(selectedCards));
    expect(reducer.player.buttonText).to.equal('Hit');
    expect(reducer.player.canHit).to.equal(false);
  });

  it('selectedCardsChanged - cards unselected', () => {
    let reducer = getReducerAfterGameRequested();

    const selectedCards = [
      { suit: Card.Suits.CLUBS, value: 2 }
    ];
    reducer = gameReducer(reducer, selectedCardsChanged(selectedCards));
    reducer = gameReducer(reducer, selectedCardsChanged([]));
    expect(reducer.player.buttonText).to.equal('Pass');
    expect(reducer.player.canHit).to.equal(false);
  });

  it('cardsHit', () => {
    let reducer = getReducerAfterGameRequested();

    const cards = {
      cards: [
        { suit: Card.Suits.CLUBS, value: 2 }
      ]
    };
    reducer = gameReducer(reducer, cardsHit(cards));
    expect(reducer.player.selectedCards.length).to.equal(0);
    expect(reducer.player.buttonText).to.equal('Pass');
    expect(reducer.player.canHit).to.equal(false);
  });

  it('cardExchangeRequested - best card', () => {
    let reducer = getReducerAfterGameRequested();

    const exchangeData = getCardExchangeData(CardExchangeType.BEST);
    reducer = gameReducer(reducer, cardExchangeRequested(exchangeData));
    expect(reducer.player.cards.length).to.equal(3);
    expect(reducer.player.selectedCards.length).to.equal(1);
    expect(reducer.player.selectedCards.findIndex(item => item.suit === Card.Suits.CLUBS && item.value === 1))
      .to.not.equal(-1);
    expect(reducer.player.buttonText).to.equal('Give cards');
    expect(reducer.player.canHit).to.equal(true);
    expect(reducer.player.exchangeRule).to.equal(exchangeData.exchangeRule);
  });

  it('cardExchangeRequested - free card', () => {
    let reducer = getReducerAfterGameRequested();

    const exchangeData = getCardExchangeData(CardExchangeType.FREE);
    reducer = gameReducer(reducer, cardExchangeRequested(exchangeData));
    expect(reducer.player.selectedCards.length).to.equal(0);
    expect(reducer.player.buttonText).to.equal('Give cards');
    expect(reducer.player.canHit).to.equal(false);
  });

  it('cardsGiven', () => {
    let reducer = getReducerAfterGameRequested();

    reducer = gameReducer(reducer, cardsGiven());
    expect(reducer.player.canHit).to.equal(false);
    expect(reducer.player.cardsGiven).to.equal(true);
  });

  it('cardsExchanged', () => {
    let reducer = getReducerAfterGameRequested();

    const exchangeData = {
      exchangedCards: {
        cards: [
          { suit: Card.Suits.CLUBS, value: 1 }
        ],
        exchangeType: CardExchangeType.BEST,
        fromPlayer: { name: 'Player2' }
      },
      cards: [
        { suit: Card.Suits.CLUBS, value: 1 },
        { suit: Card.Suits.CLUBS, value: 2 },
        { suit: Card.Suits.CLUBS, value: 3 }
      ]
    };
    reducer = gameReducer(reducer, cardsExchanged(exchangeData));
    expect(reducer.player.cards.length).to.equal(3);
    expect(reducer.player.selectedCards.length).to.equal(1);
    expect(reducer.player.selectedCards.findIndex(item => item.suit === Card.Suits.CLUBS && item.value === 1))
      .to.not.equal(-1);
    expect(reducer.player.canHit).to.equal(false);
    expect(reducer.player.cardsGiven).to.equal(true);
  });

  it('newRoundStarted', () => {
    let reducer = getReducerAfterGameRequested();

    const exchangeData = getCardExchangeData(CardExchangeType.BEST);
    reducer = gameReducer(reducer, cardExchangeRequested(exchangeData));
    const newGameData = getGameData();
    newGameData.game.players[0].turn = false;
    newGameData.game.players[1].turn = true;
    reducer = gameReducer(reducer, newRoundStarted(newGameData));
    expect(reducer.player.player.turn).to.equal(false);
    expect(reducer.player.selectedCards.length).to.equal(0);
    expect(reducer.player.buttonText).to.equal('Pass');
    expect(reducer.player.canHit).to.equal(false);
    expect(reducer.player.exchangeRule).to.be.null; // eslint-disable-line no-unused-expressions
    expect(reducer.player.cardsGiven).to.equal(false);
  });
});
