import React, { Fragment, useState, useEffect } from 'react';
import {
	CircularProgress,
	TextField,
	CardActions,
	Grid,
	CardContent
} from '@material-ui/core';
import { actList } from '../../../utils/actList';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import * as favourController from '../../../controllers/favour';
import * as userController from '../../../controllers/user';
import UserSearchSelect from './UserSearchSelect';
import { Autocomplete } from '@material-ui/lab';
import FullWidthButton from '../../../components/FullWidthButton';
import CardHeader from '../../../components/CardHeader';

const CreateFavourForm = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const authUser = useSelector((state) => state.authState.authUser);

	const [loading, setLoading] = useState(false);
	const [userList, setUserList] = useState([]);

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
			.oneOf(actList, 'Invalid act selection.'),
		proof: yup.object().shape({
			actImage: yup.string().label('proof.actImage')
		})
	});

	const submitHandler = async (values) => {
		setLoading(true);

		// document population only requires userId
		values = {
			...values,
			fromUser: values.fromUser.userId,
			forUser: values.forUser.userId
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
