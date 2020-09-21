import React, { useState, useEffect } from 'react';
import { Pagination } from '@material-ui/lab';
import RequestCard from './RequestCard';
import { useDispatch } from 'react-redux';
import { CircularProgress, Grid } from '@material-ui/core';
import * as requestController from '../../../controllers/request';
import openSocket from 'socket.io-client';
import PageContainer from '../../../components/PageContainer';
const { REACT_APP_REST_URL: REST_URL } = process.env;
const socket = openSocket(REST_URL);

const RequestsList = () => {
	const [socketData, setSocketData] = useState();
	const [requests, setRequests] = useState();
	const dispatch = useDispatch();
	const initialPage = 1;
	const MAX_PER_PAGE = 10;
	const [page, setPage] = useState(initialPage);

	useEffect(() => {
		const fetchRequests = async () => {
			const initialRequests = await dispatch(
				requestController.getRequests({ complete: false })
			);
			//Subscribe to the socket.io for request updates
			socket.on('requests', (data) => setSocketData(data));
			setRequests(initialRequests);
		};
		fetchRequests();
	}, [dispatch]);
	//Use socket.io to recieve live updates from the server when there is a change
	useEffect(() => {
		if (socketData) {
			const newRequests = requestController.handleSocketUpdate(
				socketData,
				requests
			);
			setRequests(newRequests);
			setSocketData(null);
		}
	}, [socketData, requests]);

	if (!requests) {
		return <CircularProgress />;
	}

	const count = Math.ceil(requests.length / MAX_PER_PAGE);
	const end = page * MAX_PER_PAGE - 1;
	const start = end - MAX_PER_PAGE + 1;
	const paginatedRequests = requests.slice(start, end);

	return (
		<PageContainer width="500px">
			<Grid container direction="column" spacing={2} alignItems="center">
				<Grid item container direction="column" spacing={2}>
					{paginatedRequests.map((request) => {
						return (
							<Grid key={request.requestId} item>
								<RequestCard request={request} />
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
		</PageContainer>
	);
};

export default RequestsList;
