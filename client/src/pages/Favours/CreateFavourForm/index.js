import React, { Fragment, useState, useEffect, useCallback } from 'react';
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
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

const CreateFavourForm = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { authUser } = useSelector((state) => state.authState);
	const [favourstypes,setFavoursTypes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [userList, setUserList] = useState([]);

	const stableDispatch = useCallback(dispatch, []);
	useEffect(() => {
		const fetchUsers = async () => {
			const users = (await stableDispatch(userController.getUsers())).map(
				(user) => ({
					...user,
					fullName: `${user.firstName} ${user.lastName}`
				})
			);
			setUserList(users);
		};

		fetchUsers();
	}, [stableDispatch]);
	
	useEffect(() => {
		const fetchUsers = async () => {
			const users = await stableDispatch(favourController.getFavorsTypes());
			console.log(users)
			setFavoursTypes(users.data.favortypesname);
		};

		fetchUsers();
	}, [stableDispatch]);
	const initialValues = {
		from: {
			userId: authUser.userId,
			fullName: `${authUser.firstName} ${authUser.lastName}`,
			profilePicture: ''
		},
		for: {
			userId: '',
			fullName: '',
			profilePicture: ''
		},
		act: ''
	};

	const initialErrors = {
		from: {
			_id: true,
			fullName: true,
			profilePicture: true
		},
		for: {
			_id: true,
			fullName: true,
			profilePicture: true
		},
		act: true
	};

	const validationSchema = yup.object().shape({
		from: yup.object().shape({
			_id: yup.string().label('from._id').required().length(24),
			fullName: yup.string().label('from.name').required().max(101),
			profilePicture: yup.string().label('from.profilePicture')
		}),
		for: yup.object().shape({
			_id: yup.string().label('for._id').required().length(24),
			fullName: yup.string().label('for.name').required().max(101),
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
		onSubmit: submitHandler,
		validationSchema: validationSchema
	});

	if (!userList) {
		return <CircularProgress />;
	}

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
								value={formik.values.from}
								onChange={(newValue) => formik.setFieldValue('from', newValue)}
								error={!!formik.touched.from && !!formik.errors.from}
								autoFocus={true}
							/>
						</Grid>
						<Grid item>
							<UserSearchSelect
								id="for-name-input"
								label="For"
								userList={userList}
								value={formik.values.for}
								onChange={(newValue) => formik.setFieldValue('for', newValue)}
								error={!!formik.touched.for && !!formik.errors.for}
							/>
						</Grid>
						<Grid item>
							<Autocomplete
								id="act-input"
								options={actList}
								value={formik.values.act}
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
						<Grid item>
							<InputLabel id="demo-simple-select-label">FavourType</InputLabel>
							<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							>
							{favourstypes.map((item, index) => {
								return <MenuItem value={index}>{item}</MenuItem>;
							})
							}
							</Select>
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
									Create
								</FullWidthButton>
							</Grid>
						</Grid>
					)}
				</CardActions>
			</form>
		</Fragment>
	);
};

export default CreateFavourForm;
