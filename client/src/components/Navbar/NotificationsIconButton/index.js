import React, { useCallback, useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, IconButton } from '@material-ui/core';
import {
	Notifications as NotificationsIcon,
	NotificationsOff as NotificationsOffIcon
} from '@material-ui/icons';
import NotificationsPopover from './NotificationsPopover';
import * as userController from '../../../controllers/user';

const NotificationsIconButton = (props) => {
	const dispatch = useDispatch();
	const { authUser } = props;
	const { notifications } = useSelector((state) => state.notificationState);
	const [anchorEl, setAnchorEl] = useState(null);

	const closePopoverHandler = useCallback(() => {
		setAnchorEl(null);
	}, []);
	//Close the popover as soon as notifications are empty
	useEffect(() => {
		if (notifications.length === 0) {
			closePopoverHandler();
		}
	}, [notifications, closePopoverHandler]);

	const notificationPopoverClickHandler = (event) => {
		if (notifications.length > 0) {
			setAnchorEl(event.currentTarget);
		}
	};

	const notificationOnClickHandler = async () => {
		const settings = { ...authUser.settings, notifications: true };
		await dispatch(userController.update({ settings: settings }));
	};

	return authUser.settings.notifications ? (
		<Fragment>
			<IconButton
				edge="start"
				color="inherit"
				onClick={notificationPopoverClickHandler}
			>
				<Badge badgeContent={notifications.length} max={99} color="secondary">
					<NotificationsIcon />
				</Badge>
			</IconButton>
			<NotificationsPopover
				authUser={authUser}
				anchorEl={anchorEl}
				setAnchorEl={setAnchorEl}
				notifications={notifications}
			/>
		</Fragment>
	) : (
		<IconButton edge="start" color="inherit">
			<NotificationsOffIcon onClick={notificationOnClickHandler} />
		</IconButton>
	);
};

export default NotificationsIconButton;
