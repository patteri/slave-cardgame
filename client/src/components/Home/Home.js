import React, { Component, PropTypes } from 'react';
import { Row, Col, Table, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import io from 'socket.io-client';
import NumericSelector from './NumericSelector';
import UsernameInput from '../General/UsernameInput';
import Leaderboard from './Leaderboard';
import { SocketInfo, GameValidation as gv } from '../../shared/constants';

class Home extends Component {

  constructor(props) {
    super(props);

    this._socket = null;
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

    this.props.onLoad();
  }

  componentWillUnmount() {
    if (this._socket) {
      this._socket.close();
    }
  }

  createGame(e) {
    e.preventDefault();
    this.props.onCreateGame();
  }

  render() {
    const { openGames, playerCount, cpuPlayerCount, gameCount, username, isValid, isAuthenticated, stats } = this.props;

    return (
      <div className="Home">
        <h2 className="Slave-header">Welcome to play Slave!</h2>
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
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {openGames.map((item, index) =>
                    <tr key={index} className="clickable" onClick={() => this.props.onJoinGame(item.id)}>
                      <td>
                        {item.joinedHumanPlayers + item.joinedCpuPlayers} / {item.playerCount} ({item.joinedCpuPlayers})
                      </td>
                      <td>{item.gameCount}</td>
                      <td>{item.createdBy}</td>
                      <td><span className="glyphicon glyphicon-share-alt" /></td>
                    </tr>
                  )}
                  {openGames.length === 0 &&
                    <tr>
                      <td colSpan="4">No open games at the moment. Why wouldn&apos;t you create one?</td>
                    </tr>
                  }
                </tbody>
              </Table>
            </div>
            <Leaderboard stats={stats} sm={12} xsHidden />
          </Col>
          <Col className="Create-game-area" md={4} sm={6} mdOffset={1}>
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
              {!isAuthenticated &&
                <UsernameInput
                  initialValue={username}
                  controlId="playerName"
                  showRegistrationText
                  onUsernameChanged={this.props.onUsernameChanged}
                />
              }
              <FormGroup className="Bottom-FormGroup">
                <Button type="submit" disabled={!isAuthenticated && !isValid}>Create game</Button>
              </FormGroup>
            </form>
          </Col>
        </Row>
        <Leaderboard stats={stats} xs={12} smHidden mdHidden lgHidden />
      </div>
    );
  }

}

Home.propTypes = {
  openGames: PropTypes.array.isRequired,
  playerCount: PropTypes.number.isRequired,
  cpuPlayerCount: PropTypes.number.isRequired,
  gameCount: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  isValid: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  stats: PropTypes.object.isRequired,
  onOpenGamesChanged: PropTypes.func.isRequired,
  onLoad: PropTypes.func.isRequired,
  onCreateGame: PropTypes.func.isRequired,
  onJoinGame: PropTypes.func.isRequired,
  onPlayerCountChanged: PropTypes.func.isRequired,
  onCpuPlayerCountChanged: PropTypes.func.isRequired,
  onGameCountChanged: PropTypes.func.isRequired,
  onUsernameChanged: PropTypes.func.isRequired
};

export default Home;
