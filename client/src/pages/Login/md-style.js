import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  card: {
    minWidth: '300px'
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  inputField: {
    marginBottom: '20px'
  },
  button: {
    width: '100%',
    marginLeft: 0
  }
}));