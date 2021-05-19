import React, { Component } from 'react'
import firebase from 'firebase/app';
import 'firebase/functions';
import 'firebase/auth';
import LinkOutlinedIcon from '@material-ui/icons/LinkOutlined'
import { FilledInput, FormControl, IconButton, InputAdornment, InputLabel } from "@material-ui/core";

export default class LinkComponent extends Component {
    state={
        linkCode: "",
    }

    render() {
        return (
            <div>
                <h5 style={{position: 'absolute', top: 160, right: 20, textAlign: "right"}}>Enter Link Code to link Tizen Watches:</h5>
                <FormControl
				variant="filled"
                style={{
                    position: "absolute",
                    top: 205,
                    right: 20,
                    width: 150
                }}
			>
				<InputLabel htmlFor="embedurl">Link Code</InputLabel>

				<FilledInput
					id="embedurl"
					type="text"
					value={this.state.linkCode}
                    onChange={this.onChange}
					endAdornment={
                        <InputAdornment position="end">
							<IconButton
								aria-label="copy url"
								onClick={this.performLink}
								edge="end"
                                >
							    <LinkOutlinedIcon />
							</IconButton>
						</InputAdornment>
					}
                    />
			</FormControl></div>
        )
    }

    onChange = (e) =>{
        var val = e.target.value;
        this.setState({linkCode: val.substr(0,4)});
    }

    performLink = () =>{
        if(this.state.linkCode.length != 4){
            alert("Error: Invalid link code");
            return;
        }

        firebase.app().functions("europe-west1").httpsCallable("setLink")({linkCode: this.state.linkCode}).then((r)=>{
            alert("Successfully linked your watch!");
        }).catch((e)=>{
            alert(e);
        });
    }
}
