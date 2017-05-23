import { connect } from 'react-redux';
import Root from './Root';
import { logout } from '../Login/actions';
import './style.css';

const mapStateToProps = state => state.auth;

const mapDispatchToProps = dispatch => ({
  onLogout() {
    dispatch(logout());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
