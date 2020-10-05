import React from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import FullWidthButton from '../../../../components/FullWidthButton';

const useStyles = makeStyles({
	actionArea: {
		paddingTop: 12
	}
});

function RepayFavourForm() {
	const classes = useStyles();

	return (
		<Box className={classes.actionArea}>
			<Typography variant="h5" align="center" gutterBottom>
				Repay Favour
			</Typography>

			<FullWidthButton
				variant="contained"
				color="primary"
				type="submit"
			>
				Repay
			</FullWidthButton>
		</Box>
	);
}

export default RepayFavourForm;
