import React from 'react';
import {
	Button,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle
} from '@material-ui/core';
import Dialog from '../Dialog';

const ConfirmDialog = (props) => {
	const { open, cancel, confirm, title, message } = props;
	return (
		<Dialog open={open} onClose={cancel}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<DialogContentText>{message}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={cancel} color="primary">
					Cancel
				</Button>
				<Button onClick={confirm} color="primary" autoFocus>
					Confirm
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmDialog;
