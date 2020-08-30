import React from 'react';
import { useSelector } from 'react-redux';
import PublicFavors from './PublicFavors';

const Home = () => {
	const { authUser } = useSelector((state) => state.authState);
	let darkMode;
	if (authUser) {
		darkMode = authUser.settings.darkMode;
	}

	return <PublicFavors darkMode={darkMode} />;
};

export default Home;
