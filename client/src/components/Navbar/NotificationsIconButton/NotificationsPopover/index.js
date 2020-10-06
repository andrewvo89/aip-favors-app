import { Divider, IconButton, Popover, Tooltip } from '@material-ui/core';
import React, { Fragment } from 'react';
import NotificationItem from './NotificationItem';
import {
	StyledToolbar,
	StyledList,
	StyledTitle,
	StyledClearAllIcon
} from './styled-components';
import * as notificationController from '../../../../controllers/notification';
import { useDispatch } from 'react-redux';

const NotificationsPopover = (props) => {
	const dispatch = useDispatch();
	const { anchorEl, setAnchorEl, notifications } = props;

	const notificationsClearHandler = async () => {
		await dispatch(notificationController.clearNotifications());
	};

	const closePopoverHandler = () => {
		setAnchorEl(null);
	};

	return (
		<Popover
			open={!!anchorEl}
			anchorEl={anchorEl}
			onClose={closePopoverHandler}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left'
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'center'
			}}
		>
			<StyledToolbar>
				<StyledTitle variant="h6">Notifications</StyledTitle>
				<Tooltip title="Clear all" placement="bottom">
					<IconButton onClick={notificationsClearHandler}>
						<StyledClearAllIcon />
					</IconButton>
				</Tooltip>
			</StyledToolbar>
			<StyledList>
				{notifications.map((notification, index, array) => {
					const firstElement = index === 0;
					const lastElement = index !== array.length - 1;
					return (
						<Fragment key={notification.notificationId}>
							<NotificationItem
								notification={notification}
								closePopover={() => setAnchorEl(null)}
								firstElement={firstElement}
							/>
							{lastElement && <Divider />}
						</Fragment>
					);
				})}
			</StyledList>
		</Popover>
	);
};

export default NotificationsPopover;
