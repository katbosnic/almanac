import React, { Component } from 'react';
import InputForm from './components/InputForm';
import './styles/styles.css';

class App extends Component {

  constructor() {
    super();
    this.state = {

    }
  }
  

  render() {
    return (
      <div className="App">
        <header>
          <h1><span>The New</span>Farmer's Almanac-ish</h1>
          <h2>Founded in 2019</h2>
        </header>
        <InputForm/>
      </div>
    );
  }
}

export default App;
