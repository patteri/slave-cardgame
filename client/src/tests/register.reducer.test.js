import { expect } from 'chai';
import registerReducer from '../components/Register/reducer';
import {
  usernameChanged,
  passwordChanged,
  emailChanged
} from '../components/Register/actions';

describe('Register reducer', () => {
  it('Setting password, email and username', () => {
    const initialState = registerReducer(undefined, { type: '' });
    expect(initialState.isButtonDisabled).to.equal(true);
    let reducer = registerReducer(initialState, usernameChanged({
      username: 'player',
      isValid: true
    }));
    expect(reducer.username).to.equal('player');
    expect(reducer.isUsernameValid).to.equal(true);
    expect(reducer.isButtonDisabled).to.equal(true);
    reducer = registerReducer(reducer, passwordChanged({
      password: '12345678',
      isValid: true
    }));
    expect(reducer.password).to.equal('12345678');
    expect(reducer.isPasswordValid).to.equal(true);
    expect(reducer.isButtonDisabled).to.equal(true);
    reducer = registerReducer(reducer, emailChanged({
      email: 'user@slavegame.xyz',
      isValid: true
    }));
    expect(reducer.email).to.equal('user@slavegame.xyz');
    expect(reducer.isEmailValid).to.equal(true);
    expect(reducer.isButtonDisabled).to.equal(false);
  });

  it('Invalid username', () => {
    const initialState = registerReducer(undefined, { type: '' });
    let reducer = registerReducer(initialState, usernameChanged({
      password: 'invalid',
      isValid: false
    }));
    expect(reducer.isUsernameValid).to.equal(false);
  });

  it('Invalid password', () => {
    const initialState = registerReducer(undefined, { type: '' });
    let reducer = registerReducer(initialState, passwordChanged({
      password: '1234567',
      isValid: false
    }));
    expect(reducer.isPasswordValid).to.equal(false);
  });

  it('Invalid email', () => {
    const initialState = registerReducer(undefined, { type: '' });
    let reducer = registerReducer(initialState, emailChanged({
      email: 'invalid',
      isValid: false
    }));
    expect(reducer.isEmailValid).to.equal(false);
  });
});
