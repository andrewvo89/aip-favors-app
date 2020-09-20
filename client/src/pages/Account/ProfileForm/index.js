import React, { Fragment, useState } from 'react';
import {
	FormControl,
	InputLabel,
	Grid,
	CircularProgress
} from '@material-ui/core';
import {
	StyledCardContent,
	StyledCardHeader,
	StyledCardActions,
	StyledButton,
	StyledLink
} from './styled-components';
import { StyledInput } from '../../../utils/styled-components';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import * as userController from '../../../controllers/user';
import * as messsageActions from '../../../controllers/message';
import ChangePassword from './ChangePassword';
import { SNACKBAR } from '../../../utils/constants';
import AccountAvatar from '../AccountAvatar';

const ProfileForm = () => {
	const { authUser } = useSelector((state) => state.authState);
	const dispatch = useDispatch();

	const [showPasswordDialog, setShowPasswordDialog] = useState(false);
	const [loading, setLoading] = useState(false);

	const initialValues = {
		email: authUser.email,
		password: '',
		passwordConfirm: '',
		firstName: authUser.firstName,
		lastName: authUser.lastName
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
		email: yup.string().label('Email').required().email().max(100)
	});

	const submitHandler = async (values, _actions) => {
		setLoading(true);
		const result = await dispatch(
			userController.update({
				email: values.email.trim().toLowerCase(),
				firstName: values.firstName.trim(),
				lastName: values.lastName.trim()
			})
		);
		if (result) {
			dispatch(
				messsageActions.setMessage({
					title: 'Profile Update',
					text: 'Your details have been updated successfully',
					feedback: SNACKBAR
				})
			);
		}
		setLoading(false);
	};

	const formik = useFormik({
		initialValues: initialValues,
		initialStatus: initialErrors,
		onSubmit: submitHandler,
		validationSchema: validationSchema
	});

	return (
		<Fragment>
			{showPasswordDialog && ( //Remount each time so that fields are cleared
				<ChangePassword
					setShowPasswordDialog={setShowPasswordDialog}
					showPasswordDialog={showPasswordDialog}
				/>
			)}
			<form onSubmit={formik.handleSubmit}>
				<StyledCardHeader
					title={
						<Grid container direction="column" alignItems="center">
							<Grid item>
								<AccountAvatar />
							</Grid>
							<Grid item>
								<span>User Profile</span>
							</Grid>
						</Grid>
					}
					subheader="23 favours completed"
				/>
				<StyledCardContent>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<FormControl margin="dense">
								<InputLabel>First name</InputLabel>
								<StyledInput
									type="text"
									value={formik.values.firstName}
									onChange={formik.handleChange('firstName')}
									onBlur={formik.handleBlur('firstName')}
									error={
										!!formik.touched.firstName && !!formik.errors.firstName
									}
									autoFocus={true}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={6}>
							<FormControl margin="dense">
								<InputLabel>Last name</InputLabel>
								<StyledInput
									type="text"
									value={formik.values.lastName}
									onChange={formik.handleChange('lastName')}
									onBlur={formik.handleBlur('lastName')}
									error={!!formik.touched.lastName && !!formik.errors.lastName}
								/>
							</FormControl>
						</Grid>
					</Grid>
					<FormControl margin="dense">
						<InputLabel>Email</InputLabel>
						<StyledInput
							type="email"
							value={formik.values.email}
							onChange={formik.handleChange('email')}
							onBlur={formik.handleBlur('email')}
							error={!!formik.touched.email && !!formik.errors.email}
						/>
					</FormControl>
				</StyledCardContent>
				<StyledCardActions>
					{loading ? (
						<CircularProgress />
					) : (
						<Fragment>
							<StyledLink onClick={() => setShowPasswordDialog(true)}>
								Update Password
							</StyledLink>
							<StyledButton
								variant="contained"
								color="primary"
								type="submit"
								disabled={!formik.isValid}>
								Update
							</StyledButton>
						</Fragment>
					)}
				</StyledCardActions>
			</form>
		</Fragment>
	);
};

export default ProfileForm;
