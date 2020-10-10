import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { CardContent, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CardHeader from '../../components/CardHeader';
import Card from '../../components/Card';
import * as favourController from '../../controllers/favour';
import Avatar from '../../components/Avatar';

const Leaderboard = () => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [leaderboardList, setLeaderboardList] = useState([]);

	useEffect(() => {
		setLoading(true);
		const fetchFavoursCount = async () => {
			const results = await dispatch(
				favourController.getLeaderboard()
			);
			setLeaderboardList(results);
			setLoading(false);
		};
		fetchFavoursCount();
	}, [dispatch]);

	const useStyles = makeStyles({
		table: {}
	});

	const classes = useStyles();

	return (
		<Card elevation={6}>
			<CardHeader
				title="Leaderboard"
				subheader="Ranking users by favours provided"
			/>
			{loading ? (
				<CircularProgress />
			) : (
				<CardContent>
					<TableContainer component={Paper}>
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
									<TableRow key={row.userId}>
										<TableCell component="th" scope="row">
											{index + 1}
										</TableCell>
										<TableCell>
											<Avatar user={row} size={1} />
										</TableCell>
										<TableCell>{row.firstName + ' ' + row.lastName}</TableCell>
										<TableCell>{row.favourCount}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</CardContent>
			)}
		</Card>
	);
};

export default Leaderboard;
