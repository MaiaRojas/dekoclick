import { createMuiTheme } from 'material-ui/styles';


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ff5d51',
      secondary: '#000000',
    },
    secondary: {
      main: '#bdbdbd',
    },
    text: {
      primary: '#000000',
      secondary: '#ffffff',
    },
    background: {
      default: '#f7f7f7',
    },
  },
  typography: {
    htmlFontSize: 16,
    color: '#ffffff',
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 100,
    fontSize: 16,
    lineHeight: '145%',
    body1: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 100,
    },
    headline: {
      fontFamily: "'Montserrat', sans-serif",
      textTransform: 'uppercase',
      fontWeight: 100,
      color: '#999',
    },
    title: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 700,
      lineHeight: '2rem',
      fontSize: '1.5rem',
    },
    subheading: {
      fontWeight: 300,
    },
    button: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 700,
      boxShadow: 'none !important',
      // borderRadius: 0,
      textTransform: 'none',
    },
    display1: {
      fontFamily: "'Montserrat', sans-serif",
      color: '#4c4c4c',
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  maxContentWidth: 760,
  leftDrawerWidth: 320,
  leftDrawerWidthMin: 73,
  shadow: '1px 1px 0px 1px #e1e1e1',
});


export default theme;
