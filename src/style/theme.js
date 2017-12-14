import { createMuiTheme } from 'material-ui/styles';
import { amber } from 'material-ui/colors';


const theme = createMuiTheme({
  palette: {
    primary: amber,
  },
  typography: {
    color: '#2b2b2b',
    fontFamily: 'museo-sans, "Helvetica Neue", Arial, sans-serif',
    fontWeight: 100,
    fontSize: 16,
    lineHeight: '145%',
    body1: {
      fontFamily: 'museo-sans, "Helvetica Neue", Arial, sans-serif',
      fontWeight: 100,
    },
    headline: {
      fontFamily: 'Montserrat, "Helvetica Neue", Arial, sans-serif',
      textTransform: 'uppercase',
      fontWeight: 700,
      // color: '#f7b617',
      color: '#999',
    },
    title: {
      fontFamily: 'Montserrat, "Helvetica Neue", Arial, sans-serif',
      textTransform: 'uppercase',
      fontWeight: 700,
    },
    subheading: {
      fontFamily: 'Montserrat, "Helvetica Neue", Arial, sans-serif',
      textTransform: 'uppercase',
      fontWeight: 700,
    },
    button: {
      fontFamily: 'Montserrat, "Helvetica Neue", Arial, sans-serif',
      fontWeight: 700,
    },
  },
});


export default theme;
