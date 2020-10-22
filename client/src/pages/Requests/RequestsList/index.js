import React, { useState, useEffect, Fragment } from 'react';
import { Pagination, ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import RequestCard from './RequestCard';
import Link from '../../../components/Link';
import { useDispatch, useSelector } from 'react-redux';
import {
	Button,
	ButtonGroup,
	CircularProgress,
	Container,
	Grid,
	Typography
} from '@material-ui/core';
import * as requestController from '../../../controllers/request';
import * as authController from '../../../controllers/auth';
import openSocket from 'socket.io-client';
import RequestSearch from './RequestSearch';
import { useHistory } from 'react-router-dom';
const { REACT_APP_REST_URL: REST_URL } = process.env;
const ACTIVE = 'active';
const COMPLETED = 'completed';
const socket = openSocket(REST_URL);

const RequestsList = () => {
	const tabs = [ACTIVE, COMPLETED];
	const [activeTab, setActiveTab] = useState(tabs[0]);
	const { authUser } = useSelector((state) => state.authState);
	const { favourTypes } = useSelector((state) => state.favourTypeState);
	const [searchParams, setSearchParams] = useState();
	const [searchResults, setSearchResults] = useState();
	const [socketData, setSocketData] = useState();
	const [requests, setRequests] = useState();
	const [filteredRequests, setFilteredRequests] = useState();
	const history = useHistory();
	const dispatch = useDispatch();
	const initialPage = 1;
	const MAX_PER_PAGE = 5;
	const [page, setPage] = useState(initialPage);

	useEffect(() => {
		const fetchRequests = async () => {
			const initialRequests = await dispatch(requestController.getRequests());
			//Subscribe to the socket.io for request updates
			socket.on('requests', (data) => setSocketData(data));
			setRequests(initialRequests);
		};
		fetchRequests();
		return () => {
			socket.off('requests');
		};
	}, [dispatch]);
	//Use socket.io to recieve live updates from the server when there is a change
	useEffect(() => {
		if (socketData) {
			const newRequests = requestController.handleSocketUpdate(
				socketData,
				filteredRequests
			);
			setRequests(newRequests);
			setSocketData(null);
		}
	}, [socketData, filteredRequests]);
	//Update search results
	useEffect(() => {
		if (requests) {
			if (searchParams) {
				if (requests) {
					const newSearchResults = requestController.getSearchResults(
						searchParams,
						requests,
						favourTypes
					);
					setSearchResults(newSearchResults);
					setPage(1);
				} else {
					setSearchResults(requests);
				}
			} else {
				setSearchResults(requests);
			}
		}
	}, [searchParams, requests, favourTypes]);
	//Update requests based on filter
	useEffect(() => {
		if (searchResults && activeTab) {
			const newFilteredRequests = searchResults.filter((request) => {
				if (activeTab === ACTIVE) {
					return request.completed === false;
				} else if (activeTab === COMPLETED) {
					return request.completed === true;
				}
				return false;
			});
			setFilteredRequests(newFilteredRequests);
		}
	}, [searchResults, activeTab]);

	if (!filteredRequests) {
		return (
			<Grid container justify="center">
				<CircularProgress />
			</Grid>
		);
	}

	const newRequestClickHandler = () => {
		if (authUser) {
			history.push('/requests/create');
		} else {
			dispatch(authController.showLoginDialog());
		}
	};

	const end = page * MAX_PER_PAGE - 1;
	const start = end - MAX_PER_PAGE + 1;
	const paginatedRequests = filteredRequests.slice(start, end);
	const count = Math.ceil(filteredRequests.length / MAX_PER_PAGE);
	const noRequests = requests.length === 0;
	const noTabRequests = filteredRequests.length === 0;

	return (
		<Container maxWidth="sm" disableGutters>
			<Grid container direction="column" spacing={2} alignItems="stretch">
				<Grid item>
					<RequestSearch
						setSearchParams={setSearchParams}
						disabled={noRequests}
					/>
				</Grid>
				<Grid item>
					<Button
						fullWidth
						variant="contained"
						color="primary"
						onClick={newRequestClickHandler}
					>
						Add new request
					</Button>
				</Grid>
				<Grid item>
					<ButtonGroup
						component={ToggleButtonGroup}
						value={activeTab}
						onChange={(_event, newValue) => setActiveTab(newValue)}
						variant="text"
						exclusive
						fullWidth
					>
						{tabs.map((tab) => (
							<Button key={tab} component={ToggleButton} value={tab}>
								{tab}
							</Button>
						))}
					</ButtonGroup>
				</Grid>
				<Grid item container direction="column" spacing={2}>
					{paginatedRequests.map((request) => {
						return (
							<Grid key={request.requestId} item>
								<RequestCard
									request={request}
									tabs={tabs}
									setActiveTab={setActiveTab}
								/>
							</Grid>
						);
					})}
				</Grid>
				<Grid item container justify="center">
					{noTabRequests && activeTab === ACTIVE && (
						<Fragment>
							<Typography>
								No public requests.
								<Link onClick={newRequestClickHandler}>
									Click here to create a new public request.
								</Link>
							</Typography>
						</Fragment>
					)}
					{!noTabRequests && (
						<Pagination
							color="primary"
							count={count}
							page={page}
							onChange={(_event, value) => setPage(value)}
							showFirstButton={true}
							showLastButton={true}
						/>
					)}
				</Grid>
			</Grid>
		</Container>
	);
};

export default RequestsList;
