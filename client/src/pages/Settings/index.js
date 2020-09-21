import React from 'react';
import {
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListItemSecondaryAction,
	CardContent
} from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import { useSelector, useDispatch } from 'react-redux';
import * as userController from '../../controllers/user';
import { Brightness4 as Brightness4Icon } from '@material-ui/icons';
import Card from '../../components/Card';
import CardHeader from '../../components/CardHeader';

const Settings = (props) => {
	const { authUser } = useSelector((state) => state.authState);
	const dispatch = useDispatch();

	const switchChangeHandler = async (settings) => {
		await dispatch(userController.update({ settings: settings }));
	};

	return (
		<Card elevation={6}>
			<CardHeader title="Settings" />
			<CardContent>
				<List>
					<ListItem>
						<ListItemIcon>
							<Brightness4Icon />
						</ListItemIcon>
						<ListItemText primary="Dark mode" />
						<ListItemSecondaryAction>
							<Switch
								checked={authUser.settings.darkMode}
								onChange={() =>
									switchChangeHandler({
										...authUser.settings,
										darkMode: !authUser.settings.darkMode
									})
								}
							/>
						</ListItemSecondaryAction>
					</ListItem>
				</List>
			</CardContent>
		</Card>
	);
};

export default Settings;
