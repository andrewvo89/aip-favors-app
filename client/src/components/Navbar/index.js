import React, { Fragment } from 'react';
import { AppBar, IconButton, Badge, Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import NavbarAvatar from '../NavbarAvatar';
import {
	StyledMenuIcon,
	StyledTitle,
	StyledToolbar,
	StyledIconButton,
	StyledDiv
} from './styled-components';
import { withRouter } from 'react-router-dom';
import { Notifications as NotificationsIcon } from '@material-ui/icons';
import * as authController from '../../controllers/auth';

export default withRouter((props) => {
	const dispatch = useDispatch();
	const { authUser, touched } = useSelector((state) => state.authState);

	const onLoginClickHandler = () => {
		dispatch(authController.showLoginDialog());
	};

	const onSignupClickHandler = () => {
		dispatch(authController.showSignupDialog());
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
						onClick={() => props.setDrawerOpen(true)}>
						<StyledMenuIcon />
					</IconButton>
				)}
				{authUser ? (
					<StyledDiv>
						<StyledIconButton edge="start" color="inherit">
							<Badge badgeContent={100} max={10} color="secondary">
								<NotificationsIcon />
							</Badge>
						</StyledIconButton>
						<NavbarAvatar authUser={authUser} />
					</StyledDiv>
				) : (
					touched && (
						<Fragment>
							<Button color="inherit" onClick={onLoginClickHandler}>
								Login
							</Button>
							<Button color="inherit" onClick={onSignupClickHandler}>
								Signup
							</Button>
						</Fragment>
					)
				)}
			</StyledToolbar>
		</AppBar>
	);
});
