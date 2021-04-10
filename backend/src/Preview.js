import React, { Component } from "react";
import heart from "./heart.png";
import pulse from "./pulse.png";
import "./Embed.css";
import LowBatteryIcon from "./battery_alert-24px.svg";
import OfflineIcon from "./cloud_off-24px.svg";

import Histogram from "./Histogram";
import LineGraph from "smooth-line-graph";

export default class Preview extends Component {
	state = {
		histogram: [],
		lastHRValue: 0,
	};

	render() {
		var timestampDiff = Date.now() - this.props.timestamp;

		// Histogram
		var currentHR = this.props.currentHR;
		if (currentHR != this.state.lastHRValue && currentHR > 0)
			this.setState((state) => {
				var histogram = state.histogram;
				var histogramLength = this.props.histogramLength;
				if (!histogramLength) histogramLength = 10;

				if (histogram[histogram.length - 1] != currentHR)
					histogram.push(currentHR);

				if (histogram.length > histogramLength) histogram.splice(0, 1);

				return {
					histogram: histogram,
					lastHRValue: currentHR,
				};
			});

		return (
			<div
				style={{
					width: 480,
					height: 480,
					transform: "scale(" + this.props.scale || 1 + ")",
					userSelect: "none",
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

		
			var data = [];

			for(var value in this.state.histogram){
				data.push([value, this.state.histogram[value]])
			}

			if(data.length == 0){
				data.push([0, 0]);
				data.push([1, 0]);
			}



		console.log(owColor);
		switch (theme) {
			case 0:
				return (
					<div style={{ width: 480, height: 480, overflow: "hidden" }}>
						<img src={heart} id="heart" />
						<p id="heartrate" style={{ color: owEnabled ? owColor : "white" }}>
							{this.props.currentHR}
						</p>
						<Histogram
							enabled={this.props.histogramEnabled}
							style={0}
							histogram={this.state.histogram}
							owColor={owColor}
							owEnabled={owEnabled}
						/>
					</div>
				);

			case 1:
				return (
					<div style={{ width: 480, height: 480, overflow: "hidden" }}>
						<p id="heartrate" style={{ color: owEnabled ? owColor : "black" }}>
							{this.props.currentHR}
						</p>
						<Histogram
							enabled={this.props.histogramEnabled}
							style={1}
							histogram={this.state.histogram}
							owColor={owColor}
							owEnabled={owEnabled}
						/>
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
						<Histogram
							enabled={this.props.histogramEnabled}
							style={2}
							histogram={this.state.histogram}
							owColor={owColor}
							owEnabled={owEnabled}
						/>
					</div>
				);
			case 3:
				return (
					<div style={{ width: 480, height: 480, overflow: "hidden" }}>
						<div
							style={{
								position: "absolute",
								top: 115,
								left: 0,
								objectFit: "contain",
							}}
						>
							<LineGraph
								width={250}
								height={250}
								interactive={false}
								padding={[40, 40, 40, 40]}
								lines={[
									{
										key: "mykey",
										data: data,
										color: "red",
										strokeWidth: 20,
										smooth: true
									},
								]}
							/>
						</div>
						<p
							id="heartrate"
							style={{ color: owEnabled ? owColor : "black", left: 130 }}
						>
							{this.props.currentHR}
						</p>
						<Histogram
							enabled={this.props.histogramEnabled}
							style={2}
							histogram={this.state.histogram}
							owColor={owColor}
							owEnabled={owEnabled}
						/>
					</div>
				);
		}
	}
}
