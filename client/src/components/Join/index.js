import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Join from './Join';
import { gameIdChanged } from './actions';
import { gameStarted } from '../Game/actions';
import { openErrorModal } from '../Errors/actions';
import api from '../../api/api';
import './style.css';

const mapStateToProps = state => Object.assign({},
  state.join,
  state.username,
  { isAuthenticated: state.auth.username != null }
);

const joinGame = (dispatch, gameId, playerName) => {
  api.game.joinGame(gameId, {
    playerName: playerName
  }).then((response) => {
    dispatch(gameStarted(response.data));
    browserHistory.push('/game');
  }).catch((error) => {
    if (error.response && error.response.status === 401) {
      dispatch(openErrorModal('Your credentials have expired. Please, login.'));
    }
    else if (error.response && error.response.status === 403) {
      dispatch(openErrorModal('The game is full.'));
    }
    else if (error.response && error.response.status === 404) {
      dispatch(openErrorModal("The game doesn't exist."));
    }
    else {
      dispatch(openErrorModal('An unknown error occurred.'));
    }
  });
};

const mapDispatchToProps = dispatch => ({
  onGameIdChanged(id) {
    dispatch(gameIdChanged(id));
  },
  onJoinGame() {
    dispatch((dispatch, getState) => {
      const state = getState();
      const playerName = state.auth.username ? state.auth.username : state.username.username.trim();
      joinGame(dispatch, state.join.gameId, playerName);
    });
  }
});

export const join = joinGame;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Join);
