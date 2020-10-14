import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, IconButton, Tooltip } from '@material-ui/core';
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
	const hasNotifications = notifications.length > 0;
	const [anchorEl, setAnchorEl] = useState(null);

	//Close the popover as soon as notifications are empty
	useEffect(() => {
		if (!hasNotifications) {
			setAnchorEl(null);
		}
	}, [notifications, hasNotifications]);

	const notificationPopoverClickHandler = (event) => {
		if (hasNotifications) {
			//Show notification panel if there are notifications
			setAnchorEl(event.currentTarget);
		} else {
			//Change to function of toggling silent notifications
			notificationSilenceHandler(true);
		}
	};

	const notificationSilenceHandler = async (silent) => {
		const settings = { ...authUser.settings, notifications: !silent };
		await dispatch(userController.update({ settings: settings }));
	};

	return authUser.settings.notifications ? (
		<Fragment>
			<Tooltip title={`${hasNotifications ? 'Show' : 'Silence'} notifications`}>
				<IconButton
					edge="start"
					color="inherit"
					onClick={notificationPopoverClickHandler}
				>
					<Badge badgeContent={notifications.length} max={99} color="secondary">
						<NotificationsIcon />
					</Badge>
				</IconButton>
			</Tooltip>
			<NotificationsPopover
				authUser={authUser}
				anchorEl={anchorEl}
				setAnchorEl={setAnchorEl}
				notifications={notifications}
			/>
		</Fragment>
	) : (
		<Tooltip title="Enable notifications">
			<IconButton
				edge="start"
				color="inherit"
				onClick={() => notificationSilenceHandler(false)}
			>
				<NotificationsOffIcon />
			</IconButton>
		</Tooltip>
	);
};

export default NotificationsIconButton;
