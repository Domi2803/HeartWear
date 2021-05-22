import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from 'firebase/app';
import 'firebase/analytics';


(async ()=>{

  // Fill this object with firebase credentials for debug
  let config = {
    apiKey: "AIzaSyAMhp9m7k-fwfBFHvXG0WDguZbBfKvDnwM",
    authDomain: "wearosheartrate.firebaseapp.com",
    databaseURL: "https://wearosheartrate-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "wearosheartrate",
    storageBucket: "wearosheartrate.appspot.com",
    messagingSenderId: "269376725613",
    appId: "1:269376725613:web:b70a3d570a7fd036939564",
    measurementId: "G-VMTTS5CHQ0"
  };
  // Comment these two out for debug 
  // const response = await fetch('/__/firebase/init.json')
  // config = await response.json()

  firebase.initializeApp(config);
  firebase.analytics();


  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
})();
