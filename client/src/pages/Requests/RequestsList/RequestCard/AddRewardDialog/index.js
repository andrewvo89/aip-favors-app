import {
	Button,
	DialogActions,
	DialogContent,
	DialogTitle
} from '@material-ui/core';
import Dialog from '../../../../../components/Dialog';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { Grid, MenuItem, TextField } from '@material-ui/core';
import * as requestController from '../../../../../controllers/request';

const AddRewardDialog = (props) => {
	const dummyFavourTypes = ['Coffee', 'Chocolate', 'Mint', 'Pizza', 'Cupcake'];
	const dispatch = useDispatch();
	const { open, setOpen } = props;
	const [loading, setLoading] = useState(false);

	const initialValues = {
		quantity: 1,
		favourType: ''
	};

	const initialErrors = {
		quantity: true,
		favourType: true
	};

	const validationSchema = yup.object().shape({
		quantity: yup.number().label('quanity').required().min(1).max(10),
		favourType: yup
			.string()
			.label('favourType')
			.required()
			.oneOf(dummyFavourTypes)
	});

	const closeHandler = () => {
		if (!loading) {
			formik.setValues(initialValues, true);
			setOpen(false);
		}
	};

	const submitHandler = async (values) => {
		setLoading(true);
		const result = await dispatch(
			requestController.addReward(props.request, values)
		);
		setLoading(false);
		if (result) {
			closeHandler();
		}
	};

	const formik = useFormik({
		initialValues: initialValues,
		initialErrors: initialErrors,
		onSubmit: submitHandler,
		validationSchema: validationSchema
	});

	return (
		<Dialog open={open} onClose={closeHandler}>
			<form onSubmit={formik.handleSubmit}>
				<DialogTitle>Add a reward</DialogTitle>
				<DialogContent>
					<Grid container direction="row" spacing={1}>
						<Grid item xs={4}>
							{' '}
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
				</DialogContent>
				<DialogActions>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={!formik.isValid || loading}
					>
						Confirm
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default AddRewardDialog;
