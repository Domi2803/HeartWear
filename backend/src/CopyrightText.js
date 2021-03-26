import React, { Component } from "react";

export default class CopyrightText extends Component {
	render() {
		return (
			<p
				style={{
					position: "fixed",
					bottom: 0,
					right: 0,
					margin: 0,
                    color: "#aaaaaa",
                    zIndex: -10
				}}
			>
				(c) 2021 Domi2803 github.com/Domi2803/HeartWear
			</p>
		);
	}
}
