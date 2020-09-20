import React, { Fragment } from 'react';
import { StyledCard } from './styled-components';
import ProfileForm from './ProfileForm';

const Account = () => {
	return (
		<Fragment>
			<StyledCard elevation={6}>
				<ProfileForm />
			</StyledCard>
		</Fragment>
	);
};

export default Account;
