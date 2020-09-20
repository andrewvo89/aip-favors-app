import React, { useState } from 'react';
import {
	IconButton,
	InputAdornment,
	CircularProgress,
	TextField,
	Grid,
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
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const initialValues = {
		email: '',
		password: ''
	};

	const initialErrors = {
		email: true,
		password: true
	};

	const validationSchema = yup.object().shape({
		email: yup.string().label('email').required().email().max(100),
		password: yup.string().label('password').required().min(6).max(50)
	});

	const signupClickHandler = () => {
		props.setSignup(true);
	};

	const submitHandler = async (values) => {
		setLoading(true);
		const result = await dispatch(authController.login(values));
		if (!result) {
			setLoading(false); //If login passed, cannot perform this action on unmounted component
		}
	};

	const formik = useFormik({
		initialValues: initialValues,
		initialErrors: initialErrors,
		onSubmit: submitHandler,
		validationSchema: validationSchema
	});

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
					{loading ? (
						<CircularProgress />
					) : (
						<Grid container direction="column" spacing={1}>
							<Grid item>
								<FullWidthButton
									variant="contained"
									color="primary"
									type="submit"
									disabled={!formik.isValid}
								>
									Login
								</FullWidthButton>
							</Grid>
							<Grid item>
								<FullWidthButton
									variant="outlined"
									color="primary"
									onClick={signupClickHandler}
								>
									Signup
								</FullWidthButton>
							</Grid>
						</Grid>
					)}
				</CardActions>
			</form>
		</Card>
	);
};
