import { expect } from 'chai';
import usernameReducer from '../components/General/UsernameInput/reducer';
import { usernameInputChanged } from '../components/General/UsernameInput/actions';

describe('UsernameInput reducer', () => {
  it('Successful usernameInputChanged', () => {
    const initialState = usernameReducer(undefined, { type: '' });
    const reducer = usernameReducer(initialState,
      usernameInputChanged({ validationPending: false, available: true, username: 'test' }));
    expect(reducer.username).to.equal('test');
    expect(reducer.isValid).to.equal(true);
    expect(reducer.isReserved).to.equal(false);
  });

  it('Invalid usernameInputChanged: no characters', () => {
    const initialState = usernameReducer(undefined, { type: '' });
    const reducer = usernameReducer(initialState,
      usernameInputChanged({ validationPending: false, available: true, username: '' }));
    expect(reducer.isValid).to.equal(false);
  });

  it('Invalid usernameInputChanged: too many characters', () => {
    const initialState = usernameReducer(undefined, { type: '' });
    const reducer = usernameReducer(initialState,
      usernameInputChanged({ validationPending: false, available: true, username: '1234567890abc' }));
    expect(reducer.isValid).to.equal(false);
  });

  it('Username not available', () => {
    const initialState = usernameReducer(undefined, { type: '' });
    const reducer = usernameReducer(initialState,
      usernameInputChanged({ validationPending: true, available: false, username: 'test' }));
    expect(reducer.isValid).to.equal(false);
    expect(reducer.isReserved).to.equal(true);
  });

  it('Validation pending', () => {
    const initialState = usernameReducer(undefined, { type: '' });
    const reducer = usernameReducer(initialState,
      usernameInputChanged({ validationPending: true, available: true, username: 'test' }));
    expect(reducer.isValid).to.equal(false);
  });
});
