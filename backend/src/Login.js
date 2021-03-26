import React, { Component } from 'react'
import "./Login.css";
import Paper from '@material-ui/core/Paper'
import Logo from "./heartwearlogo.png"
import signInButton from "./signin-button/btn_google_signin_dark_normal_web@2x.png"
import firebase from "firebase/app";
import "firebase/auth";
import CopyrightText from './CopyrightText';

export default class Login extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div className="loginPage" style={{justifyContent: 'center', textAlign: 'center'}}>
                <img src={Logo} height={100} style={{objectFit: "contain"}} className="logo"/> <br/>
                <Paper elevation={5} className="loginPanel">
                    <h2>Login with Google to connect your watch</h2>
                    <div className="loginButtonCenter">
                        <a href="#" onClick={this.signIn}><img src={signInButton} className="signInButton" /></a>
                    </div>
                    <h3 style={{marginTop: 35}}>Don't have the app yet?</h3>
                    <div className="downloadButtonCenter">
                        <a href="https://play.google.com/store/apps/details?id=de.domi2803.heartrate_streamer">
                            <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" className="googlePlayButton"/>
                        </a>
                    </div>
                </Paper>
                <CopyrightText />
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

