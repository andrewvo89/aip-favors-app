import React, { Fragment, useState } from 'react';
import {
	Grid,
	CircularProgress,
	TextField,
	CardActions,
	CardContent
} from '@material-ui/core';
import { StyledLink } from './styled-components';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import * as userController from '../../../controllers/user';
import * as messsageActions from '../../../controllers/message';
import ChangePassword from './ChangePassword';
import { SNACKBAR } from '../../../utils/constants';
import AccountAvatar from '../AccountAvatar';
import FullWidthButton from '../../../components/FullWidthButton';
import CardHeader from '../../../components/CardHeader';

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
				<CardHeader
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
				<CardContent>
					<Grid container direction="column" spacing={1}>
						<Grid item container direction="row" spacing={2}>
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
								value={formik.values.email}
								onChange={formik.handleChange('email')}
								onBlur={formik.handleBlur('email')}
								error={!!formik.touched.email && !!formik.errors.email}
								fullWidth={true}
							/>
						</Grid>
					</Grid>
				</CardContent>
				<CardActions>
					{loading ? (
						<CircularProgress />
					) : (
						<Grid container direction="column" spacing={1}>
							<Grid item container direction="column">
								<StyledLink onClick={() => setShowPasswordDialog(true)}>
									Update Password
								</StyledLink>
							</Grid>
							<Grid item>
								<FullWidthButton
									variant="contained"
									color="primary"
									type="submit"
									disabled={!formik.isValid}
								>
									Update
								</FullWidthButton>
							</Grid>
						</Grid>
					)}
				</CardActions>
			</form>
		</Fragment>
	);
};

export default ProfileForm;
