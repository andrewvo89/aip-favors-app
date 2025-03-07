import React, { Fragment, useEffect, useState } from 'react';
import {
	IconButton,
	InputAdornment,
	CircularProgress,
	TextField,
	Grid,
	CardActions,
	CardContent,
	Card,
	Button
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import * as authController from '../../../controllers/auth';
import CardHeader from '../../../components/CardHeader';

export default (props) => {
	const dispatch = useDispatch();
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [validatedOnMount, setValidatedOnMount] = useState(false);
	//Initialize form values
	const initialValues = {
		email: '',
		password: ''
	};

	const validationSchema = yup.object().shape({
		email: yup.string().label('Email').required().email().max(100),
		password: yup.string().label('Password').required().min(6).max(50)
	});
	//Create schema for form
	const signupClickHandler = () => {
		props.setSignup(true);
	};
	//Action to login
	const submitHandler = async (values) => {
		setLoading(true);
		const result = await dispatch(authController.login(values));
		if (!result) {
			setLoading(false); //If login passed, cannot perform this action on unmounted component
		}
	};
	//Initialize formik hook
	const formik = useFormik({
		initialValues: initialValues,
		onSubmit: submitHandler,
		validationSchema: validationSchema
	});
	//Validate form upon mounting
	const { validateForm } = formik;
	useEffect(() => {
		validateForm();
		setValidatedOnMount(true);
	}, [validateForm]);

	return (
		<Card>
			<form onSubmit={formik.handleSubmit}>
				<CardHeader title="Login" />
				<CardContent>
					<Grid container direction="column" spacing={1}>
						<Grid item>
							<TextField
								label="Email"
								margin="dense"
								type="email"
								value={formik.values.email}
								onChange={formik.handleChange('email')}
								onBlur={formik.handleBlur('email')}
								error={!!formik.touched.email && !!formik.errors.email}
								autoFocus={true}
								fullWidth={true}
								helperText={formik.touched.email && formik.errors.email}
							/>
						</Grid>
						<Grid item>
							<TextField
								label="Password"
								margin="dense"
								type={showPassword ? 'text' : 'password'}
								value={formik.values.password}
								onChange={formik.handleChange('password')}
								onBlur={formik.handleBlur('password')}
								error={!!formik.touched.password && !!formik.errors.password}
								fullWidth={true}
								helperText={formik.touched.password && formik.errors.password}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												onClick={() =>
													setShowPassword(
														(prevShowPassword) => !prevShowPassword
													)
												}
												tabIndex={-1}
											>
												{showPassword ? <Visibility /> : <VisibilityOff />}
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
									<Button
										fullWidth
										variant="contained"
										color="primary"
										type="submit"
										disabled={!formik.isValid || !validatedOnMount}
									>
										Login
									</Button>
								</Grid>
								<Grid item>
									<Button
										fullWidth
										variant="outlined"
										color="primary"
										onClick={signupClickHandler}
									>
										Signup
									</Button>
								</Grid>
							</Fragment>
						)}
					</Grid>
				</CardActions>
			</form>
		</Card>
	);
};
