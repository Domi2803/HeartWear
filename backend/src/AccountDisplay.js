import React, { Component } from 'react'
import './AccountDisplay.css';
import firebase from "firebase/app";
import "firebase/auth";
import LogoutIcon from './logout.png';

export default class AccountDisplay extends Component {
    render() {
        if(firebase.auth().currentUser != null)
        return (
            <div className="panel">
                <img className="accountPicture" src={firebase.auth().currentUser.photoURL} />
                <h2 className="accountName">{firebase.auth().currentUser.displayName}</h2>
                <img className="logoutButton" src={LogoutIcon} onClick={this.props.onLogout}/>
            </div>
        )
        else 
        return(<div />)
    }

    onLogout = ()=>{
    }
}
