import React, { Fragment, useState } from 'react';
import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	CircularProgress
} from '@material-ui/core';
import {
	StyledCardContent,
	StyledCardHeader,
	StyledCardActions,
	StyledButton
} from './styled-components';
import { StyledInput } from '../../../utils/styled-components';
import { SNACKBAR } from '../../../utils/constants';
import { actList } from '../../../utils/actList';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import * as messsageActions from '../../../controllers/message';
import * as favourController from '../../../controllers/favour';


const CreateFavourForm = () => {
	const dispatch = useDispatch();
	const { authUser } = useSelector((state) => state.authState);

	const [loading, setLoading] = useState(false);

	const initialValues = {
		fromId: authUser.id,
		fromName: `${authUser.firstName} ${authUser.lastName}`,
		forId: '',
		forName: '',
		act: ''
	};

	const initialErrors = {
		fromId: true,
		fromName: true,
		forId: true,
		forName: true,
		act: true
	};

	const validationSchema = yup.object().shape({
		fromId: yup.string().label('fromId').required().length(24),
		fromName: yup.string().label('fromName').required().max(101),
		forId: yup.string().label('forId').required().length(24),
		forName: yup.string().label('forName').required().max(101),
		act: yup.string().label('Act').required().oneOf(
			actList,
			'Invalid act selection.'
		)
	});

	const submitHandler = async (values) => {
		setLoading(true);

		const result = await favourController.create(values);

		if (result) {
			dispatch(
				messsageActions.setMessage({
					title: 'Favour Created!',
					text: 'The new favour as been created successfully.',
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
			<form onSubmit={formik.handleSubmit}>
				<StyledCardHeader
					title="Create a Favour"
					subheader="Provided a favour to someone or vice versa? Note it here."
				/>
				<StyledCardContent>
					<FormControl margin="dense">
						<InputLabel id="from-name-input-label">From</InputLabel>
						<StyledInput
							labelId="from-name-input-label"
							type="text"
							value={formik.values.fromName}
							onChange={formik.handleChange('fromName')}
							onBlur={formik.handleBlur('fromName')}
							error={
								!!formik.touched.fromName && !!formik.errors.fromName
							}
							autoFocus={true}
						/>
					</FormControl>

					<FormControl margin="dense">
						<InputLabel id="for-name-input-label">For</InputLabel>
						<StyledInput
							labelId="for-name-input-label"
							type="text"
							value={formik.values.forName}
							onChange={formik.handleChange('forName')}
							onBlur={formik.handleBlur('forName')}
							error={!!formik.touched.forName && !!formik.errors.forName}
						/>
					</FormControl>

					<FormControl margin="dense">
						<InputLabel id="act-input-label">Act</InputLabel>
						<Select
							labelId="act-input-label"
							value={formik.values.act}
							onChange={formik.handleChange('act')}
							onBlur={formik.handleBlur('act')}
							error={!!formik.touched.act && !!formik.errors.act}
						>
							{actList.map(actText =>
								<MenuItem value={actText} key={actText}>
									{actText}
								</MenuItem>
							)}
						</Select>
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
									Create
							</StyledButton>
						</Fragment>
					)}
				</StyledCardActions>
			</form>
		</Fragment>
	);
};

export default CreateFavourForm;
