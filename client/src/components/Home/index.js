import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Home from './Home';
import { join } from '../Join';
import {
  openGamesChanged,
  playerCountChanged,
  cpuPlayerCountChanged,
  gameCountChanged
} from './actions';
import { gameStarted } from '../Game/actions';
import { openErrorModal } from '../Errors/actions';
import api from '../../api/api';
import './style.css';

const mapStateToProps = state => Object.assign({},
  state.home,
  state.username,
  { isAuthenticated: state.auth.username != null }
);

const mapDispatchToProps = dispatch => ({
  onOpenGamesChanged(data) {
    dispatch(openGamesChanged(data));
  },
  onPlayerCountChanged(count) {
    dispatch(playerCountChanged(count));
  },
  onCpuPlayerCountChanged(count) {
    dispatch(cpuPlayerCountChanged(count));
  },
  onGameCountChanged(count) {
    dispatch(gameCountChanged(count));
  },
  onCreateGame() {
    dispatch((dispatch, getState) => {
      const state = getState();
      const playerName = state.auth.username ? state.auth.username : state.username.username.trim();
      api.game.createGame({
        playerName: playerName,
        playerCount: state.home.playerCount,
        cpuPlayerCount: state.home.cpuPlayerCount,
        gameCount: state.home.gameCount
      }).then((response) => {
        dispatch(gameStarted(response.data));
        browserHistory.push('/game');
      }).catch((error) => {
        if (error.response && error.response.status === 401) {
          dispatch(openErrorModal('Your credentials have expired. Please, login.'));
        }
        else {
          dispatch(openErrorModal('An unknown error occurred.'));
        }
      });
    });
  },
  onJoinGame(id) {
    dispatch((dispatch, getState) => {
      const playerName = getState().auth.username;
      if (playerName) {
        join(dispatch, id, playerName);
      }
      else {
        browserHistory.push(`/join/${id}`);
      }
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
