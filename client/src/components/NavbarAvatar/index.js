import React from 'react'
import Avatar from '@material-ui/core/Avatar';
import useMaterialStyles from './md-style';

export default props => {
  const materialStyles = useMaterialStyles();
  return (
    <Avatar className={materialStyles.avatarLarge}>
      {props.authUser.name.substring(0, 1)}
    </Avatar>
  );
}