import React, { Fragment, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, MenuItem, CircularProgress } from '@material-ui/core';
import * as errorController from '../../../controllers/error';
import * as userController from '../../../controllers/user';
import { withRouter } from 'react-router-dom';
import { SNACKBAR } from '../../../utils/constants';
import HttpStatus from 'http-status-codes';
import ConfirmDialog from '../../../components/ConfirmDialog';
import Avatar from '../../../components/Avatar';

const AccountAvatar = withRouter((_props) => {
	const fileInputRef = useRef();
	const { authUser } = useSelector((state) => state.authState);
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [anchorElement, setAnchorElement] = useState(null);
	//Toggle upload menu
	const menuCloseHandler = () => {
		setAnchorElement(null);
	};
	//Remove profile picture
	const removeClickHandler = () => {
		setShowConfirmDialog(true);
		menuCloseHandler();
	};
	//Open file dowload to select an image to upload
	const uploadClickHandler = () => {
		fileInputRef.current.click();
		menuCloseHandler();
	};
	//Close confirm dialog
	const cancelClickHandler = () => {
		setShowConfirmDialog(false);
	};
	//Once confirmed, dispatch action to remove pofile picture
	const confirmClickHandler = async () => {
		setLoading(true);
		await dispatch(userController.removePicture());
		setLoading(false);
		setShowConfirmDialog(false);
	};
	//Once a file is selected, upload the image
	const fileSelectedHandler = async (event) => {
		setLoading(true);
		const files = [...event.target.files];
		if (files.length === 1) {
			try {
				if (!files[0].type.includes('image')) {
					throw new Error('File must a valid image');
				}
				await dispatch(userController.uploadPicture(files[0]));
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
		fileInputRef.current.value = null;
	};

	return (
		<Fragment>
			<ConfirmDialog
				open={showConfirmDialog}
				cancel={cancelClickHandler}
				confirm={confirmClickHandler}
				title="Profile Picture"
				message="Are you sure you want to remove your profile picture?"
			/>
			<Avatar
				size={5}
				user={authUser}
				clickable={true}
				onClick={(event) => setAnchorElement(event.target)}
				customFallback={loading ? <CircularProgress /> : null}
			/>
			<input
				type="file"
				accept="image/*"
				hidden
				ref={fileInputRef}
				onChange={fileSelectedHandler}
			/>

			<Menu
				id="simple-menu"
				anchorEl={anchorElement}
				keepMounted
				open={!!anchorElement}
				onClose={menuCloseHandler}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
				getContentAnchorEl={null}
			>
				<MenuItem onClick={uploadClickHandler}>Upload Picture</MenuItem>
				<MenuItem onClick={removeClickHandler}>Remove Picture</MenuItem>
			</Menu>
		</Fragment>
	);
});

export default AccountAvatar;
