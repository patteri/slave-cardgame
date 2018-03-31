import { connect } from 'react-redux';
import Stats from './Stats';
import {
  statsLoaded,
  userStatsLoaded
} from './actions';
import { openErrorModal } from '../Errors/actions';
import api from '../../api/api';
import { StatProperties } from '../../shared/constants';
import './style.css';

const mapStateToProps = state => ({
  ...state.stats,
  loggedInPlayer: state.auth.username
});

const mapDispatchToProps = dispatch => ({
  onLoad() {
    api.stats.getStats(StatProperties).then((response) => {
      dispatch(statsLoaded(response.data));
    }).catch(() => {
      dispatch(openErrorModal('An unknown error occurred.'));
    });
  },
  loadUserStats(username) {
    api.stats.getByUsername(username).then((response) => {
      dispatch(userStatsLoaded(response.data));
    }).catch(() => {
      dispatch(openErrorModal('An unknown error occurred.'));
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stats);
