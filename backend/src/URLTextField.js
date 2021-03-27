import { FilledInput, FormControl, IconButton, InputAdornment, InputLabel } from "@material-ui/core";
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import React, { Component } from "react";


export default class URLTextField extends Component {
    textfieldRef = null;

	render() {
		return (
			<FormControl
				variant="filled"
                style={{
                    position: "absolute",
                    top: 380,
                    right: 20,
                    width: 550
                }}
			>
				<InputLabel htmlFor="embedurl">Embed URL</InputLabel>
				<FilledInput
					id="embedurl"
					type="text"
					value={this.props.url}
                    readOnly
					endAdornment={
						<InputAdornment position="end">
							<IconButton
								aria-label="copy url"
								onClick={this.handleCopyClick}
								edge="end"
							>
							    <FileCopyOutlinedIcon />
							</IconButton>
						</InputAdornment>
					}
				/>
			</FormControl>
		);
	}

    handleCopyClick = ()=>{
        navigator.clipboard.writeText(this.props.url);
    }
}
