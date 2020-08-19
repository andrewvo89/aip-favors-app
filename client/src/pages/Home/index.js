import React from 'react'
import { useSelector } from 'react-redux';

export default props => {
  const { authUser } = useSelector(state => state.authState);
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Welcome {authUser.firstName} {authUser.lastName}</h1>
      <h2>{authUser.email}</h2>
    </div>
  );
}