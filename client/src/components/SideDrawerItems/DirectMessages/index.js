import React, { Fragment } from 'react'
import { ListItem, ListItemIcon, ListItemText, Collapse } from '@material-ui/core';
import { ExpandLess, ExpandMore, Add as AddIcon } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import * as userController from '../../../controllers/user';

export default props => {
  const { authUser } = useSelector(state => state.authState);
  const expand = authUser.settings.expandSideDrawerItems.directMessages;
  const dispatch = useDispatch();
  const Expand = expand ? ExpandLess : ExpandMore;

  const expandClickListener = () => {
    dispatch(userController.updateSettings({
      ...authUser.settings,
      expandSideDrawerItems: {
        ...authUser.settings.expandSideDrawerItems,
        directMessages: !expand
      }
    }));
  };

  return (
    <Fragment>
      <ListItem button>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary="Direct Messages" onClick={expandClickListener} />
        {<Expand onClick={expandClickListener} />}
      </ListItem>
      <Collapse in={expand} timeout="auto" unmountOnExit>
        {['@ Bob Harris', '@ Roger Lee', '@ Harry Werner'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </Collapse>
    </Fragment>
  );
}