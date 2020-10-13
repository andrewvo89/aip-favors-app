import React from 'react';
import {
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListItemSecondaryAction,
	CardContent,
	Card,
	Container
} from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import { useSelector, useDispatch } from 'react-redux';
import * as userController from '../../controllers/user';
import {
	Brightness4 as Brightness4Icon,
	Brightness5 as Brightness5Icon,
	Notifications as NotificationsIcon,
	NotificationsOff as NotificationsOffIcon
} from '@material-ui/icons';
import CardHeader from '../../components/CardHeader';

const Settings = (props) => {
	const { authUser } = useSelector((state) => state.authState);
	const dispatch = useDispatch();

	const switchChangeHandler = async (settings) => {
		await dispatch(userController.update({ settings: settings }));
	};

	const { darkMode, notifications } = authUser.settings;

	return (
		<Container maxWidth="xs" disableGutters>
			<Card elevation={6}>
				<CardHeader title="Settings" />
				<CardContent>
					<List>
						<ListItem>
							<ListItemIcon>
								{darkMode ? <Brightness4Icon /> : <Brightness5Icon />}
							</ListItemIcon>
							<ListItemText primary="Dark mode" />
							<ListItemSecondaryAction>
								<Switch
									checked={darkMode}
									onChange={() =>
										switchChangeHandler({
											...authUser.settings,
											darkMode: !darkMode
										})
									}
								/>
							</ListItemSecondaryAction>
						</ListItem>
						<ListItem>
							<ListItemIcon>
								{notifications ? (
									<NotificationsIcon />
								) : (
									<NotificationsOffIcon />
								)}
							</ListItemIcon>
							<ListItemText primary="Notifications" />
							<ListItemSecondaryAction>
								<Switch
									checked={notifications}
									onChange={() =>
										switchChangeHandler({
											...authUser.settings,
											notifications: !notifications
										})
									}
								/>
							</ListItemSecondaryAction>
						</ListItem>
					</List>
				</CardContent>
			</Card>
		</Container>
	);
};

export default Settings;
