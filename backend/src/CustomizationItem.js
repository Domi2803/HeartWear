import React, { Component } from 'react'
import './CustomizationItem.css'

export default class CustomizationItem extends Component {
    render() {
        return (
            <div style={{
                position: "relative",
                width: 180,
                height: 180,
                margin: 5,
                borderStyle: "solid",
                borderRadius: 10,
                backgroundColor: this.props.selected ? "#abffc1" : "#ffffff",
                borderWidth: 2,
                borderColor: "#727272",
                cursor: "pointer"
            }} onClick={this.props.onSelected} className="box">
                <img src={this.props.previewImage} style={{position: "absolute", top: 0, left: 0, width: 140, height: 140, objectFit: "contain", padding: 20}} />
            </div>
        )
    }
}
