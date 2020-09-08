import React, { Fragment, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import {
	StyledCardContent,
	StyledCardHeader,
	StyledCardActions
} from './styled-components';


const CreateFavourForm = () => {
	const [loading, setLoading] = useState(false);

	return (
		<Fragment>
			<StyledCardHeader
				title="Favours List"
				subheader="List of stuff.."
			/>
			<StyledCardContent>

			</StyledCardContent>

			<StyledCardActions>
				{loading ?
					(
						<CircularProgress />
					) : (
						<Fragment>
						</Fragment>
					)}
			</StyledCardActions>
		</Fragment>
	);
};

export default CreateFavourForm;
