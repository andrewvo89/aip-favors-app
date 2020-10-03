import React, { Fragment, useState, useEffect } from 'react';
import {
	CircularProgress,
	TextField,
	CardActions,
	Grid,
	CardContent
} from '@material-ui/core';
import { SNACKBAR } from '../../../utils/constants';
import { actList } from '../../../utils/actList';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import * as messsageActions from '../../../controllers/message';
import * as favourController from '../../../controllers/favour';
import * as userController from '../../../controllers/user';
import UserSearchSelect from './UserSearchSelect';
import { Autocomplete } from '@material-ui/lab';
import FullWidthButton from '../../../components/FullWidthButton';
import CardHeader from '../../../components/CardHeader';

const CreateFavourForm = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { authUser } = useSelector((state) => state.authState);

	const [loading, setLoading] = useState(false);
	const [userList, setUserList] = useState([]);

	// fetch list of users on page load
	useEffect(() => {
		const fetchUsers = async () => {
			const result = await dispatch(userController.getUsers());
			const users = result.map(
				(user) => ({
					...user,
					fullName: `${user.firstName} ${user.lastName}`
				})
			);
			setUserList(users);
		};

		fetchUsers();
	}, [dispatch]);

	const initialValues = {
		from: {
			...authUser,
			fullName: `${authUser.firstName} ${authUser.lastName}`,
		},
		for: {
			userId: '',
			firstName: '',
			lastName: '',
			fullName: '',
			profilePicture: ''
		},
		act: ''
	};

	const initialErrors = {
		from: {
			userId: true,
			firstName: true,
			lastName: true,
			fullName: true,
			profilePicture: true
		},
		for: {
			userId: true,
			firstName: true,
			lastName: true,
			fullName: true,
			profilePicture: true
		},
		act: true
	};

	const validationSchema = yup.object().shape({
		from: yup.object().shape({
			userId: yup.string().label('from.userId').required().length(24),
			firstName: yup.string().label('from.firstName').required().max(50),
			lastName: yup.string().label('from.lastName').required().max(50),
			fullName: yup.string().label('from.name').required().max(101),
			profilePicture: yup.string().label('from.profilePicture')
		}),
		for: yup.object().shape({
			userId: yup.string().label('for.userId').required().length(24),
			firstName: yup.string().label('for.firstName').required().max(50),
			lastName: yup.string().label('for.lastName').required().max(50),
			fullName: yup.string().label('from.name').required().max(101),
			profilePicture: yup.string().label('for.profilePicture')
		}),
		act: yup
			.string()
			.label('Act')
			.required()
			.oneOf(actList, 'Invalid act selection.')
	});

	const submitHandler = async (values) => {
		setLoading(true);

		const result = await dispatch(favourController.create(values));
		if (result) {
			dispatch(
				messsageActions.setMessage({
					title: 'Favour Created!',
					text: 'The new favour as been created successfully.',
					feedback: SNACKBAR
				})
			);

			// route to new favour view
			const favour = await result.data;
			history.push({
				pathname: `/favours/view/${favour._id}`,
				state: favour
			});
		}

		return () => {
			setLoading(false);
		};
	};

	const formik = useFormik({
		initialValues: initialValues,
		initialStatus: initialErrors,
		initialErrors: initialErrors,
		onSubmit: submitHandler,
		validationSchema: validationSchema
	});

	return (
		<Fragment>
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
								onChange={(newValue) => formik.setFieldValue('from', newValue)}
								error={!!formik.touched.from && !!formik.errors.from}
								autoFocus={true}
								defaultValue={initialValues.from}
							/>
						</Grid>
						<Grid item>
							<UserSearchSelect
								id="for-name-input"
								label="For"
								userList={userList}
								onChange={(newValue) => formik.setFieldValue('for', newValue)}
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
		</Fragment>
	);
};

export default CreateFavourForm;
