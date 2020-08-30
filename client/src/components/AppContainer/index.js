import React, { useState, Fragment } from 'react';
import Navbar from '../Navbar/index';
import SideDrawer from '../SideDrawer/index';
import { StyledContainer } from './styled-components';

const AppContainer = (props) => {
	const [drawerOpen, setDrawerOpen] = useState(false);

	return (
		<Fragment>
			<Navbar setDrawerOpen={setDrawerOpen} />
			<SideDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
			<StyledContainer>{props.children}</StyledContainer>
		</Fragment>
	);
};

export default AppContainer;
