import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import makeStyles from './md-style';

export default props => {
  const materialStyles = makeStyles();
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          className={materialStyles.menuButton}
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => props.setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={materialStyles.title}>
          Favours App
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
}