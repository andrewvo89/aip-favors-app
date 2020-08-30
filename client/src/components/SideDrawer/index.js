import React from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import SideDrawerItems from '../SideDrawerItems';

const SideDawer = (props) => {
	return (
		<SwipeableDrawer
			anchor={'left'}
			open={props.drawerOpen}
			onClose={() => props.setDrawerOpen(false)}
			onOpen={() => props.setDrawerOpen(true)}
		>
			<SideDrawerItems {...props} />
		</SwipeableDrawer>
	);
};

export default SideDawer;
