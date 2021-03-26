import React, { Component } from 'react'
import './CustomizationBar.css'
import CustomizationItem from './CustomizationItem'
import HeartShapePreview from './previewImages/previewHeartShape.png';
import HeartLinePreview from './previewImages/previewHeartLine.png';
import TextOnlyPreview from './previewImages/previewTextOnly.png';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import {CompactPicker} from 'react-color';

export default class CustomizationBar extends Component {
    render() {
        return (
            <div className="bar">
                <CustomizationItem selected={this.props.currentTheme == 1} previewImage={TextOnlyPreview} onSelected={()=>this.props.setTheme(1)}/> {/* Text Only */}
                <CustomizationItem selected={this.props.currentTheme == 0} previewImage={HeartShapePreview} onSelected={()=>this.props.setTheme(0)}/> {/* Heart Shape */}
                <CustomizationItem selected={this.props.currentTheme == 2} previewImage={HeartLinePreview} onSelected={()=>this.props.setTheme(2)}/> {/* Heart Line */}
                <div style={{position: "relative",
                width: 250  ,
                height: 180,
                margin: 5,
                borderStyle: "solid",
                borderRadius: 10,
                borderWidth: 2,
                borderColor: "#727272",userSelect: 'none'}}>
                    <FormControlLabel
                        control={
                        <Checkbox
                            checked={this.props.overrideEnabled}
                            onChange={(ev)=>this.props.setOverrideEnabled(ev.target.checked)}
                            color="primary"

                        />
                        }
                        label="Override Text Color"
                        style={{marginTop: 10}}
                    />

                    <div style={{marginTop: 30}}><CompactPicker color={this.props.overrideColor} onChange={(e)=>this.props.setOverrideColor(e.hex)} /></div>
                </div>
            </div>
        )
    }
}
