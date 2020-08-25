import styled from 'styled-components'
import { CardContent, CardActions, Button, Card, CardHeader } from '@material-ui/core';

export const StyledCard = styled(Card)`
  min-width: 300px;
`;

export const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
`;

export const StyledCardHeader = styled(CardHeader)`
  text-align: center;
  padding-bottom: 0;
  & .MuiCardHeader-title {
    font-size: xx-large
  }
`;

export const StyledCardActions = styled(CardActions)`
  display: flex;
  flex-direction: column;
  & > :not(:first-child) {
    margin-left: 0;
  }
`;

export const StyledButton = styled(Button)`
  width: 100%;
  margin-bottom: 10px
`;