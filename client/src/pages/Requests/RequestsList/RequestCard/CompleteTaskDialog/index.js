import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	Paper,
	Typography
} from '@material-ui/core';
import React, { useState, useRef } from 'react';
import ImageIcon from '@material-ui/icons/ImageOutlined';
import * as errorController from '../../../../../controllers/error';
import HttpStatus from 'http-status-codes';
import { SNACKBAR } from '../../../../../utils/constants';
import { useDispatch } from 'react-redux';
import * as requestController from '../../../../../controllers/request';

const CompleteTaskDialog = (props) => {
	const { request } = props;
	const fileInputRef = useRef();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState();
	const { open, setOpen } = props;

	const dialogCloseHandler = () => {
		setOpen(false);
		setFile(null);
	};

	const fileSelectedHandler = (event) => {
		const files = [...event.target.files];
		if (files.length === 1) {
			try {
				if (!files[0].type.includes('image')) {
					throw new Error('File must a valid image');
				}
				setFile(files[0]);
			} catch (error) {
				dispatch(
					errorController.setError({
						status: HttpStatus.BAD_REQUEST,
						statusText: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST),
						message: error.message,
						feedback: SNACKBAR
					})
				);
			}
			fileInputRef.current.value = null;
		}
	};

	const completeTaskClickHandler = async () => {
		setLoading(true);
		const result = await dispatch(requestController.complete(request, file));
		if (result) {
			dialogCloseHandler();
		}
		setLoading(false);
	};

	return (
		<Dialog maxWidth="xs" fullWidth open={open} onClose={dialogCloseHandler}>
			<input
				type="file"
				accept="image/*"
				hidden
				ref={fileInputRef}
				onChange={fileSelectedHandler}
			/>
			<DialogTitle>Upload proof</DialogTitle>
			<DialogContent>
				<Grid container direction="column" alignItems="center" spacing={2}>
					{file && (
						<Grid
							item
							container
							direction="column"
							alignItems="center"
							spacing={1}
						>
							<Grid item>
								<Paper variant="outlined">
									<img
										alt="preview"
										src={URL.createObjectURL(file)}
										style={{ width: '100%', height: 'auto' }}
									/>
								</Paper>
							</Grid>
							<Grid item>
								<Typography>{file.name}</Typography>
							</Grid>
						</Grid>
					)}
					<Grid item>
						<Button
							variant="contained"
							color="primary"
							disabled={loading}
							onClick={() => fileInputRef.current.click()}
						>
							<ImageIcon />
							Upload Image
						</Button>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button
					type="submit"
					variant="contained"
					color="primary"
					disabled={!file || loading}
					onClick={completeTaskClickHandler}
				>
					Confirm
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CompleteTaskDialog;
