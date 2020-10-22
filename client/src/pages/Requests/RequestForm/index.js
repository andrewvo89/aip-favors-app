import {
	Button,
	Card,
	CardActions,
	CardContent,
	Container,
	Grid,
	MenuItem,
	TextField,
	Typography
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import * as requestController from '../../../controllers/request';
import CardHeader from '../../../components/CardHeader';
import { useHistory } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import FavourType from '../../../models/favour-type';

const RequestForm = (props) => {
	const history = useHistory();
	const dispatch = useDispatch();
	const [validatedOnMount, setValidatedOnMount] = useState(false);
	const [loading, setLoading] = useState(false);
	const { favourTypes } = useSelector((state) => state.favourTypeState);

	const initialValues = {
		task: '',
		quantity: 1,
		favourType: favourTypes[0]
	};

	const validationSchema = yup.object().shape({
		task: yup.string().label('task').required().max(100),
		quantity: yup.number().label('quanity').required().min(1).max(100),
		favourType: yup
			.object()
			.label('Favour')
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
		const result = await dispatch(requestController.addRequest(values));
		setLoading(false);
		if (result) {
			formik.setValues(initialValues, true);
			history.push('/requests/view/all');
		}
	};

	const formik = useFormik({
		initialValues: initialValues,
		onSubmit: submitHandler,
		validationSchema: validationSchema
	});

	const { validateForm } = formik;

	useEffect(() => {
		//formik.validateOnMount does not work
		validateForm();
		setValidatedOnMount(true);
	}, [validateForm]);

	const requestListClickHandler = () => {
		history.push('/requests/view/all');
	};

	return (
		<Container maxWidth="xs" disableGutters>
			<Grid container direction="column" spacing={1}>
				<Grid item>
					<Button color="primary" onClick={requestListClickHandler}>
						<ArrowBackIcon />
						<Typography>Request list</Typography>
					</Button>
				</Grid>
				<Grid item>
					<Card>
						<form onSubmit={formik.handleSubmit}>
							<CardHeader title="Request Form" />
							<CardContent>
								<Grid container direction="column" spacing={1}>
									<Grid item>
										<TextField
											label="Task"
											fullWidth={true}
											value={formik.values.task}
											onChange={formik.handleChange('task')}
											onBlur={formik.handleBlur('task')}
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
												onBlur={formik.handleBlur('quantity')}
											/>
										</Grid>
										<Grid item xs={8}>
											<TextField
												label="Reward"
												select={true}
												value={formik.values.favourType}
												onChange={formik.handleChange('favourType')}
												onBlur={formik.handleBlur('favourType')}
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
								</Grid>
							</CardContent>
							<CardActions>
								<Button
									type="submit"
									variant="contained"
									color="primary"
									fullWidth
									disabled={!formik.isValid || loading || !validatedOnMount}
								>
									Submit
								</Button>
							</CardActions>
						</form>
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
};

export default RequestForm;
