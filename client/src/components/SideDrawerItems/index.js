import React from 'react'
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import { StyledListContainer } from './styled-components';
import FavoriteGroups from './FavoriteGroups';
import PublicGroups from './PublicGroups';
import PrivateGroups from './PrivateGroups';
import DirectMessages from './DirectMessages';

export default props => {
  return (
    <StyledListContainer>
      <List>
        <FavoriteGroups />
        <Divider />
        <PublicGroups />
        <Divider />
        <PrivateGroups />
        <Divider />
        <DirectMessages />
      </List>
    </StyledListContainer>
  );
}