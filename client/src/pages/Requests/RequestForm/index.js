import {
	CardActions,
	CardContent,
	Grid,
	MenuItem,
	TextField
} from '@material-ui/core';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import * as requestController from '../../../controllers/request';
import FullWidthButton from '../../../components/FullWidthButton';
import Card from '../../../components/Card';
import CardHeader from '../../../components/CardHeader';

const RequestForm = (props) => {
	const dummyFavourTypes = ['Coffee', 'Chocolate', 'Mint', 'Pizza', 'Cupcake'];
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);

	const initialValues = {
		act: '',
		quantity: 1,
		favourType: ''
	};

	const initialErrors = {
		act: true,
		quantity: true,
		favourType: true
	};

	const validationSchema = yup.object().shape({
		act: yup.string().label('act').required().max(100),
		quantity: yup.number().label('quanity').required().min(1).max(10),
		favourType: yup
			.string()
			.label('favourType')
			.required()
			.oneOf(dummyFavourTypes)
	});

	const submitHandler = async (values) => {
		setLoading(true);
		const result = await dispatch(requestController.addRequest(values));
		setLoading(false);
		if (result) {
			formik.setValues(initialValues, true);
		}
	};

	const formik = useFormik({
		initialValues: initialValues,
		initialErrors: initialErrors,
		onSubmit: submitHandler,
		validationSchema: validationSchema
	});

	return (
		<Card width="400px">
			<form onSubmit={formik.handleSubmit}>
				<CardHeader title="Request Form" />
				<CardContent>
					<Grid container direction="column" spacing={1}>
						<Grid item>
							<TextField
								label="Request"
								fullWidth={true}
								multiline={true}
								value={formik.values.act}
								onChange={formik.handleChange('act')}
								disabled={loading}
								autoFocus={true}
							/>
						</Grid>
						<Grid item container direction="row" spacing={1}>
							<Grid item xs={4}>
								<TextField
									label="Quantity"
									type="number"
									inputProps={{
										min: 1,
										max: 10
									}}
									fullWidth={true}
									value={formik.values.quantity}
									onChange={formik.handleChange('quantity')}
								/>
							</Grid>
							<Grid item xs={8}>
								<TextField
									label="Reward"
									select={true}
									value={formik.values.favourType}
									onChange={formik.handleChange('favourType')}
									fullWidth={true}
									disabled={loading}
								>
									{dummyFavourTypes.map((favours) => (
										<MenuItem key={favours} value={favours}>
											{favours}
										</MenuItem>
									))}
								</TextField>
							</Grid>
						</Grid>
					</Grid>
				</CardContent>
				<CardActions>
					<FullWidthButton
						type="submit"
						variant="contained"
						color="primary"
						disabled={!formik.isValid || loading}
					>
						Submit
					</FullWidthButton>
				</CardActions>
			</form>
		</Card>
	);
};

export default RequestForm;