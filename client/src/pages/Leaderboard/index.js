import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { CardActions, CardContent, CircularProgress } from '@material-ui/core';
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

const Leaderboard = (props) => {
	const dispatch = useDispatch();
	const [loading] = useState(false);
	const [leaderboardList, setLeaderboardList] = useState([]);

	useEffect(() => {
		const fetchFavoursCount = async () => {
			const results = await dispatch(
				favourController.getLeaderboard()
			);
			setLeaderboardList(results.data.data);
		};
		fetchFavoursCount();
	});

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

            <CardActions>
				{loading ? <CircularProgress /> : <Fragment></Fragment>}
			</CardActions>
        </Card>
	);
};

export default Leaderboard;