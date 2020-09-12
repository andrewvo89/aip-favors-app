import React, { Fragment } from 'react';
import { Typography } from '@material-ui/core';
import { StyledButton } from './styled-components';

function RepayFavourForm() {
	return (
		<Fragment>
			<Typography variant="h5" align="center">
				Repay Favour
			</Typography>

			<StyledButton
				variant="contained"
				color="primary"
				type="submit"
			>
				Repay
			</StyledButton>
		</Fragment>
	);
}

export default RepayFavourForm;
