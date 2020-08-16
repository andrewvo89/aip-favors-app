import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import useMaterialStyles from './md-style';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import NavbarAvatar from '../NavbarAvatar';


export default props => {
  const materialStyles = useMaterialStyles();
  const { authUser } = useSelector(state => state.authState);

  return (
    <AppBar position="static">
      <Toolbar>
        {authUser && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => props.setDrawerOpen(true)}
          >
            <MenuIcon className={materialStyles.menuIcon} />
          </IconButton>
        )}
        <Typography variant="h6" className={materialStyles.title}>
          Favours App
        </Typography>
        {authUser && (
          <NavbarAvatar authUser={authUser} />
        )}
      </Toolbar>
    </AppBar>
  );
}