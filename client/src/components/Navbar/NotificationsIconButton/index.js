import React, { useCallback, useEffect, useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Badge, IconButton } from '@material-ui/core';
import { Notifications as NotificationsIcon } from '@material-ui/icons';
import NotificationsPopover from './NotificationsPopover';

const NotificationsIconButton = (props) => {
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

	return (
		<Fragment>
			<IconButton
				edge="start"
				color="inherit"
				onClick={(event) => {
					if (notifications.length > 0) {
						setAnchorEl(event.currentTarget);
					}
				}}
			>
				<Badge badgeContent={notifications.length} max={99} color="secondary">
					<NotificationsIcon />
				</Badge>
			</IconButton>
			<NotificationsPopover
				anchorEl={anchorEl}
				setAnchorEl={setAnchorEl}
				notifications={notifications}
			/>
		</Fragment>
	);
};

export default NotificationsIconButton;
