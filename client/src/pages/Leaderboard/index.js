import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import * as userController from '../../controllers/user';
import * as requestController from '../../controllers/request';
import Avatar from '../../components/Avatar';

const Leaderboard = (props) => {
	const dispatch = useDispatch();
	const [loading] = useState(false);
	const [userList, setUserList] = useState([]);
	const [requestList, setRequestList] = useState([]);

	const stableDispatch = useCallback(dispatch, []);
	useEffect(() => {
		const fetchUsers = async () => {
			const users = (await stableDispatch(userController.getUsers())).map(
				(user) => ({
					...user,
					fullName: `${user.firstName} ${user.lastName}`
				})
			);
			setUserList(users);
		};

		fetchUsers();
	}, [stableDispatch]);

	useEffect(() => {
		const fetchRequests = async () => {
			const requests = await dispatch(
				requestController.getRequests()
			);
			setRequestList(requests);
		};

		fetchRequests();
	}, [stableDispatch]);

	console.log(requestList);

	const useStyles = makeStyles({
		table: {}
	});

	const classes = useStyles();

	return (
        <Card elevation={6}>
            <CardHeader
				title="Leaderboard"
				subheader="Showing the 'best' users"
			/>
			<CardContent>
			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="simple table">
					<TableHead>
					<TableRow>
						<TableCell>#</TableCell>
						<TableCell>&nbsp;</TableCell>
						<TableCell>User</TableCell>
						<TableCell>Criteria</TableCell>
					</TableRow>
					</TableHead>
					<TableBody>						
						{userList.map((row, index) => (
							<TableRow key={row.userId.toString()}>
								<TableCell component="th" scope="row">
									{index + 1}
								</TableCell>
								<TableCell>
									<Avatar user={row} size={1} />
								</TableCell>
								<TableCell>{row.fullName}</TableCell>
								<TableCell>99</TableCell>
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