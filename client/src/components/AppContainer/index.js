import { Container, Grid } from '@material-ui/core';
import React, { useState } from 'react';
import { Fragment } from 'react';
import Navbar from '../Navbar';
import SideDrawer from '../SideDrawer';

const AppContainer = (props) => {
	const { authUser } = props;
	const [drawerOpen, setDrawerOpen] = useState(false);

	return (
		<Fragment>
			<Grid container direction="column" spacing={authUser ? 0 : 4}>
				<Grid item>
					<Navbar setDrawerOpen={setDrawerOpen} />
				</Grid>
				<Grid item>
					<Container>{props.children}</Container>
				</Grid>
			</Grid>
			<SideDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
		</Fragment>
	);
};

export default AppContainer;
