import React, { useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CircularProgress, Grid, TextField } from '@material-ui/core';
import { StyledAvatar } from '../../../../utils/styled-components';

const UserSearchSelect = (props) => {
	const {
		id,
		label,
		authUser,
		userList,
		value,
		onChange,
		error,
		autoFocus = false
	} = props;
	const [open, setOpen] = useState(false);
	const loading = open && userList.length === 0;

	const getInitials = (user) => {
		const names = user.fullName.split(' ');
		return `${names[0].substring(0, 1)}${names[1].substring(0, 1)}`;
	};

	return (
		<Autocomplete
			id={id}
			open={open}
			onOpen={() => setOpen(true)}
			onClose={() => setOpen(false)}
			loading={loading}
			getOptionSelected={(option, value) => option._id === value._id}
			getOptionLabel={(option) => option.fullName}
			options={userList}
			value={value}
			onChange={(e, newVal) => onChange(newVal)}
			autoHighlight
			autoSelect
			disableClearable // TODO: fix this
			renderInput={(params) => (
				<TextField
					{...params}
					label={label}
					error={error}
					autoFocus={autoFocus}
					InputProps={{
						...params.InputProps,
						startAdornment: (
							<StyledAvatar
								size={0.66}
								darkMode={authUser.settings.darkMode}
								src={value.profilePicture}>
								{value.fullName ? getInitials(value) : '?'}
							</StyledAvatar>
						),
						endAdornment: (
							<React.Fragment>
								{loading ? (
									<CircularProgress color="inherit" size={20} />
								) : null}
								{params.InputProps.endAdornment}
							</React.Fragment>
						)
					}}
				/>
			)}
			renderOption={(user) => {
				return (
					<Grid container alignItems="center">
						<Grid item>
							<StyledAvatar
								size={0.66}
								darkMode={authUser.settings.darkMode}
								src={user.profilePicture}>
								{getInitials(user)}
							</StyledAvatar>
						</Grid>
						<Grid item xs>
							{user.fullName}
						</Grid>
					</Grid>
				);
			}}
		/>
	);
};

export default UserSearchSelect;
