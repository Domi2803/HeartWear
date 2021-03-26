import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from 'firebase/app';


(async ()=>{
  let config = {
    
  }
  const response = await fetch('/__/firebase/init.json')
  config = await response.json()
  firebase.initializeApp(config);


  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
})();
