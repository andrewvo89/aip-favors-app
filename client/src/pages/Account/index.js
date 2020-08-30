import React, { Fragment } from 'react';
import { StyledCard } from './styled-components';
import ProfileForm from './ProfileForm';
import Avatar from './Avatar';

const Account = () => {
	return (
		<Fragment>
			<StyledCard elevation={6}>
				<Avatar />
				<ProfileForm />
			</StyledCard>
		</Fragment>
	);
};

export default Account;
