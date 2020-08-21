import Card from '@material-ui/core/Card';
import styled from 'styled-components'
import { CardContent, CardHeader, CardActions, Button, Link } from '@material-ui/core';
import colors from '../../../utils/colors';

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
    margin-left: 0
  }
`;

export const StyledLink = styled(Link)`
  &:hover {
    cursor: pointer;
    text-decoration: none;
    color: ${colors.primary.lighter};
  }
  margin-bottom: 10px;
`;

export const StyledButton = styled(Button)`
  width: 100%;
  margin-bottom: 10px
`;