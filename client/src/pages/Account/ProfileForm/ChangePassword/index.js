import React, { useEffect, useState } from 'react';
import {
	Dialog,
	DialogActions,
	InputAdornment,
	IconButton,
	Button,
	Grid,
	TextField,
	DialogContent
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import * as userController from '../../../../controllers/user';
import * as messsageActions from '../../../../controllers/message';
import { SNACKBAR } from '../../../../utils/constants';
import DialogTitle from '../../../../components/DialogTitle';

const ChangePassword = (props) => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
	const [validatedOnMount, setValidatedOnMount] = useState(false);

	const initialValues = {
		currentPassword: '',
		password: '',
		passwordConfirm: ''
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
		onSubmit: submitHandler,
		validationSchema: validationSchema
	});

	const { validateForm } = formik;
	useEffect(() => {
		validateForm();
		setValidatedOnMount(true);
	}, [validateForm]);

	return (
		<Dialog
			fullWidth
			maxWidth="xs"
			open={props.showPasswordDialog}
			onClose={dialogCloseHandler}
		>
			<form onSubmit={formik.handleSubmit}>
				<DialogTitle>Update Password</DialogTitle>
				<DialogContent>
					<Grid container direction="column" spacing={1}>
						<Grid item>
							<TextField
								label="Current password"
								type={showCurrentPassword ? 'text' : 'password'}
								value={formik.values.currentPassword}
								onChange={formik.handleChange('currentPassword')}
								onBlur={formik.handleBlur('currentPassword')}
								error={
									!!formik.touched.currentPassword &&
									!!formik.errors.currentPassword
								}
								helperText={
									formik.touched.currentPassword &&
									formik.errors.currentPassword
								}
								autoFocus={true}
								fullWidth={true}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												tabIndex={-1}
												onClick={() =>
													setShowCurrentPassword(
														(prevShowCurrentPassword) =>
															!prevShowCurrentPassword
													)
												}
											>
												{showCurrentPassword ? (
													<Visibility />
												) : (
													<VisibilityOff />
												)}
											</IconButton>
										</InputAdornment>
									)
								}}
							/>
						</Grid>
						<Grid item>
							<TextField
								label="New password"
								type={showPassword ? 'text' : 'password'}
								value={formik.values.password}
								onChange={formik.handleChange('password')}
								onBlur={formik.handleBlur('password')}
								error={!!formik.touched.password && !!formik.errors.password}
								helperText={formik.touched.password && formik.errors.password}
								fullWidth={true}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												tabIndex={-1}
												onClick={() =>
													setShowPassword(
														(prevShowPassword) => !prevShowPassword
													)
												}
											>
												{showPassword ? <Visibility /> : <VisibilityOff />}
											</IconButton>
										</InputAdornment>
									)
								}}
							/>
						</Grid>
						<Grid item>
							<TextField
								label="Confirm new password"
								type={showPasswordConfirm ? 'text' : 'password'}
								value={formik.values.passwordConfirm}
								onChange={formik.handleChange('passwordConfirm')}
								onBlur={formik.handleBlur('passwordConfirm')}
								error={
									!!formik.touched.passwordConfirm &&
									!!formik.errors.passwordConfirm
								}
								helperText={
									formik.touched.passwordConfirm &&
									formik.errors.passwordConfirm
								}
								fullWidth={true}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												tabIndex={-1}
												onClick={() =>
													setShowPasswordConfirm(
														(prevShowPasswordConfirm) =>
															!prevShowPasswordConfirm
													)
												}
											>
												{showPasswordConfirm ? (
													<Visibility />
												) : (
													<VisibilityOff />
												)}
											</IconButton>
										</InputAdornment>
									)
								}}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={dialogCloseHandler}
						color="primary"
						disabled={loading}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="primary"
						type="submit"
						disabled={!formik.isValid || loading || !validatedOnMount}
					>
						Confirm
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default ChangePassword;
