import { connect } from 'react-redux';
import Game from './Game';
import {
  playerJoined,
  gameStarted,
  gameUpdated,
  gameEnded,
  selectedCardsChanged,
  cardsHit,
  cardExchangeRequested,
  cardsGiven,
  cardsExchanged,
  newRoundStarted } from './actions';
import api from '../../api/api';
import { GameState, CardExchangeType } from '../../../../common/constants';
import './style.css';
import './playerColumns.css';

const mapStateToProps = state => state.get('game');

const setCardsForExchange = (state, dispatch, cards) => {
  api.cardsForExchange(state.gameId, {
    clientId: state.playerId,
    cards: cards
  }).then(() => {
    dispatch(cardsGiven());
  });
};

const mapDispatchToProps = dispatch => ({
  onPlayerJoined(data) {
    dispatch(playerJoined(data));
  },
  onGameStarted(data) {
    dispatch(gameStarted(data));
  },
  onGameUpdated(data) {
    dispatch(gameUpdated(data));
  },
  onGameEnd(data) {
    dispatch(gameUpdated(data));
    dispatch(gameEnded(data));
  },
  onCardSelectionChange(cards) {
    dispatch(selectedCardsChanged(cards));
  },
  onCardsHit(cards) {
    dispatch((dispatch, getState) => {
      let state = getState().get('game');
      let gameState = state.gameState;
      if (gameState === GameState.PLAYING) {
        api.hit(state.gameId, {
          clientId: state.playerId,
          cards: cards
        }).then((response) => {
          dispatch(cardsHit(response.data));
        });
      }
      else if (gameState === GameState.CARD_EXCHANGE) {
        setCardsForExchange(state, dispatch, cards);
      }
    });
  },
  requestCardExchange() {
    dispatch((dispatch, getState) => {
      let state = getState().get('game');
      api.getCardExchange(state.gameId, state.playerId).then((response) => {
        dispatch(cardExchangeRequested(response.data));
        if (response.data.exchangeRule.exchangeType === CardExchangeType.NONE) {
          setCardsForExchange(state, dispatch, []);
        }
      });
    });
  },
  onCardsExchanged(data) {
    dispatch(cardsExchanged(data));
  },
  onNewRoundStarted(data) {
    dispatch(newRoundStarted(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
