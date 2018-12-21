import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import _ from 'lodash';
import Home from './Home';
import { join } from '../Join';
import {
  openGamesChanged,
  playerCountChanged,
  cpuPlayerCountChanged,
  gameCountChanged,
  usernameChanged,
  randomizeOrderChanged,
  autoDisconnectChanged,
  statsLoaded
} from './actions';
import { gameStarted } from '../Game/actions';
import { openErrorModal } from '../Errors/actions';
import api from '../../api/api';
import { loadState, saveState } from '../../utils/webStorage';
import './style.css';

const CONFIG_PROPS = {
  playerCount: playerCountChanged,
  cpuPlayerCount: cpuPlayerCountChanged,
  gameCount: gameCountChanged,
  randomizeOrder: randomizeOrderChanged,
  autoDisconnect: autoDisconnectChanged
};

const mapStateToProps = state => ({
  ...state.home,
  isAuthenticated: state.auth.username != null
});

const mapDispatchToProps = dispatch => ({
  onLoad() {
    api.stats.getStats([ 'averageGamePoints' ], 5).then((response) => {
      dispatch(statsLoaded(response.data));
    });
  },
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
  onUsernameChanged(value) {
    dispatch(usernameChanged(value));
  },
  onRandomizeOrderChanged(value) {
    dispatch(randomizeOrderChanged(value));
  },
  onAutoDisconnectChanged(value) {
    dispatch(autoDisconnectChanged(value));
  },
  onCreateGame() {
    dispatch((dispatch, getState) => {
      const state = getState();
      const playerName = state.auth.username ? state.auth.username : state.home.username.trim();
      api.game.createGame({
        playerName: playerName,
        playerCount: state.home.playerCount,
        cpuPlayerCount: state.home.cpuPlayerCount,
        gameCount: state.home.gameCount,
        randomizePlayerOrder: state.home.randomizeOrder,
        autoDisconnect: state.home.autoDisconnect
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
  },
  saveConfig() {
    dispatch((dispatch, getState) => {
      saveState(localStorage, 'gameConfig', _.pick(getState().home, Object.keys(CONFIG_PROPS)));
    });
  },
  loadConfig() {
    let state = loadState(localStorage, 'gameConfig') || {};
    Object.entries(CONFIG_PROPS).forEach(([ key, value ]) => {
      if (key in state) {
        dispatch(value(state[key]));
      }
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
