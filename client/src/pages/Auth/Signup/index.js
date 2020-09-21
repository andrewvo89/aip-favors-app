import React, { Fragment, useState } from 'react';
import {
	IconButton,
	InputAdornment,
	Grid,
	CircularProgress,
	TextField,
	CardActions,
	CardContent
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import * as authController from '../../../controllers/auth';
import FullWidthButton from '../../../components/FullWidthButton';
import Card from '../../../components/Card';
import CardHeader from '../../../components/CardHeader';

export default (props) => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

	const initialValues = {
		email: '',
		password: '',
		passwordConfirm: '',
		firstName: '',
		lastName: ''
	};

	const initialErrors = {
		email: true,
		password: true,
		passwordConfirm: true,
		firstName: true,
		lastName: true
	};

	const validationSchema = yup.object().shape({
		firstName: yup.string().label('First name').required().max(50),
		lastName: yup.string().label('Last name').required().max(50),
		email: yup.string().label('Email').required().email().max(100),
		password: yup.string().label('Password').required().min(6).max(50),
		passwordConfirm: yup
			.string()
			.label('Confirmation password')
			.required()
			.oneOf(
				[yup.ref('password')],
				'Confirmation password must match password.'
			)
	});

	const backClickHandler = () => {
		props.setSignup(false);
	};

	const submitHandler = async (values) => {
		setLoading(true);
		const result = await dispatch(authController.signup(values));
		if (!result) {
			//If login failed, set loading to false
			setLoading(false); //If login passed, cannot perform this action on unmounted component
		}
	};

	const formik = useFormik({
		initialValues: initialValues,
		initialStatus: initialErrors,
		onSubmit: submitHandler,
		validationSchema: validationSchema
	});

	return (
		<Card>
			<form onSubmit={formik.handleSubmit}>
				<CardHeader title="Signup" />
				<CardContent>
					<Grid container direction="column" spacing={1}>
						<Grid item container spacing={2}>
							<Grid item xs={6}>
								<TextField
									label="First name"
									type="text"
									value={formik.values.firstName}
									onChange={formik.handleChange('firstName')}
									onBlur={formik.handleBlur('firstName')}
									error={
										!!formik.touched.firstName && !!formik.errors.firstName
									}
									autoFocus={true}
									fullWidth={true}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									label="Last name"
									type="text"
									value={formik.values.lastName}
									onChange={formik.handleChange('lastName')}
									onBlur={formik.handleBlur('lastName')}
									error={!!formik.touched.lastName && !!formik.errors.lastName}
									fullWidth={true}
								/>
							</Grid>
						</Grid>
						<Grid item>
							<TextField
								label="Email"
								type="email"
								value={formik.values.email}
								onChange={formik.handleChange('email')}
								onBlur={formik.handleBlur('email')}
								error={!!formik.touched.email && !!formik.errors.email}
								fullWidth={true}
							/>
						</Grid>
						<Grid item>
							<TextField
								label="Password"
								type={showPassword ? 'text' : 'password'}
								value={formik.values.password}
								onChange={formik.handleChange('password')}
								onBlur={formik.handleBlur('password')}
								error={!!formik.touched.password && !!formik.errors.password}
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
								label="Confirm password"
								type={showPasswordConfirm ? 'text' : 'password'}
								value={formik.values.passwordConfirm}
								onChange={formik.handleChange('passwordConfirm')}
								onBlur={formik.handleBlur('passwordConfirm')}
								error={
									!!formik.touched.passwordConfirm &&
									!!formik.errors.passwordConfirm
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
				</CardContent>
				<CardActions>
					<Grid
						container
						direction="column"
						spacing={1}
						alignItems={loading ? 'center' : 'stretch'}
					>
						{loading ? (
							<Grid item>
								<CircularProgress />
							</Grid>
						) : (
							<Fragment>
								<Grid item>
									<FullWidthButton
										variant="contained"
										color="primary"
										type="submit"
										disabled={!formik.isValid}
									>
										Signup
									</FullWidthButton>
								</Grid>
								<Grid item>
									<FullWidthButton
										variant="outlined"
										color="primary"
										onClick={backClickHandler}
									>
										Back
									</FullWidthButton>
								</Grid>
							</Fragment>
						)}
					</Grid>
				</CardActions>
			</form>
		</Card>
	);
};
