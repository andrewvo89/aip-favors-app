import React, { useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CircularProgress, Grid, TextField } from '@material-ui/core';
import Avatar from '../../../../components/Avatar';

const UserSearchSelect = (props) => {
	const {
		id,
		label,
		userList,
		value,
		onChange,
		error,
		autoFocus = false
	} = props;
	const [open, setOpen] = useState(false);
	const loading = open && userList.length === 0;

	return (
		<Autocomplete
			id={id}
			open={open}
			onOpen={() => setOpen(true)}
			onClose={() => setOpen(false)}
			loading={loading}
			getOptionSelected={(option, value) => option.userId === value.userId}
			getOptionLabel={(option) => `${option.fullName}`}
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
						// startAdornment: <Avatar size={0.66} user={value} />,
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
					<Grid container alignItems="center" spacing={1}>
						<Grid item>
							<Avatar size={0.66} user={user} />
						</Grid>
						<Grid item xs>
							{`${user.fullName}`}
						</Grid>
					</Grid>
				);
			}}
		/>
	);
};

export default UserSearchSelect;
