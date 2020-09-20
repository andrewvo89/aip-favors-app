import React, { Fragment } from 'react';
import ProfileForm from './ProfileForm';
import Card from '../../components/Card';

const Account = () => {
	return (
		<Fragment>
			<Card elevation={6}>
				<ProfileForm />
			</Card>
		</Fragment>
	);
};

export default Account;
