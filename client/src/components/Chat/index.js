import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { FormControl, InputGroup, Button } from 'react-bootstrap';
import Dimensions from 'react-dimensions';
import classNames from 'classnames';
import { MaxChatMessageLength } from '../../../../common/constants';
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

    this.chatMessageReceived = this.chatMessageReceived.bind(this);
    this.borderClicked = this.borderClicked.bind(this);
    this.inputTextChanged = this.inputTextChanged.bind(this);
    this.inputTextKeyPress = this.inputTextKeyPress.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.socket && this.state.socket == null) {
      this.setState({
        socket: nextProps.socket
      });
      nextProps.socket.on('chatMessageReceived', this.chatMessageReceived);
    }
  }

  chatMessageReceived(data) {
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

  borderClicked() {
    this.setState({
      open: !this.state.open,
      unread: false
    });
    if (this.props.containerWidth >= ChatInputAutoFocusMinWidth && !this.state.open) {
      const container = ReactDOM.findDOMNode(this.textInput); // eslint-disable-line react/no-find-dom-node
      container.focus();
    }
  }

  inputTextChanged(e) {
    this.setState({
      inputText: e.target.value,
      sendButtonDisabled: !(e.target.value && e.target.value.trim().length > 0)
    });
  }

  inputTextKeyPress(e) {
    if (e.key === 'Enter') {
      this.sendMessage();
    }
  }

  sendMessage() {
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
                <li key={index}><span className="Sender">{item.sender}:</span> {item.message}</li>
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

Chat.PropTypes = {
  containerWidth: PropTypes.number.isRequired,
  socket: PropTypes.object
};

export default Dimensions()(Chat);
