import { connect } from 'react-redux';
import Stats from './Stats';
import { statsLoaded } from './actions';
import { openErrorModal } from '../Errors/actions';
import api from '../../api/api';
import { StatProperties } from '../../shared/constants';
import './style.css';

const mapStateToProps = state => state.stats;

const mapDispatchToProps = dispatch => ({
  onLoad() {
    api.stats.getStats(StatProperties).then((response) => {
      dispatch(statsLoaded(response.data));
    }).catch(() => {
      dispatch(openErrorModal('An unknown error occurred.'));
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stats);
