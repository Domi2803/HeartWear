import React, { Component } from 'react'
import "./Login.css";
import Paper from '@material-ui/core/Paper'
import Logo from "./heartwearlogo.png"
import signInButton from "./signin-button/btn_google_signin_dark_normal_web@2x.png"
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import CopyrightText from './CopyrightText';
import AccountDisplay from './AccountDisplay';
import Preview from './Preview';
import CustomizationBar from './CustomizationBar';
import { colors } from '@material-ui/core';
import {Battery} from '@pxblue/react-progress-icons';
import URLTextField from './URLTextField';

const Themes = {
    HeartShape: 0,
    HRLine: 1,
    TextOnly: 2
}

export default class LoggedIn extends Component {
    state={
        currentHR: 0,
        timestamp: 0,
        batteryPercent: 0,
        currentTheme: 0,
        colorOverrideEnabled: false,
        overrideColor: "#000000"
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
                batteryPercent: val.currentBattery,
                currentTheme: val.currentTheme == null ? 0 : val.currentTheme,
                colorOverrideEnabled: val.colorOverrideEnabled || false,
                overrideColor: val.overrideColor || "#000000"
            });
        })

        setInterval(()=>{this.forceUpdate()}, 10000);
    }

    render() {
        var timestampDiff = Date.now() - this.state.timestamp;
        return (
            <div className="loginPage" >
                <img src={Logo} height={100} style={{objectFit: "contain"}} className="logo"/> <br/>
                <Paper elevation={5} className="loginPanel" style={{height: "720px", paddingLeft: 25, paddingRight: 25, paddingBottom: 25}}>
                    <AccountDisplay onLogout={this.props.onLogout} />
                    <h4 className="previewText">Preview</h4>
                    <div className="previewBox" style={{position: "relative", backgroundColor: this.state.colorOverrideEnabled && this.state.overrideColor  == "#ffffff" && this.state.currentTheme != 0 ? "gray" : "white"}}>
                        <Preview scale={0.6} currentHR={this.state.currentHR} timestamp={this.state.timestamp} batteryPercent={this.state.batteryPercent} theme={this.state.currentTheme} overrideEnabled={this.state.colorOverrideEnabled} overrideColor={this.state.overrideColor} />
                    </div>
                    <h4 className="customizationText">Customization</h4>
                    <CustomizationBar setTheme={this.setTheme} currentTheme={this.state.currentTheme} overrideEnabled={this.state.colorOverrideEnabled} setOverrideEnabled={this.setOverrideEnabled} overrideColor={this.state.overrideColor} setOverrideColor={this.setOverrideColor} />
                    <div style={{position: 'absolute', top: 90, right: 18}}><Battery percent={this.state.batteryPercent} size={54} color={'black'} labelPosition={'bottom'} labelColor='black' showPercentLabel={true}  /></div>
                    <h5 style={{position: 'absolute', top: 330, right: 20, textAlign: "right"}}>To use in OBS, create BrowserSource with the size 480x480 px and use the following URL:</h5>
                    <URLTextField url={"https://heartwear.web.app/" + firebase.auth().currentUser.uid} />
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

    setTheme = (id) =>{
        this.setState({currentTheme: id});

        firebase.database().ref("/" + this.props.uid + "/currentTheme").set(id);
    }

    setOverrideEnabled = (enabled) =>{
        this.setState({
            colorOverrideEnabled: enabled
        });

        firebase.database().ref("/" + this.props.uid + "/colorOverrideEnabled").set(enabled);
    }

    setOverrideColor = (color) =>{
        this.setState({
            overrideColor: color
        })
        firebase.database().ref("/" + this.props.uid + "/overrideColor").set(color);
    }
}

