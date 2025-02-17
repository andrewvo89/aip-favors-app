import React, { Fragment } from 'react';
import { StyledAvatar } from './styled-components';
import { useSelector } from 'react-redux';
const { REACT_APP_REST_URL: REST_URL } = process.env;
//Global avatar component
const Avatar = (props) => {
	const { authUser } = useSelector((state) => state.authState);
	const { user, iconFallback, customFallback } = props;

	const firstNameInitial = user.firstName.substring(0, 1).toUpperCase();
	const lastNameInitial = user.lastName.substring(0, 1).toUpperCase();

	let fallback = `${firstNameInitial}${lastNameInitial}`;
	if (iconFallback) {
		fallback = null;
	}
	if (customFallback) {
		fallback = customFallback;
	}

	let avatarUrl;
	if (user.profilePicture) {
		avatarUrl = `${REST_URL}/${user.profilePicture.split('\\').join('/')}`;
	} else {
		avatarUrl = `https://avatars.dicebear.com/api/avataaars/${user.firstName.toLowerCase()}.svg`;
	}

	return (
		<Fragment>
			<StyledAvatar
				src={avatarUrl}
				darkMode={authUser ? authUser.settings.darkMode : false}
				{...props}
			>
				{fallback}
			</StyledAvatar>
		</Fragment>
	);
};

export default Avatar;
