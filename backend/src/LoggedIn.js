import React, { Component } from 'react'
import "./Login.css";
import Paper from '@material-ui/core/Paper'
import Logo from "./heartwearlogo.png"
import signInButton from "./signin-button/btn_google_signin_dark_normal_web@2x.png"
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

export default class LoggedIn extends Component {
    state={
        currentHR: 0,
        timestamp: 0,
        batteryPercent: 0
    }

    constructor(props){
        super(props);
    }

    componentDidMount(){
        firebase.database().ref("/" + this.props.uid + "/").on('value', snapshot=>{
            var val = snapshot.val();
            this.setState({
                currentHR: Math.round(val.currentHR),
                timestamp: val.lastUpdateTimestamp,
                batteryPercent: val.currentBattery
            });
        })

        setInterval(()=>{this.forceUpdate()}, 10000);
    }

    render() {
        var timestampDiff = Date.now() - this.state.timestamp;
        return (
            <div className="loginPage" >
                <img src={Logo} height={100} style={{objectFit: "contain"}} /> <br/>
                <Paper elevation={5} className="loginPanel" style={{height: "300px"}}>
                    <h2>{timestampDiff < 60000 ? "Current Heartrate:" +this.state.currentHR : "Watch is offline"}</h2>
                    <p><b>Logged in as: {firebase.auth().currentUser.displayName} </b></p><button onClick={this.props.onLogout}>Sign out</button>
                    <p><br /><b>Embed into OBS:</b></p>
                    <textarea style={{width: "100%"}}>{window.location.protocol + "//" + window.location.host + "/" + this.props.uid}</textarea>
                    <p>Use 480x480px as size</p>
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

