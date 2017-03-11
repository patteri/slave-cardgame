import { connect } from 'react-redux';
import Game from './Game';
import { gameRequested, turnChanged, selectedCardsChanged, cardsHit } from './actions';
import api from '../../api/api';
import './style.css';

const mapStateToProps = state => state.get('game');

const mapDispatchToProps = dispatch => ({
  requestGame() {
    dispatch((dispatch) => {
      api.startGame().then((response) => {
        dispatch(gameRequested(response.data));
      });
    });
  },
  onTurnChange(data) {
    dispatch(turnChanged(data));
  },
  onCardSelectionChange(cards) {
    dispatch(selectedCardsChanged(cards));
  },
  onCardsHit(cards) {
    dispatch((dispatch, getState) => {
      let state = getState().get('game');
      api.hit(state.gameId, {
        clientId: state.playerId,
        cards: cards
      }).then((response) => {
        dispatch(cardsHit(response.data));
      });
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
