import React, { Fragment } from 'react'
import { useSelector } from 'react-redux';

export default props => {
  const { authUser } = useSelector(state => state.authState);
  return (
    <Fragment>
      <h1>Welcome {authUser.firstName} {authUser.lastName}</h1>
      <h2>{authUser.email}</h2>
    </Fragment>
  );
}