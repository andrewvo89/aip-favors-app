import styled from 'styled-components'
import { CardContent, Typography, CardActions, Button, Card } from '@material-ui/core';

export const StyledCard = styled(Card)`
  min-width: 300px;
`;

export const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
`;

export const StyledTitle = styled(Typography)`
  text-align: center;
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