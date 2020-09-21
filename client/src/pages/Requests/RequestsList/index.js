import React, { useState, useEffect } from 'react';
import { Pagination } from '@material-ui/lab';
import RequestCard from './RequestCard';
import { useDispatch } from 'react-redux';
import { CircularProgress, Grid } from '@material-ui/core';
import * as requestController from '../../../controllers/request';
import openSocket from 'socket.io-client';
import RequestSearch from './RequestSearch';
const { REACT_APP_REST_URL: REST_URL } = process.env;
const socket = openSocket(REST_URL);

const RequestsList = () => {
	const [searchParams, setSearchParams] = useState();
	const [searchResults, setSearchResults] = useState();
	const [socketData, setSocketData] = useState();
	const [requests, setRequests] = useState();
	const [requestRewards, setRequestRewards] = useState();
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
	//Set unique list rewards based on requests
	useEffect(() => {
		if (requests) {
			const extractedRewards = requests.map((request) =>
				request.rewards.map((reward) => reward.favourType)
			);
			const flattenedExtractedRewards = extractedRewards.flat();
			const uniqueRewards = [...new Set(flattenedExtractedRewards)];
			uniqueRewards.sort();
			setRequestRewards(uniqueRewards);
		}
	}, [requests]);
	//Update search results
	useEffect(() => {
		if (searchParams) {
			const searchResults = requestController.getSearchResults(
				searchParams,
				requests
			);
			setSearchResults(searchResults);
			setPage(1);
		} else {
			setSearchResults(null);
		}
	}, [searchParams, requests]);

	if (!requests || !requestRewards) {
		return <CircularProgress />;
	}

	let dataSource = requests;
	if (searchResults) {
		dataSource = searchResults;
	}

	const end = page * MAX_PER_PAGE - 1;
	const start = end - MAX_PER_PAGE + 1;
	const paginatedRequests = dataSource.slice(start, end);
	const count = Math.ceil(dataSource.length / MAX_PER_PAGE);

	return (
		<Grid container direction="column" spacing={2} alignItems="stretch">
			<Grid item>
				<RequestSearch
					setSearchParams={setSearchParams}
					requestRewards={requestRewards}
				/>
			</Grid>
			<Grid item container direction="column" spacing={2}>
				{paginatedRequests.map((request) => {
					return (
						<Grid key={request.requestId} item>
							<RequestCard request={request} />
						</Grid>
					);
				})}
			</Grid>
			<Grid item container justify="center">
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
