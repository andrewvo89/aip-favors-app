import React, { Fragment, useState } from 'react';
import { CardActions, CardContent, CircularProgress } from '@material-ui/core';
import CardHeader from '../../../components/CardHeader';

const CreateFavourForm = () => {
	const [loading, setLoading] = useState(false);

	return (
		<Fragment>
			<CardHeader title="Favours List" subheader="List of stuff.." />
			<CardContent></CardContent>

			<CardActions>
				{loading ? <CircularProgress /> : <Fragment></Fragment>}
			</CardActions>
		</Fragment>
	);
};

export default CreateFavourForm;
