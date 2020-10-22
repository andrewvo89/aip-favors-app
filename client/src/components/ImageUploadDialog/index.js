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
import { useDispatch } from 'react-redux';
import ImageIcon from '@material-ui/icons/ImageOutlined';
import * as errorController from '../../controllers/error';
import HttpStatus from 'http-status-codes';
import { SNACKBAR } from '../../utils/constants';

const ImageUploadDialog = (props) => {
	const { open, setOpen, loading, title, confirmHandler } = props;
	const fileInputRef = useRef();
	const dispatch = useDispatch();
	const [file, setFile] = useState();

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

	return (
		<Dialog maxWidth="xs" fullWidth open={open} onClose={dialogCloseHandler}>
			<input
				type="file"
				accept="image/*"
				hidden
				ref={fileInputRef}
				onChange={fileSelectedHandler}
			/>
			<DialogTitle>{title}</DialogTitle>
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
										alt="file"
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
					onClick={() => confirmHandler(file)}
				>
					Confirm
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ImageUploadDialog;
