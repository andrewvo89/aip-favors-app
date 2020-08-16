import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import useMaterialStyles from './md-style';
import Navbar from '../Navbar/index';
import SideDrawer from '../SideDrawer/index';

export default props => {
  const materialStyles = useMaterialStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className={materialStyles.root}>
      <Navbar
        setDrawerOpen={setDrawerOpen}
      />
      <SideDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
      <Container className={materialStyles.container}>
        {props.children}
      </Container>
    </div>
  );
}