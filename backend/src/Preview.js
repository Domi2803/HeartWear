import React, { Component } from "react";
import heart from "./heart.png";
import pulse from "./pulse.png";
import "./Embed.css";
import LowBatteryIcon from "./battery_alert-24px.svg";
import OfflineIcon from "./cloud_off-24px.svg";

export default class Preview extends Component {
	render() {
		var timestampDiff = Date.now() - this.props.timestamp;
		return (
			<div
				style={{
					width: 480,
					height: 480,
					transform: "scale(" + this.props.scale || 1 + ")",
                    userSelect: "none"
				}}
			>
				{timestampDiff < 60000 ? (
					this.display(
						this.props.theme,
						this.props.overrideEnabled,
						this.props.overrideColor
					)
				) : (
					<div style={{ width: 480, height: 480 }}>
						<img src={OfflineIcon} id="offlineIcon" />
					</div>
				)}
			</div>
		);
	}

	display(theme, owEnabled, owColor) {
		console.log(owColor);
		switch (theme) {
			case 0:
				return (
					<div style={{ width: 480, height: 480, overflow: "hidden"}}>
						<img src={heart} id="heart" />
						<p id="heartrate" style={{ color: owEnabled ? owColor : "white" }}>
							{this.props.currentHR}
						</p>
					</div>
				);

			case 1:
				return (
					<div style={{ width: 480, height: 480, overflow: "hidden" }}>
						<p id="heartrate" style={{ color: owEnabled ? owColor : "black" }}>
							{this.props.currentHR}
						</p>
					</div>
				);

			case 2:
				return (
					<div style={{ width: 480, height: 480, overflow: "hidden" }}>
						<img
							src={pulse}
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								width: 250,
								height: 480,
								objectFit: "contain",
							}}
						/>
						<p
							id="heartrate"
							style={{ color: owEnabled ? owColor : "black", left: 130 }}
						>
							{this.props.currentHR}
						</p>
						{this.props.batteryPercent <= 15 ? (
							<img id="battery" src={LowBatteryIcon} />
						) : null}
					</div>
				);
		}
	}
}
