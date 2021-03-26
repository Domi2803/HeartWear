import React, { Component } from 'react'
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import Preview from './Preview';

export default class Embed extends Component {

    state={
        currentHR: 80,
        timestamp: 1610289382480,
        batteryPercent: 15,
        currentTheme: 0,
        colorOverrideEnabled: false,
        overrideColor: "#000000"
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
        return(
            <Preview currentHR={this.state.currentHR} timestamp={this.state.timestamp} batteryPercent={this.state.batteryPercent} theme={this.state.currentTheme} overrideEnabled={this.state.colorOverrideEnabled} overrideColor={this.state.overrideColor} />
            )
    }
}
