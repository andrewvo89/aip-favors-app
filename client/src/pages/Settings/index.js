import React, { Fragment } from 'react'
import { FormControlLabel } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import { StyledCard, StyledCardHeader, StyledCardContent } from '../../utils/styled-components';
import { StyledFormGroup } from './styled-components';
import { useSelector, useDispatch } from 'react-redux';
import * as userController from '../../controllers/user';
export default props => {
  const { authUser } = useSelector(state => state.authState);
  const dispatch = useDispatch();

  const switchChangeHandler = async settings => {
    await dispatch(userController.updateSettings(settings));
  };

  return (
    <Fragment>
      <StyledCard elevation={6}>
        <StyledCardHeader title="Settings" />
        <StyledCardContent>
          <StyledFormGroup>
            <FormControlLabel
              label="Dark Mode"
              control={
                <Switch
                  checked={authUser.settings.darkMode}
                  onChange={() => switchChangeHandler({
                    ...authUser.settings,
                    darkMode: !authUser.settings.darkMode
                  })}
                />
              }
            />
            <FormControlLabel
              label="Email Notifications"
              control={
                <Switch
                  checked={authUser.settings.emailNotifications}
                  onChange={() => switchChangeHandler({
                    ...authUser.settings,
                    emailNotifications: !authUser.settings.emailNotifications
                  })}
                />}
            />
            <FormControlLabel
              label="App Notificaitons"
              control={
                <Switch
                  checked={authUser.settings.appNotifications}
                  onChange={() => switchChangeHandler({
                    ...authUser.settings,
                    appNotifications: !authUser.settings.appNotifications
                  })}
                />
              }
            />
          </StyledFormGroup>
        </StyledCardContent>
      </StyledCard>
    </Fragment>
  );
}