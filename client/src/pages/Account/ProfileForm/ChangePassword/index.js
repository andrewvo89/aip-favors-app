import React, { useState } from 'react';
import {
	Dialog,
	DialogActions,
	FormControl,
	InputLabel,
	InputAdornment,
	IconButton,
	Button
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { StyledInput } from '../../../../utils/styled-components';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { StyledDialogContent, StyledDialogTitle } from './styled-components';
import { useDispatch } from 'react-redux';
import * as userController from '../../../../controllers/user';
import * as messsageActions from '../../../../controllers/message';
import { SNACKBAR } from '../../../../utils/constants';

const ChangePassword = (props) => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

	const initialValues = {
		currentPassword: '',
		password: '',
		passwordConfirm: ''
	};

	const initialErrors = {
		currentPassword: true,
		password: true,
		passwordConfirm: true
	};

	const validationSchema = yup.object().shape({
		currentPassword: yup.string().label('Password').required(),
		password: yup.string().label('New password').required().min(6).max(50),
		passwordConfirm: yup
			.string()
			.label('Confirmation password')
			.required()
			.min(6)
			.max(50)
			.oneOf(
				[yup.ref('password')],
				'Confirmation password must match password.'
			)
	});

	const dialogCloseHandler = () => {
		if (!loading) {
			props.setShowPasswordDialog(false);
		}
	};

	const submitHandler = async (values, _actions) => {
		setLoading(true);
		const result = await dispatch(userController.updatePassword(values));
		if (result) {
			dispatch(
				messsageActions.setMessage({
					title: 'Password Update',
					text: 'Your password has been updated successfully',
					feedback: SNACKBAR
				})
			);
			dialogCloseHandler();
		} else {
			setLoading(false);
		}
	};

	const formik = useFormik({
		initialValues: initialValues,
		initialStatus: initialErrors,
		onSubmit: submitHandler,
		validationSchema: validationSchema
	});

	return (
		<Dialog open={props.showPasswordDialog} onClose={dialogCloseHandler}>
			<form onSubmit={formik.handleSubmit}>
				<StyledDialogTitle>Update Password</StyledDialogTitle>
				<StyledDialogContent>
					<FormControl margin="dense">
						<InputLabel>Current password</InputLabel>
						<StyledInput
							type={showCurrentPassword ? 'text' : 'password'}
							value={formik.values.currentPassword}
							onChange={formik.handleChange('currentPassword')}
							onBlur={formik.handleBlur('currentPassword')}
							error={
								!!formik.touched.currentPassword &&
								!!formik.errors.currentPassword
							}
							autoFocus={true}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										tabIndex={-1}
										onClick={() =>
											setShowCurrentPassword(
												(prevShowCurrentPassword) => !prevShowCurrentPassword
											)
										}>
										{showCurrentPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							}
						/>
					</FormControl>
					<FormControl margin="dense">
						<InputLabel>New password</InputLabel>
						<StyledInput
							type={showPassword ? 'text' : 'password'}
							value={formik.values.password}
							onChange={formik.handleChange('password')}
							onBlur={formik.handleBlur('password')}
							error={!!formik.touched.password && !!formik.errors.password}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										tabIndex={-1}
										onClick={() =>
											setShowPassword((prevShowPassword) => !prevShowPassword)
										}>
										{showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							}
						/>
					</FormControl>
					<FormControl margin="dense">
						<InputLabel>Confirm new password</InputLabel>
						<StyledInput
							type={showPasswordConfirm ? 'text' : 'password'}
							value={formik.values.passwordConfirm}
							onChange={formik.handleChange('passwordConfirm')}
							onBlur={formik.handleBlur('passwordConfirm')}
							error={
								!!formik.touched.passwordConfirm &&
								!!formik.errors.passwordConfirm
							}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										tabIndex={-1}
										onClick={() =>
											setShowPasswordConfirm(
												(prevShowPasswordConfirm) => !prevShowPasswordConfirm
											)
										}>
										{showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							}
						/>
					</FormControl>
				</StyledDialogContent>
				<DialogActions>
					<Button
						onClick={dialogCloseHandler}
						color="primary"
						disabled={loading}>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="primary"
						type="submit"
						disabled={!formik.isValid || loading}>
						Confirm
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default ChangePassword;
