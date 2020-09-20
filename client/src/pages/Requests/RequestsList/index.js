import React, { useState, useEffect } from 'react';
import { Pagination } from '@material-ui/lab';
import Request from './Request';
import { useDispatch } from 'react-redux';
import { CircularProgress, Grid } from '@material-ui/core';
import * as requestController from '../../../controllers/request';

const RequestsList = () => {
	const [requests, setRequests] = useState();
	const dispatch = useDispatch();
	const initialPage = 1;
	const MAX_PER_PAGE = 10;
	const [page, setPage] = useState(initialPage);

	useEffect(() => {
		const fetchRequests = async () => {
			const requests = await dispatch(
				requestController.getRequests({ complete: false })
			);
			setRequests(requests);
		};
		fetchRequests();
	}, [dispatch]);

	if (!requests) {
		return <CircularProgress />;
	}

	const count = Math.ceil(requests.length / MAX_PER_PAGE);

	return (
		<Grid
			container
			direction="column"
			spacing={2}
			alignItems="center"
			style={{ width: '500px' }}
		>
			<Grid item container direction="column" spacing={2}>
				{requests.map((request) => {
					return (
						<Grid key={request.requestId} item>
							<Request request={request} />
						</Grid>
					);
				})}
			</Grid>
			<Grid item>
				<Pagination
					color="primary"
					count={count}
					page={page}
					onChange={(_event, value) => setPage(value)}
					showFirstButton={true}
					showLastButton={true}
				/>
			</Grid>
		</Grid>
	);
};

export default RequestsList;
