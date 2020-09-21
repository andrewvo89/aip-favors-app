import { Dialog, DialogActions, DialogContent } from '@material-ui/core';
import React from 'react';

const CompleteTaskDialog = (props) => {
	const { open, setOpen } = props;

	return (
		<Dialog open={true}>
			<DialogContent></DialogContent>
			<DialogActions></DialogActions>
		</Dialog>
	);
};

export default CompleteTaskDialog;
