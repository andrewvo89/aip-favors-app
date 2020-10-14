import { Card, Container } from '@material-ui/core';
import React from 'react';
import ProfileForm from './ProfileForm';

const Account = () => {
	return (
		<Container maxWidth="xs" disableGutters>
			<Card elevation={6}>
				<ProfileForm />
			</Card>
		</Container>
	);
};

export default Account;
