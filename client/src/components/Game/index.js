import { connect } from 'react-redux';
import Game from './Game';
import {
  gameRequested,
  turnChanged,
  gameEnded,
  selectedCardsChanged,
  cardsHit,
  cardExchangeRequested,
  cardsExchanged,
  newRoundStarted } from './actions';
import api from '../../api/api';
import { GameState } from '../../../../common/constants';
import './style.css';

const mapStateToProps = state => state.get('game');

const mapDispatchToProps = dispatch => ({
  requestGame() {
    dispatch((dispatch) => {
      api.startGame().then((response) => {
        dispatch(gameRequested(response.data));
      });
    });
  },
  onTurnChange(data) {
    dispatch(turnChanged(data));
  },
  onGameEnd(data) {
    dispatch(turnChanged(data));
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
        api.cardsForExchange(state.gameId, {
          clientId: state.playerId,
          cards: cards
        });
      }
    });
  },
  requestCardExchange() {
    dispatch((dispatch, getState) => {
      let state = getState().get('game');
      api.getCardExchange(state.gameId, state.playerId).then((response) => {
        dispatch(cardExchangeRequested(response.data));
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
