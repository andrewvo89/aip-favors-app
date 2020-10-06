import React, { Fragment, useState } from 'react';
import { Menu, MenuItem } from '@material-ui/core/';
import { useDispatch } from 'react-redux';
import * as authController from '../../../controllers/auth';
import { withRouter } from 'react-router-dom';
import Avatar from '../../Avatar';

const NavbarAvatar = withRouter((props) => {
	const dispatch = useDispatch();
	const [anchorElement, setAnchorElement] = useState(null);

	const menuCloseHandler = () => {
		setAnchorElement(null);
	};

	const logoutClickHandler = async () => {
		dispatch(authController.logout());
	};

	const accountClickHandler = () => {
		props.history.push('/account');
		menuCloseHandler();
	};

	const settingsClickHandler = () => {
		props.history.push('/settings');
		menuCloseHandler();
	};

	return (
		<Fragment>
			<Avatar
				user={props.authUser}
				size={1.5}
				clickable={true}
				onClick={(event) => setAnchorElement(event.target)}
			/>
			<Menu
				id="simple-menu"
				anchorEl={anchorElement}
				keepMounted
				open={!!anchorElement}
				onClose={menuCloseHandler}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
				getContentAnchorEl={null}
			>
				<MenuItem onClick={accountClickHandler}>Account</MenuItem>
				<MenuItem onClick={settingsClickHandler}>Settings</MenuItem>
				<MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
			</Menu>
		</Fragment>
	);
});

export default NavbarAvatar;
