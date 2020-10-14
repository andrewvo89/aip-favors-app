import { Divider, Grid, IconButton, Popover, Tooltip } from '@material-ui/core';
import React, { Fragment } from 'react';
import NotificationItem from './NotificationItem';
import { StyledList, StyledTitle } from './styled-components';
import * as notificationController from '../../../../controllers/notification';
import * as userController from '../../../../controllers/user';
import { useDispatch } from 'react-redux';
import {
	ClearAll as ClearAllIcon,
	NotificationsOff as NotificationsOffIcon
} from '@material-ui/icons';

const NotificationsPopover = (props) => {
	const dispatch = useDispatch();
	const { authUser, anchorEl, setAnchorEl, notifications } = props;

	const notificationsClearHandler = async () => {
		await dispatch(notificationController.clearNotifications());
	};

	const notificationSilenceHandler = async () => {
		const settings = { ...authUser.settings, notifications: false };
		await dispatch(userController.update({ settings: settings }));
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
			<Grid container direction="row" justify="space-between" wrap="nowrap">
				<Grid item>
					<StyledTitle variant="h6">Notifications</StyledTitle>
				</Grid>
				<Grid item container direction="row" justify="flex-end" wrap="nowrap">
					<Grid item>
						<Tooltip title="Silence notifications" placement="bottom">
							<IconButton onClick={notificationSilenceHandler}>
								<NotificationsOffIcon />
							</IconButton>
						</Tooltip>
					</Grid>
					<Grid item>
						<Tooltip title="Clear all" placement="bottom">
							<IconButton onClick={notificationsClearHandler}>
								<ClearAllIcon />
							</IconButton>
						</Tooltip>
					</Grid>
				</Grid>
			</Grid>
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
