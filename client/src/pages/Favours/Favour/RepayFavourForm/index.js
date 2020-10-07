import React from 'react';
import { useDispatch } from 'react-redux';
import { Chip, Grid, makeStyles } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import CardHeader from '../../../../components/CardHeader';
import FullWidthButton from '../../../../components/FullWidthButton';
import * as favourController from '../../../../controllers/favour';

const useStyles = makeStyles({
	repayButton: {
		marginTop: 24
	},
	repaidChip: {
		marginLeft: 'auto',
		marginRight: 'auto',
		marginTop: 12,
		borderRadius: 6,
		display: 'flex',
		width: 'fit-content'
	}
});

function RepayFavourForm({ favour, setFavour }) {
	const classes = useStyles();
	const dispatch = useDispatch();

	const handleSubmit = async (e) => {
		// TODO: use formik
		e.preventDefault();

		const data = {
			favourId: favour.favourId,
			repaidImage: ''
		};

		const updatedFavour = await dispatch(favourController.repay(data));

		// rerender with updated favour
		setFavour(updatedFavour);
	};

	return (
		<Grid>
			{favour.repaid ? (
				<Grid>
					<CardHeader title="Repaid" subheader={favour.updatedAt} />
					<Chip
						className={classes.repaidChip}
						label="Repaid"
						color="secondary"
						clickable
						icon={<DoneIcon />}
					/>
				</Grid>
			) : (
				<Grid>
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
				</Grid>
			)}
		</Grid>
	);
}

export default RepayFavourForm;
