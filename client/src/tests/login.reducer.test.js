import { expect } from 'chai';
import loginReducer from '../components/Login/loginReducer';
import {
  usernameChanged,
  passwordChanged,
  loginError,
  hideLoginError } from '../components/Login/actions';

describe('Login reducer', () => {
  it('Setting username and password', () => {
    const initialState = loginReducer(undefined, { type: '' });
    expect(initialState.isButtonDisabled).to.equal(true);
    let reducer = loginReducer(initialState, usernameChanged('username'));
    expect(reducer.username).to.equal('username');
    expect(reducer.isButtonDisabled).to.equal(true);
    reducer = loginReducer(reducer, passwordChanged('password'));
    expect(reducer.password).to.equal('password');
    expect(reducer.isButtonDisabled).to.equal(false);
  });

  it('Login error', () => {
    const initialState = loginReducer(undefined, { type: '' });
    expect(initialState.showError).to.equal(false);
    let reducer = loginReducer(initialState, loginError());
    expect(reducer.showError).to.equal(true);
    reducer = loginReducer(reducer, hideLoginError());
    expect(reducer.showError).to.equal(false);
  });
});
