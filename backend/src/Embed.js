import React, { Component } from 'react'
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import heart from './heart.png'
import './Embed.css'
import LowBatteryIcon from './battery_alert-24px.svg';
import OfflineIcon from './cloud_off-24px.svg';

export default class Embed extends Component {

    state={
        currentHR: 80,
        timestamp: 1610289382480,
        batteryPercent: 15
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
        console.log(timestampDiff);
        if(timestampDiff < 60000){
            return (
                <div>
                    <img src={heart} id="heart" />
                    <p id="heartrate">{this.state.currentHR}</p>
                    {this.state.batteryPercent <= 15 ? <img id="battery" src={LowBatteryIcon} /> : null}
                </div>
            )
        }else{
            return (
                <img src={OfflineIcon} id="offlineIcon" />
            )
        }
    }
}
