import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	Dialog,
	DialogActions,
	DialogContentText,
	DialogTitle,
	Button,
	Snackbar,
	DialogContent
} from '@material-ui/core/';
import { Alert, AlertTitle } from '@material-ui/lab';
import * as messageController from '../controllers/message';
import { DIALOG, SILENT, SNACKBAR } from './constants';

const MessageProvider = (props) => {
	const dispatch = useDispatch();
	const { message } = useSelector((state) => state.messageState);

	const messageClearHandler = () => {
		dispatch(messageController.clearMessage());
	};

	let messageComponent;
	if (message) {
		const { title, text, feedback } = message;
		switch (feedback) {
			case DIALOG:
				messageComponent = (
					<Dialog open={feedback === DIALOG} onClose={messageClearHandler}>
						<DialogTitle>{title}</DialogTitle>
						<DialogContent>
							<DialogContentText>{text}</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={messageClearHandler} color="primary" autoFocus>
								Close
							</Button>
						</DialogActions>
					</Dialog>
				);
				break;
			case SNACKBAR:
				messageComponent = (
					<Snackbar
						open={feedback === SNACKBAR}
						autoHideDuration={5000}
						onClose={messageClearHandler}
					>
						<Alert
							onClose={messageClearHandler}
							severity="info"
							variant="filled"
							elevation={6}
						>
							{title && <AlertTitle>{title}</AlertTitle>}
							{text}
						</Alert>
					</Snackbar>
				);
				break;
			case SILENT:
				messageComponent = null;
				break;
			default:
				break;
		}
	}

	return (
		<Fragment>
			{messageComponent}
			{props.children}
		</Fragment>
	);
};

export default MessageProvider;
