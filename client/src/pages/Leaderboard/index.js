import React, { Fragment, useState } from 'react';
import { CardActions, CardContent, CircularProgress } from '@material-ui/core';
import CardHeader from '../../components/CardHeader';
import Card from '../../components/Card';

const Leaderboard = (props) => {
    const [loading] = useState(false);

	return (
        <Card elevation={6}>
            <CardHeader
				title="Leaderboard"
				subheader="Showing the 'best' users"
			/>
			<CardContent></CardContent>

            <CardActions>
				{loading ? <CircularProgress /> : <Fragment></Fragment>}
			</CardActions>
        </Card>
	);
};

export default Leaderboard;