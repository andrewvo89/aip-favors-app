import React, { useState, Fragment } from 'react';
import {
	IconButton,
	InputAdornment,
	FormControl,
	InputLabel,
	CircularProgress
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import {
	StyledCard,
	StyledButton,
	StyledInput,
	StyledCardContent,
	StyledCardActions,
	StyledCardHeader
} from '../../../utils/styled-components';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import * as authController from '../../../controllers/auth';

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
		initialStatus: initialErrors,
		onSubmit: submitHandler,
		validationSchema: validationSchema
	});

	return (
		<StyledCard>
			<form onSubmit={formik.handleSubmit}>
				<StyledCardHeader title="Login" />
				<StyledCardContent>
					<FormControl margin="dense">
						<InputLabel>Email</InputLabel>
						<StyledInput
							type="email"
							value={formik.values.email}
							onChange={formik.handleChange('email')}
							onBlur={formik.handleBlur('email')}
							error={!!formik.touched.email && !!formik.errors.email}
							autoFocus={true}
						/>
					</FormControl>
					<FormControl margin="dense">
						<InputLabel>Password</InputLabel>
						<StyledInput
							type={showPassword ? 'text' : 'password'}
							value={formik.values.password}
							onChange={formik.handleChange('password')}
							onBlur={formik.handleBlur('password')}
							error={!!formik.touched.password && !!formik.errors.password}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										onClick={() =>
											setShowPassword((prevShowPassword) => !prevShowPassword)
										}
										tabIndex={-1}>
										{showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							}
						/>
					</FormControl>
				</StyledCardContent>
				<StyledCardActions>
					{loading ? (
						<CircularProgress />
					) : (
						<Fragment>
							<StyledButton
								variant="contained"
								color="primary"
								type="submit"
								disabled={!formik.isValid}>
								Login
							</StyledButton>
							<StyledButton
								variant="outlined"
								color="primary"
								onClick={signupClickHandler}>
								Signup
							</StyledButton>
						</Fragment>
					)}
				</StyledCardActions>
			</form>
		</StyledCard>
	);
};
