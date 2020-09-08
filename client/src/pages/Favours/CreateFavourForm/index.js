import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { FormControl, CircularProgress, TextField } from '@material-ui/core';
import {
	StyledCardContent,
	StyledCardHeader,
	StyledCardActions,
	StyledButton
} from './styled-components';
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


const CreateFavourForm = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { authUser } = useSelector((state) => state.authState);

	const [loading, setLoading] = useState(false);
	const [userList, setUserList] = useState([]);

	const stableDispatch = useCallback(dispatch, []);
	useEffect(() => {
		const fetchUsers = async () => {
			const result = await stableDispatch(userController.getUsers());

			const users = await result.data;
			setUserList(users);
		};

		fetchUsers();
	}, [stableDispatch]);

	const initialValues = {
		from: {
			_id: authUser.userId,
			fullName: `${authUser.firstName} ${authUser.lastName}`,
			profilePicture: ''
		},
		for: {
			_id: '',
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
		act: yup.string().label('Act').required().oneOf(
			actList,
			'Invalid act selection.'
		)
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

	return (
		<Fragment>
			<form onSubmit={formik.handleSubmit}>
				<StyledCardHeader
					title="Create a Favour"
					subheader="Provided a favour to someone or vice versa? Note it here."
				/>
				<StyledCardContent>
					<FormControl margin="dense">
						<UserSearchSelect
							id="from-name-input"
							label="From"
							authUser={authUser}
							userList={userList}
							value={formik.values.from}
							onChange={newValue => formik.setFieldValue('from', newValue)}
							error={!!formik.touched.from && !!formik.errors.from}
							autoFocus={true}
						/>
					</FormControl>

					<FormControl margin="dense">
						<UserSearchSelect
							id="for-name-input"
							label="For"
							authUser={authUser}
							userList={userList}
							value={formik.values.for}
							onChange={newValue => formik.setFieldValue('for', newValue)}
							error={!!formik.touched.for && !!formik.errors.for}
						/>
					</FormControl>

					<FormControl margin="dense">
						<Autocomplete
							id="act-input"
							options={actList}
							value={formik.values.act}
							onChange={(e, newValue) => formik.setFieldValue('act', newValue)}
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
					</FormControl>
				</StyledCardContent>

				<StyledCardActions>
					{loading
						?
						<CircularProgress />
						:
						<Fragment>
							<StyledButton
								variant="contained"
								color="primary"
								type="submit"
								disabled={!formik.isValid}>
								Create
							</StyledButton>
						</Fragment>}
				</StyledCardActions>
			</form>
		</Fragment>
	);
};

export default CreateFavourForm;
