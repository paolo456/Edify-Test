import logo from './logo.svg';
import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
const callRefreshURL = 'https://www.strava.com/oauth/token?client_id='+process.env.REACT_APP_client_id+'&client_secret='+process.env.REACT_APP_client_secret+'&refresh_token='+process.env.REACT_APP_refresh_token+'&grant_type=refresh_token'

function App() {
	return (
	  <div className="App">
		<header className="App-header">
		  <img src={logo} className="App-logo" alt="logo" />
		  <p>
			Edit <code>src/App.js</code> and save to reload.
		  </p>
		  <a
			className="App-link"
			href="https://reactjs.org"
			target="_blank"
			rel="noopener noreferrer"
		  >
			Learn React
		  </a>
		</header>
	  </div>
	);
  }

export default App;
