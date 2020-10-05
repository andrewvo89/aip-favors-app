import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import CardHeader from '../../../../components/CardHeader';
import FullWidthButton from '../../../../components/FullWidthButton';
import * as favourController from '../../../../controllers/favour';

const useStyles = makeStyles({
	repayButton: {
		marginTop: 24
	}
});

function RepayFavourForm({ favourId }) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const history = useHistory();

	const handleSubmit = async () => {
		const data = {
			favourId: favourId,
			repaidImage: ''
		};

		const result = await dispatch(favourController.repay(data));

		// reload page
		if (result) {
			history.go(0);
		}
	};

	return (
		<Fragment>
			<CardHeader
				title="Repay Favour"
				subheader="Upload an image as proof to repay this favour."
			/>
			<form onSubmit={handleSubmit}>
				<FullWidthButton
					className={classes.repayButton}
					variant="contained"
					color="primary"
					type="submit"
				>
					Repay
				</FullWidthButton>
			</form>
		</Fragment>
	);
}

export default RepayFavourForm;
