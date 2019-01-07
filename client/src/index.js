import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { DrizzleProvider } from 'drizzle-react';
import P2Pcharging from "./contracts/P2Pcharging.json";

const options = { contracts: [P2Pcharging] };

ReactDOM.render(
  <DrizzleProvider options={options}>
    <App/>
  </DrizzleProvider>, 
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
