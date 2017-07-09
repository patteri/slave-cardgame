import { expect } from 'chai';
import authReducer from '../components/Login/authReducer';
import {
  login,
  logout } from '../components/Login/actions';

describe('Auth reducer', () => {
  it('Login and logout', () => {
    const initialState = authReducer(undefined, { type: '' });
    expect(initialState.username).to.be.null; // eslint-disable-line no-unused-expressions
    expect(initialState.token).to.be.null; // eslint-disable-line no-unused-expressions
    const date = Date.now();
    let reducer = authReducer(initialState, login({ username: 'username', token: 'token', expires: date }));
    expect(reducer.username).to.equal('username');
    expect(reducer.token).to.equal('token');
    expect(reducer.expires).to.equal(date);
    reducer = authReducer(reducer, logout());
    expect(initialState.username).to.be.null; // eslint-disable-line no-unused-expressions
    expect(initialState.token).to.be.null; // eslint-disable-line no-unused-expressions
    expect(initialState.expires).to.be.null; // eslint-disable-line no-unused-expressions
  });
});
