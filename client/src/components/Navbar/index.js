import React, { Fragment } from 'react';
import {
	AppBar,
	IconButton,
	Button,
	Grid,
	withTheme,
	useMediaQuery
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import NavbarAvatar from './NavbarAvatar';
import { useHistory } from 'react-router-dom';
import * as authController from '../../controllers/auth';
import NotificationsIconButton from './NotificationsIconButton';
import {
	StyledAppTitle,
	StyledMenuIcon,
	StyledToolbar
} from './styled-components';

const Navbar = withTheme((props) => {
	const mobile = useMediaQuery('(max-width:760px)');
	const history = useHistory();
	const dispatch = useDispatch();
	const { authUser, touched } = useSelector((state) => state.authState);
	const loginClickHandler = () => {
		dispatch(authController.showLoginDialog());
	};

	return (
		<AppBar position="sticky">
			<StyledToolbar>
				<Grid
					container
					direction="row"
					justify="space-between"
					alignItems="center"
					wrap="nowrap"
				>
					<Grid
						item
						container
						direction="row"
						alignItems="center"
						justify="flex-start"
						spacing={mobile ? 1 : 2}
					>
						{authUser && (
							<IconButton
								edge="start"
								color="inherit"
								onClick={() => props.setDrawerOpen(true)}
							>
								<StyledMenuIcon />
							</IconButton>
						)}
						<Grid item>
							<StyledAppTitle
								variant={mobile ? 'h6' : 'h5'}
								onClick={() => history.push('/')}
							>
								Favours App
							</StyledAppTitle>
						</Grid>
					</Grid>
					<Grid
						item
						container
						direction="row"
						alignItems="center"
						justify="flex-end"
						spacing={mobile ? 1 : 2}
					>
						{authUser && (
							<Fragment>
								<Grid item>
									<NotificationsIconButton authUser={authUser} />
								</Grid>
								<Grid item>
									<NavbarAvatar authUser={authUser} />
								</Grid>
							</Fragment>
						)}
						{!authUser && touched && (
							<Grid item>
								<Button color="inherit" onClick={loginClickHandler}>
									Login / Signup
								</Button>
							</Grid>
						)}
					</Grid>
				</Grid>
			</StyledToolbar>
		</AppBar>
	);
});

export default Navbar;
