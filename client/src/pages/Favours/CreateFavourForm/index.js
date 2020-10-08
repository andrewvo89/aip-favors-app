import React, { useState, useEffect } from 'react';
import {
	CircularProgress,
	TextField,
	Button,
	CardActions,
	Grid,
	CardContent,
	Typography,
	makeStyles
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Autocomplete } from '@material-ui/lab';
import { actList } from '../../../utils/actList';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import * as yup from 'yup';
import * as favourController from '../../../controllers/favour';
import * as userController from '../../../controllers/user';
import FullWidthButton from '../../../components/FullWidthButton';
import Card from '../../../components/Card';
import CardHeader from '../../../components/CardHeader';
import UserSearchSelect from './UserSearchSelect';
import ImageUploader from '../ImageUploader';

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

	const [loading, setLoading] = useState(false);
	const [userList, setUserList] = useState([]);
	const [imageUrl, setImageUrl] = useState('');

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
		act: '',
		proof: {
			actImage: ''
		}
	};

	const initialErrors = {
		fromUser: true,
		forUser: true,
		act: true,
		proof: {
			actImage: true
		}
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
		act: yup
			.string()
			.label('Act')
			.required()
			.oneOf(actList, 'Invalid act selection.')
	});

	const submitHandler = async (values) => {
		setLoading(true);

		// document population only requires userId
		values = {
			...values,
			fromUser: values.fromUser.userId,
			forUser: values.forUser.userId
		};
		// TODO: add user permissions (user creating favour must be included in it)
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
		formik.setFieldValue('proof', { actImage: url });
	};

	const formik = useFormik({
		initialValues: initialValues,
		initialStatus: initialErrors,
		initialErrors: initialErrors,
		onSubmit: submitHandler,
		validationSchema: validationSchema
	});

	return (
		<Grid>
			<Button
				className={classes.backButton}
				color="primary"
				component={Link} to="/favours/view/all"
			>
				<ArrowBackIcon />
				<Typography>
					Favours list
				</Typography>
			</Button>
			<Card>
				<form onSubmit={formik.handleSubmit}>
					<CardHeader
						title="Create a Favour"
						subheader="Provided a favour to someone or vice versa? Note it here."
					/>
					<CardContent>
						<Grid container direction="column" spacing={1} alignItems="stretch">
							<Grid item>
								<UserSearchSelect
									id="from-name-input"
									label="From"
									userList={userList}
									onChange={(newValue) => formik.setFieldValue('fromUser', newValue)}
									error={!!formik.touched.from && !!formik.errors.from}
									autoFocus={true}
									defaultValue={initialValues.fromUser}
								/>
							</Grid>
							<Grid item>
								<UserSearchSelect
									id="for-name-input"
									label="For"
									userList={userList}
									onChange={(newValue) => formik.setFieldValue('forUser', newValue)}
									error={!!formik.touched.for && !!formik.errors.for}
								/>
							</Grid>
							<Grid item>
								<Autocomplete
									id="act-input"
									options={actList}
									onChange={(e, newValue) =>
										formik.setFieldValue('act', newValue)
									}
									getOptionLabel={(option) => option}
									autoHighlight
									autoSelect
									renderInput={(params) => (
										<TextField
											{...params}
											label="Act"
											error={!!formik.touched.act && !!formik.errors.act}
											InputProps={{
												...params.InputProps
											}}
										/>
									)}
								/>
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
								/>
							</Grid>
						</Grid>
					</CardContent>
					<CardActions>
						<Grid container
							direction="column"
							alignItems={loading ? 'center' : 'stretch'}
							spacing={1}
						>
							<Grid item>
								{loading ? (
									<CircularProgress />
								) : (
									<FullWidthButton
										variant="contained"
										color="primary"
										type="submit"
										disabled={!formik.isValid}
									>
										Create
									</FullWidthButton>
								)}
							</Grid>
						</Grid>
					</CardActions>
				</form>
			</Card>
		</Grid>
	);
};

export default CreateFavourForm;
