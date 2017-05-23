import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Home from './Home';
import {
  openGamesChanged,
  playerCountChanged,
  cpuPlayerCountChanged,
  gameCountChanged,
  playerNameChanged
} from './actions';
import { gameStarted } from '../Game/actions';
import { openErrorModal } from '../Errors/actions';
import api from '../../api/api';
import './style.css';

const mapStateToProps = state => state.home;

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
  onPlayerNameChanged(name) {
    dispatch(playerNameChanged(name));
  },
  onCreateGame() {
    dispatch((dispatch, getState) => {
      let state = getState().home;
      api.game.createGame({
        playerName: state.playerName,
        playerCount: state.playerCount,
        cpuPlayerCount: state.cpuPlayerCount,
        gameCount: state.gameCount
      }).then((response) => {
        dispatch(gameStarted(response.data));
        browserHistory.push('/game');
      }).catch(() => {
        dispatch(openErrorModal('An unknown error occurred.'));
      });
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
