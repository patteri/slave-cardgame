import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import api from './api';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      content: ''
    };

    api.getTest().then((response) => {
      this.setState({
        content: response.data.content
      });
    });
  }

  render() {
    const { content } = this.state;

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          {content}
        </p>
      </div>
    );
  }
}

export default App;