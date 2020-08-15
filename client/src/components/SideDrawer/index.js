import React from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import SideDrawerItems from '../SideDrawerItems';

export default props => {
  return (
    <SwipeableDrawer
      anchor={"left"}
      open={props.drawerOpen}
      onClose={() => props.setDrawerOpen(false)}
      onOpen={() => props.setDrawerOpen(true)}
    >
      <SideDrawerItems
        {...props}
      />
    </SwipeableDrawer>
  );
}