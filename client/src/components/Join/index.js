import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Join from './Join';
import { gameIdChanged } from './actions';
import { playerNameChanged } from '../Home/actions';
import { gameStarted } from '../Game/actions';
import { openErrorModal } from '../Errors/actions';
import api from '../../api/api';
import './style.css';

const mapStateToProps = state => state.join;

const mapDispatchToProps = dispatch => ({
  onGameIdChanged(id) {
    dispatch(gameIdChanged(id));
  },
  onPlayerNameChanged(name) {
    dispatch(playerNameChanged(name));
  },
  onJoinGame() {
    dispatch((dispatch, getState) => {
      let state = getState().join;
      api.joinGame(state.gameId, {
        playerName: state.playerName
      }).then((response) => {
        dispatch(gameStarted(response.data));
        browserHistory.push('/game');
      }).catch((error) => {
        if (error.response && error.response.status === 403) {
          dispatch(openErrorModal('The game is full.'));
        }
        else if (error.response && error.response.status === 404) {
          dispatch(openErrorModal("The game doesn't exist."));
        }
        else {
          dispatch(openErrorModal('An unknown error occurred.'));
        }
      });
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Join);
