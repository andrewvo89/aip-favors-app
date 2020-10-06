import React, { Fragment } from 'react';
import {
	AppBar,
	IconButton,
	Button,
	Grid,
	Toolbar,
	Typography
} from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import NavbarAvatar from './NavbarAvatar';
import { useHistory } from 'react-router-dom';
import * as authController from '../../controllers/auth';
import NotificationsIconButton from './NotificationsIconButton';
import { withTheme } from '@material-ui/core/styles';

const Navbar = withTheme((props) => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { authUser, touched } = useSelector((state) => state.authState);

	const loginClickHandler = () => {
		dispatch(authController.showLoginDialog());
	};

	return (
		<AppBar position="sticky">
			<Toolbar
				style={{
					padding: `${props.theme.spacing(1)}px ${props.theme.spacing(10)}px`,
					minHeight: `${props.theme.spacing(10)}px`
				}}
			>
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
						spacing={2}
					>
						{authUser && (
							<Grid item>
								<IconButton
									edge="start"
									color="inherit"
									onClick={() => props.setDrawerOpen(true)}
								>
									<MenuIcon
										style={{ fontSize: `${props.theme.spacing(5)}px` }}
									/>
								</IconButton>
							</Grid>
						)}
						<Grid item>
							<Typography
								style={{ cursor: 'pointer' }}
								variant="h5"
								onClick={() => history.push('/')}
							>
								Favours App
							</Typography>
						</Grid>
					</Grid>
					<Grid
						item
						container
						direction="row"
						alignItems="center"
						justify="flex-end"
						spacing={2}
					>
						{authUser && (
							<Fragment>
								<Grid item>
									<NotificationsIconButton />
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
			</Toolbar>
		</AppBar>
	);
});

export default Navbar;
