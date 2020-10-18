import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, MenuItem, TextField } from '@material-ui/core';
import * as requestController from '../../../../../controllers/request';
import FavourType from '../../../../../models/favour-type';

const AddRewardDialog = (props) => {
	const { favourTypes } = useSelector((state) => state.favourTypeState);
	const dispatch = useDispatch();
	const { open, setOpen } = props;
	const [loading, setLoading] = useState(false);

	const initialValues = {
		quantity: 1,
		favourType: favourTypes[0]
	};

	const validationSchema = yup.object().shape({
		quantity: yup.number().label('quanity').required().min(1).max(10),
		favourType: yup
			.object()
			.label('Reward')
			.required()
			.test('isValidFavourType', 'Favour Type is not valid', (value) => {
				const isValidInstance = value instanceof FavourType;
				const isValidElement = !!favourTypes.find(
					(favourType) => favourType.favourTypeId === value.favourTypeId
				);
				return isValidInstance && isValidElement;
			})
	});

	const closeHandler = () => {
		if (!loading) {
			setOpen(false);
			formik.setValues(initialValues, true);
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
		onSubmit: submitHandler,
		validationSchema: validationSchema
	});

	const { validateForm } = formik;

	useEffect(() => {
		validateForm();
	}, [validateForm]);

	return (
		<Dialog fullWidth maxWidth="xs" open={open} onClose={closeHandler}>
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
								{favourTypes.map((favourType) => (
									<MenuItem key={favourType.favourTypeId} value={favourType}>
										{favourType.name}
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
