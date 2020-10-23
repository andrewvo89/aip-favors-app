import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
	Card,
	CardContent,
	CircularProgress,
	Container
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CardHeader from '../../components/CardHeader';
import * as favourController from '../../controllers/favour';
import Avatar from '../../components/Avatar';

import openSocket from 'socket.io-client';
const { REACT_APP_REST_URL: REST_URL } = process.env;
const socket = openSocket(REST_URL);

const Leaderboard = () => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [leaderboardList, setLeaderboardList] = useState([]);

	useEffect(() => {
		setLoading(true);
		const fetchFavoursCount = async () => {
			const results = await dispatch(favourController.getLeaderboard());
			setLeaderboardList(results);
			setLoading(false);
		};
		fetchFavoursCount();
	}, [dispatch]);

	useEffect(() => {
		// subscribe to the socket.io for favours updates
		socket.on('favour created', function (data) {
			const fetchFavours = async () => {
				const results = await dispatch(favourController.getLeaderboard());
				setLeaderboardList(results);
				// highlight the specific row in table on update
				let row = document.getElementById(data.userId);
				if (row) {
					row.classList.add('highlight');
					setTimeout(function () {
						row.classList.remove('highlight');
					}, 3500);
				}
			};
			fetchFavours();
		});
	}, [dispatch, leaderboardList]);

	const useStyles = makeStyles({
		table: {}
	});

	const classes = useStyles();

	return (
		<Container maxWidth="xs" disableGutters>
			<Card elevation={6}>
				<CardHeader
					title="Top 10 Leaderboard"
					subheader="Ranking users by favours provided"
				/>
				{loading ? (
					<CircularProgress />
				) : (
					<CardContent>
						<TableContainer component={Paper} variant="outlined">
							<Table className={classes.table} aria-label="simple table">
								<TableHead>
									<TableRow>
										<TableCell>#</TableCell>
										<TableCell>&nbsp;</TableCell>
										<TableCell>User</TableCell>
										<TableCell>Favours</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{leaderboardList.map((row, index) => (
										<TableRow key={row.userId} id={row.userId}>
											<TableCell component="th" scope="row">
												{index + 1}
											</TableCell>
											<TableCell>
												<Avatar user={row} size={1} />
											</TableCell>
											<TableCell>
												{row.firstName + ' ' + row.lastName}
											</TableCell>
											<TableCell>{row.favourCount}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</CardContent>
				)}
			</Card>
		</Container>
	);
};

export default Leaderboard;
