import { expect } from 'chai';
import registerReducer from '../components/Register/reducer';
import {
  passwordChanged,
  emailChanged } from '../components/Register/actions';

describe('Register reducer', () => {
  it('Setting password and email', () => {
    const initialState = registerReducer(undefined, { type: '' });
    expect(initialState.isButtonDisabled).to.equal(true);
    let reducer = registerReducer(initialState, passwordChanged('12345678'));
    expect(reducer.password).to.equal('12345678');
    expect(reducer.isButtonDisabled).to.equal(true);
    reducer = registerReducer(reducer, emailChanged('user@slavegame.net'));
    expect(reducer.email).to.equal('user@slavegame.net');
    expect(reducer.isButtonDisabled).to.equal(false);
  });

  it('Invalid password', () => {
    const initialState = registerReducer(undefined, { type: '' });
    let reducer = registerReducer(initialState, passwordChanged('1234567'));
    expect(reducer.showPasswordError).to.equal(true);
  });

  it('Invalid email', () => {
    const initialState = registerReducer(undefined, { type: '' });
    let reducer = registerReducer(initialState, emailChanged('invalid'));
    expect(reducer.showEmailError).to.equal(true);
  });
});
