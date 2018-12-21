import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { FormControl, InputGroup, Button } from 'react-bootstrap';
import Dimensions from 'react-dimensions';
import classNames from 'classnames';
import { MaxChatMessageLength } from '../../shared/constants';
import './style.css';

const ChatAutoOpenMinWidth = 1200;
const ChatInputAutoFocusMinWidth = 1200;

class Chat extends Component {

  constructor(props) {
    super(props);

    const isOpen = props.containerWidth >= ChatAutoOpenMinWidth;
    this.state = {
      socket: null,
      open: isOpen,
      unread: false,
      chatText: [],
      inputText: '',
      sendButtonDisabled: true
    };
    this.textArea = null;
    this.textInput = null;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.socket && this.state.socket == null) {
      this.setState({
        socket: nextProps.socket
      });
      nextProps.socket.on('chatMessageReceived', this.chatMessageReceived);
    }
  }

  chatMessageReceived = (data) => {
    const chatText = this.state.chatText.slice();
    chatText.push(data);
    this.setState({
      unread: !this.state.open,
      chatText: chatText
    });
    setTimeout(() => {
      const container = ReactDOM.findDOMNode(this.textArea); // eslint-disable-line react/no-find-dom-node
      container.scrollTop = container.scrollHeight;
    }, 0);
  }

  borderClicked = () => {
    this.setState({
      open: !this.state.open,
      unread: false
    });
    if (this.props.containerWidth >= ChatInputAutoFocusMinWidth && !this.state.open) {
      const container = ReactDOM.findDOMNode(this.textInput); // eslint-disable-line react/no-find-dom-node
      container.focus();
    }
  }

  inputTextChanged = (e) => {
    this.setState({
      inputText: e.target.value,
      sendButtonDisabled: !(e.target.value && e.target.value.trim().length > 0)
    });
  }

  inputTextKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.sendMessage();
    }
  }

  sendMessage = () => {
    if (this.state.inputText && this.state.inputText.length > 0) {
      this.props.socket.emit('sendChatMessage', this.props.gameId, this.state.inputText.trim());
      this.setState({
        inputText: '',
        sendButtonDisabled: true
      });
    }
  }

  render() {
    return (
      <div className={classNames('Chat', { Open: this.state.open })}>
        <div className={classNames('Chat-click-border', { unread: this.state.unread })} onClick={this.borderClicked}>
          <div
            className={classNames('glyphicon', 'Close-chat', { 'glyphicon-triangle-right': this.state.open },
              { 'glyphicon-triangle-left': !this.state.open })}
          />
          <div className="Click-border-text">
            <span>Chat</span>
          </div>
        </div>
        <div className="Chat-area">
          <div
            ref={(ta) => { this.textArea = ta; }} // eslint-disable-line brace-style
            className="Text-area"
          >
            <ul className="list-unstyled">
              {this.state.chatText.map((item, index) => (
                <li key={index}>
                  {item.sender && <span className="Sender">{item.sender}: </span>}
                  <span className={classNames('Message', { Notification: item.sender == null })}>
                    {item.message}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <InputGroup>
            <FormControl
              ref={(input) => { this.textInput = input; }} // eslint-disable-line brace-style
              type="text"
              value={this.state.inputText}
              maxLength={MaxChatMessageLength}
              onChange={this.inputTextChanged}
              onKeyPress={this.inputTextKeyPress}
            />
            <InputGroup.Button>
              <Button onClick={this.sendMessage} disabled={this.state.sendButtonDisabled}>Send</Button>
            </InputGroup.Button>
          </InputGroup>
        </div>
      </div>
    );
  }
}

Chat.propTypes = {
  containerWidth: PropTypes.number.isRequired,
  socket: PropTypes.object.isRequired,
  gameId: PropTypes.string.isRequired
};

export default Dimensions()(Chat);
