import React, { Fragment } from 'react'
import { StyledCard } from './styled-components'
import ProfileForm from './ProfileForm'

export default props => {
  return (
    <Fragment>
      <StyledCard elevation={6}>
        <ProfileForm />
      </StyledCard>
    </Fragment>
  );
}