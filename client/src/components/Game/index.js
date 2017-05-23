import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Game from './Game';
import {
  joinedPlayersChanged,
  gameStarted,
  gameUpdated,
  gameEnded,
  selectedCardsChanged,
  cardsHit,
  toggleResultsModal,
  cardExchangeRequested,
  cardsGiven,
  cardsExchanged,
  newRoundStarted,
  gameFinished } from './actions';
import { openErrorModal } from '../Errors/actions';
import api from '../../api/api';
import { GameState, CardExchangeType } from '../../shared/constants';
import './style.css';
import './playerColumns.css';

const mapStateToProps = state => state.game;

const onError = (dispatch) => {
  dispatch(openErrorModal('An unknown error occurred.'));
};

const setCardsForExchange = (state, dispatch, cards) => {
  api.game.cardsForExchange(state.gameId, {
    clientId: state.playerId,
    cards: cards
  }).then(() => {
    dispatch(cardsGiven());
  }).catch(() => {
    onError(dispatch);
  });
};

const mapDispatchToProps = dispatch => ({
  onJoinedPlayersChanged(data) {
    dispatch(joinedPlayersChanged(data));
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
      let state = getState().game;
      let gameState = state.gameState;
      switch (gameState) {
        case GameState.PLAYING:
          api.game.hit(state.gameId, {
            clientId: state.playerId,
            cards: cards
          }).then((response) => {
            dispatch(cardsHit(response.data));
          }).catch(() => {
            onError(dispatch);
          });
          break;
        case GameState.CARD_EXCHANGE:
          setCardsForExchange(state, dispatch, cards);
          break;
        case GameState.ENDED:
          browserHistory.push('/home');
          break;
        default:
          break;
      }
    });
  },
  toggleResultsModal(value) {
    dispatch(toggleResultsModal(value));
  },
  requestCardExchange() {
    dispatch((dispatch, getState) => {
      let state = getState().game;
      api.game.getCardExchange(state.gameId, state.playerId).then((response) => {
        dispatch(cardExchangeRequested(response.data));
        if (response.data.exchangeRule.exchangeType === CardExchangeType.NONE) {
          setCardsForExchange(state, dispatch, []);
        }
      }).catch(() => {
        onError(dispatch);
      });
    });
  },
  onCardsExchanged(data) {
    dispatch(cardsExchanged(data));
  },
  onNewRoundStarted(data) {
    dispatch(newRoundStarted(data));
  },
  onGameFinished() {
    dispatch(gameFinished());
  },
  onQuitGame() {
    dispatch((dispatch, getState) => {
      let state = getState().game;
      api.game.quitGame(state.gameId, {
        clientId: state.playerId
      });
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
