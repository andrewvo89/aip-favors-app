import React, { Fragment } from 'react'
import { useSelector } from 'react-redux';
import PublicFavors from './PublicFavors';

export default props => {
  const { authUser } = useSelector(state => state.authState);
  let darkMode;
  if (authUser) {
    darkMode = authUser.settings.darkMode;
  }

  return (
    <Fragment>
      <PublicFavors darkMode={darkMode} />
    </Fragment>
  );
}