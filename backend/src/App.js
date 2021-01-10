import './App.css';

import React, { Component } from 'react'
import Login from './Login';
import LoggedIn from './LoggedIn';
import Embed from './Embed';
import firebase from 'firebase/app'
import 'firebase/auth'


export default class App extends Component {
  
  state={
    uid: null,
    embed: false
  }

  componentDidMount(){  
    var pathname = window.location.pathname;
    var uid = pathname.split("/")[1];
    if(uid != ""){
      this.setState({uid: uid, embed: true});
      
    } 
    
  }

  render() {
    console.log(this.state);

    return (
      <div className="App">
        {this.state.uid == null && this.state.embed == false ? <Login onLogin={this.onLogin}/> : null}
        {this.state.uid != null && this.state.embed == false ? <LoggedIn uid={this.state.uid} onLogout={this.onLogout}/> : null}
        {this.state.uid != null && this.state.embed == true ? <Embed uid={this.state.uid} /> : null}
      </div>
    )
  }
  onLogin = (uid)=>{
    this.setState({uid: uid});
  }

  onLogout = ()=>{
    firebase.auth().signOut();
    this.setState({uid: null});
  }
}
