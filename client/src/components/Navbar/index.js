import React, { Fragment } from 'react';
import { AppBar, IconButton, Button, Grid } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import NavbarAvatar from './NavbarAvatar';
import {
	StyledMenuIcon,
	StyledTitle,
	StyledToolbar
} from './styled-components';
import { withRouter } from 'react-router-dom';
import * as authController from '../../controllers/auth';
import NotificationsIconButton from './NotificationsIconButton';

export default withRouter((props) => {
	const dispatch = useDispatch();
	const { authUser, touched } = useSelector((state) => state.authState);

	const loginClickHandler = () => {
		dispatch(authController.showLoginDialog());
	};

	return (
		<AppBar position="static">
			<StyledToolbar authUser={authUser}>
				<StyledTitle variant="h4" onClick={() => props.history.push('/')}>
					Favours App
				</StyledTitle>
				{authUser && (
					<IconButton
						edge="start"
						color="inherit"
						onClick={() => props.setDrawerOpen(true)}
					>
						<StyledMenuIcon />
					</IconButton>
				)}
				{authUser ? (
					<Grid container alignContent="center">
						<NotificationsIconButton />
						<NavbarAvatar authUser={authUser} />
					</Grid>
				) : (
					touched && (
						<Fragment>
							<Button color="inherit" onClick={loginClickHandler}>
								Login / Signup
							</Button>
						</Fragment>
					)
				)}
			</StyledToolbar>
		</AppBar>
	);
});
