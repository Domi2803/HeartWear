import React, { Component } from 'react'
import "./Login.css";
import Paper from '@material-ui/core/Paper'
import Logo from "./heartwearlogo.png"
import signInButton from "./signin-button/btn_google_signin_dark_normal_web@2x.png"
import firebase from "firebase/app";
import "firebase/auth";

export default class Login extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div className="loginPage">
                <img src={Logo} height={100} style={{objectFit: "contain"}} /> <br/>
                <Paper elevation={5} className="loginPanel">
                    <h2>Login with Google to connect your watch</h2>
                    <div className="loginButtonCenter">
                        <a href="#" onClick={this.signIn}><img src={signInButton} className="signInButton" /></a>
                    </div>
                </Paper>
            </div>
        )
    }

    signIn = ()=>{
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(user=>{
            var uid = user.user.uid;
            this.props.onLogin(uid);
        })
    }
}

