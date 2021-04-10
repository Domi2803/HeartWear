import React, { Component } from "react";
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import './Histogram.css'

export default class Histogram extends Component {
	render() {
        if(this.props.enabled)
		return (
			<div className="histogram" id={"layout" + this.props.style} >
				<ExpandLessIcon
					className="arrow"
					id="higharrow"
					fontSize="inherit"
					style={{ fontSize: 50, color: this.props.owEnabled ? this.props.owColor : "#FA9601" }}
				/>
				<p id="highvalue" style={{ color: this.props.owEnabled ? this.props.owColor : "#FA9601" }}>
					{this.getHighValue()}
				</p>
				<ExpandMoreIcon
					className="arrow"
					id="lowarrow"
					fontSize="inherit"
					style={{ fontSize: 50, color: this.props.owEnabled ? this.props.owColor : "#008FFA" }}
				/>
				<p id={"lowvalue"} style={{ color: this.props.owEnabled ? this.props.owColor : "#008FFA" }}>
					{this.getLowValue()}
				</p>
			</div>
		);
        else
        return <span></span>
	}

    getHighValue(){
		var highest = 0;
		for(var i of this.props.histogram){
			if(i > highest) highest = i;
		}
		return highest;
	}

	getLowValue(){
		var lowest = 999;
		for(var i of this.props.histogram){
			if(i < lowest) lowest = i;
		}
		return lowest;
	}
}
