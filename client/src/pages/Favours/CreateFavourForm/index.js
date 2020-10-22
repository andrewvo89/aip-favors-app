import React, { useState, useEffect } from 'react';
import {
	CircularProgress,
	TextField,
	Button,
	CardActions,
	Grid,
	CardContent,
	Typography,
	makeStyles,
	Card,
	MenuItem
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import * as yup from 'yup';
import * as favourController from '../../../controllers/favour';
import * as userController from '../../../controllers/user';
import CardHeader from '../../../components/CardHeader';
import UserSearchSelect from './UserSearchSelect';
import ImageUploader from '../ImageUploader';
import FavourType from '../../../models/favour-type';

const useStyles = makeStyles({
	backButton: {
		paddingLeft: 0,
		marginBottom: 8
	}
});

const CreateFavourForm = () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const history = useHistory();
	const authUser = useSelector((state) => state.authState.authUser);
	const { favourTypes } = useSelector((state) => state.favourTypeState);

	const [loading, setLoading] = useState(false);
	const [userList, setUserList] = useState([]);
	const [imageUrl, setImageUrl] = useState('');

	const [validatedOnMount, setValidatedOnMount] = useState(false);

	// fetch list of users on page load
	useEffect(() => {
		const fetchUsers = async () => {
			const users = await dispatch(userController.getUsers());
			setUserList(users);
		};

		fetchUsers();
	}, [dispatch]);

	const initialValues = {
		fromUser: authUser,
		forUser: {},
		proof: '',
		favourType: favourTypes[0],
		quantity: 1
	};

	const validationSchema = yup.object().shape({
		fromUser: yup.object().shape({
			userId: yup.string().label('fromUser.userId').required().length(24),
			firstName: yup.string().label('fromUser.firstName').required().max(50),
			lastName: yup.string().label('fromUser.lastName').required().max(50),
			profilePicture: yup.string().label('fromUser.profilePicture')
		}),
		forUser: yup.object().shape({
			userId: yup.string().label('fromUser.userId').required().length(24),
			firstName: yup.string().label('fromUser.firstName').required().max(50),
			lastName: yup.string().label('fromUser.lastName').required().max(50),
			profilePicture: yup.string().label('fromUser.profilePicture')
		}),
		favourType: yup
			.object()
			.label('Favour Type')
			.required()
			.test('isValidFavourType', 'Favour Type is not valid', (value) => {
				const isValidInstance = value instanceof FavourType;
				const isValidElement = !!favourTypes.find(
					(favourType) => favourType.favourTypeId === value.favourTypeId
				);
				return isValidInstance && isValidElement;
			})
	});

	const submitHandler = async (values) => {
		setLoading(true);
		// document population only requires userId
		values = {
			...values,
			fromUser: values.fromUser.userId,
			forUser: values.forUser.userId,
			favourType: values.favourType.favourTypeId
		};
		const favour = await dispatch(favourController.create(values));
		if (favour) {
			// route to the new favour's page
			history.push({
				pathname: `/favours/view/${favour.favourId}`,
				state: favour
			});
		}

		return () => {
			setLoading(false);
		};
	};

	const handleSetImage = (url) => {
		setImageUrl(url);
		formik.setFieldValue('proof', url);
	};

	const proofRequired = (checkUrl = true) => {
		const fromUser = formik.values.fromUser;
		const forUser = formik.values.forUser;

		if (fromUser == null || forUser == null) {
			return !checkUrl ? false : true;
		}

		// from and for cannot be the same user
		if (fromUser.userId === forUser.userId) {
			return !checkUrl ? false : true;
		}

		if (checkUrl) {
			return fromUser.userId === authUser.userId && imageUrl === '';
		} else {
			return fromUser.userId === authUser.userId;
		}
	};

	const filteredList = (otherSelectedUser) => {
		if (
			otherSelectedUser == null ||
			Object.keys(otherSelectedUser).length === 0
		) {
			return userList;
		}

		// show only authUser in list if not selected in other list
		if (otherSelectedUser.userId !== authUser.userId) {
			return [authUser];
		} else {
			return userList;
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
		<Grid container direction="column" spacing={1}>
			<Grid item>
				<Button
					className={classes.backButton}
					color="primary"
					component={Link}
					to="/favours/view/all"
				>
					<ArrowBackIcon />
					<Typography>Favours list</Typography>
				</Button>
			</Grid>
			<Grid item>
				{' '}
				<Card>
					<form onSubmit={formik.handleSubmit}>
						<CardHeader
							title="Create a Favour"
							subheader="Provided a favour to someone or vice versa? Note it here."
						/>
						<CardContent>
							<Grid
								container
								direction="column"
								spacing={1}
								alignItems="stretch"
							>
								<Grid item>
									<UserSearchSelect
										id="from-name-input"
										label="From"
										userList={filteredList(formik.values.forUser)}
										onChange={(newValue) =>
											formik.setFieldValue('fromUser', newValue)
										}
										error={!!formik.touched.from && !!formik.errors.from}
										autoFocus={true}
										defaultValue={initialValues.fromUser}
									/>
								</Grid>
								<Grid item>
									<UserSearchSelect
										id="for-name-input"
										label="For"
										userList={filteredList(formik.values.fromUser)}
										onChange={(newValue) =>
											formik.setFieldValue('forUser', newValue)
										}
										error={!!formik.touched.for && !!formik.errors.for}
									/>
								</Grid>
								<Grid item container direction="row" spacing={1}>
									<Grid item xs={4}>
										<TextField
											label="Quantity"
											type="number"
											inputProps={{
												min: 1,
												max: 100
											}}
											fullWidth={true}
											value={formik.values.quantity}
											onChange={formik.handleChange('quantity')}
										/>
									</Grid>
									<Grid item xs={8}>
										<TextField
											label="Favour Type"
											select={true}
											value={formik.values.favourType}
											onChange={formik.handleChange('favourType')}
											fullWidth={true}
											disabled={loading}
										>
											{favourTypes.map((favourType) => (
												<MenuItem
													key={favourType.favourTypeId}
													value={favourType}
												>
													{favourType.name}
												</MenuItem>
											))}
										</TextField>
									</Grid>
								</Grid>
								<Grid
									container
									item
									direction="column"
									justify="center"
									alignItems="center"
								>
									<ImageUploader
										imageUrl={imageUrl}
										handleSetImage={handleSetImage}
										disabled={!proofRequired(false)}
									/>
								</Grid>
							</Grid>
						</CardContent>
						<CardActions>
							<Grid
								container
								direction="column"
								alignItems={loading ? 'center' : 'stretch'}
								spacing={1}
							>
								<Grid item>
									{loading ? (
										<CircularProgress />
									) : (
										<Button
											fullWidth
											variant="contained"
											color="primary"
											type="submit"
											disabled={
												!formik.isValid || proofRequired() || !validatedOnMount
											}
										>
											Create
										</Button>
									)}
								</Grid>
							</Grid>
						</CardActions>
					</form>
				</Card>
			</Grid>
		</Grid>
	);
};

export default CreateFavourForm;
