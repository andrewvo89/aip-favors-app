import React, { Fragment } from 'react'
import { StyledCard } from './styled-components'
import ProfileForm from './ProfileForm'
import Avatar from './Avatar';

export default props => {
  return (
    <Fragment>
      <StyledCard elevation={6}>
        <Avatar />
        <ProfileForm />
      </StyledCard>
    </Fragment>
  );
}