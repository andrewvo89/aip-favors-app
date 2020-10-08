import React, { Fragment, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import ImageIcon from '@material-ui/icons/ImageOutlined';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import HttpStatus from 'http-status-codes';
import { SNACKBAR } from '../../../utils/constants';
import * as errorController from '../../../controllers/error';
import * as favourController from '../../../controllers/favour';

const useStyles = makeStyles({
	uploadButton: {
		marginTop: 16,
		marginBottom: 4
	},
	imageIcon: {
		marginRight: 4
	}
});

function ImageUploader({ imageUrl, handleSetImage }) {
	const classes = useStyles();
	const fileInputRef = useRef();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);

	const handleFileSelected = async (event) => {
		fileInputRef.current.click();
		setLoading(true);

		const files = [...event.target.files];
		if (files.length === 1) {
			try {
				if (!files[0].type.includes('image')) {
					throw new Error('File must be a valid image');
				}

				const imageUrl = await dispatch(favourController.uploadImage(files[0]));
				handleSetImage(imageUrl);
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
		}
		// fileInputRef.current.value = null;
		setLoading(false);
	};

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<Fragment>
			<input
				accept="image/*"
				id="act-image-file"
				type="file"
				hidden
				ref={fileInputRef}
				onChange={handleFileSelected}
			/>
			<label htmlFor="act-image-file">
				<Button 
					className={classes.uploadButton}
					variant="contained" 
					color="primary" 
					component="span"
				>
					<ImageIcon className={classes.imageIcon} />
					Upload Proof
				</Button>
			</label>
			{imageUrl && (
				'Image uploaded.'
			)}
		</Fragment>
	);
}

export default ImageUploader;
