import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Row, Col, Table, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import io from 'socket.io-client';
import NumericSelector from './NumericSelector';
import { SocketInfo, GameValidation as gv } from '../../shared/constants';

class Home extends Component {

  constructor(props) {
    super(props);

    this._socket = null;
    this.joinGame = this.joinGame.bind(this);
  }

  componentWillMount() {
    // Configure websocket
    this._socket = io('', { path: SocketInfo.playRoomSocketUrl });

    // Connection events
    this._socket.on('connect', () => {
      this._socket.emit('register');
    });

    // Game room events
    this._socket.on('openGamesChanged', this.props.onOpenGamesChanged);
  }

  componentWillUnmount() {
    if (this._socket) {
      this._socket.close();
    }
  }

  joinGame(id) {
    browserHistory.push(`/join/${id}`);
  }

  createGame(e) {
    e.preventDefault();
    this.props.onCreateGame();
  }

  render() {
    const { openGames, playerCount, cpuPlayerCount, gameCount, playerName, isButtonDisabled } = this.props;

    return (
      <div className="Home">
        <h2 className="Home-header">Welcome to play Slave!</h2>
        <Row className="Home-container">
          <Col md={5} sm={6} mdOffset={1}>
            <h4>Join a game</h4>
            <div className="Open-games-scroll-container">
              <Table className="Open-games-table" bordered>
                <thead>
                  <tr>
                    <th>Joined players (CPUs)</th>
                    <th>Games</th>
                    <th>Created by player</th>
                  </tr>
                </thead>
                <tbody>
                  {openGames.map((item, index) =>
                    <tr key={index} className="clickable" onClick={() => this.joinGame(item.id)}>
                      <td>
                        {item.joinedHumanPlayers + item.joinedCpuPlayers} / {item.playerCount} ({item.joinedCpuPlayers})
                      </td>
                      <td>{item.gameCount}</td>
                      <td>{item.createdBy}</td>
                    </tr>
                  )}
                  {openGames.length === 0 &&
                    <tr>
                      <td colSpan="3">No open games at the moment. Why wouldn&apos;t you create one?</td>
                    </tr>
                  }
                </tbody>
              </Table>
            </div>
          </Col>
          <Col md={4} sm={6} mdOffset={1}>
            <h4>Create a game</h4>
            <form onSubmit={e => this.createGame(e)}>
              <FormGroup controlId="numberOfPlayers">
                <ControlLabel>Total number of players ({gv.minPlayerCount} - {gv.maxPlayerCount})</ControlLabel>
                <NumericSelector
                  value={playerCount}
                  min={gv.minPlayerCount}
                  max={gv.maxPlayerCount}
                  onValueChanged={this.props.onPlayerCountChanged}
                />
              </FormGroup>
              <FormGroup controlId="numberOfCpuPlayers">
                <ControlLabel>Number of CPU players</ControlLabel>
                <NumericSelector
                  value={cpuPlayerCount}
                  min={0}
                  max={gv.maxPlayerCount - 1}
                  onValueChanged={this.props.onCpuPlayerCountChanged}
                />
              </FormGroup>
              <FormGroup controlId="numberOfGames">
                <ControlLabel>Number of games to play</ControlLabel>
                <NumericSelector
                  value={gameCount}
                  min={gv.minGameCount}
                  max={gv.maxGameCount}
                  onValueChanged={this.props.onGameCountChanged}
                />
              </FormGroup>
              <FormGroup controlId="playerName">
                <ControlLabel>Player name</ControlLabel>
                <FormControl
                  type="text"
                  value={playerName}
                  required
                  maxLength={12}
                  onChange={e => this.props.onPlayerNameChanged(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <FormGroup>
                  <Button type="submit" disabled={isButtonDisabled}>Create game</Button>
                </FormGroup>
              </FormGroup>
            </form>
          </Col>
        </Row>
      </div>
    );
  }

}

Home.PropTypes = {
  playerCount: PropTypes.number.isRequired,
  cpuPlayerCount: PropTypes.number.isRequired,
  playerName: PropTypes.string.isRequired,
  isButtonDisabled: PropTypes.bool.isRequired
};

export default Home;
