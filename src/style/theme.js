import { createMuiTheme } from 'material-ui/styles';
// import { amber } from 'material-ui/colors';


const theme = createMuiTheme({
  palette: {
    // primary: amber,
    primary: {
      main: '#ffe521',
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
      default: '#ffffff',
    },
  },
  typography: {
    htmlFontSize: 16,
    color: '#ffffff',
    fontFamily: '"Open Sans", "Helvetica Neue", Arial, sans-serif',
    fontWeight: 100,
    fontSize: 16,
    lineHeight: '145%',
    body1: {
      fontFamily: '"Open Sans", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 100,
    },
    headline: {
      fontFamily: '"Open Sans", "Helvetica Neue", Arial, sans-serif',
      textTransform: 'uppercase',
      fontWeight: 100,
      color: '#999',
    },
    title: {
      fontFamily: '"Bitter", serif, "Helvetica Neue", Arial',
      // textTransform: 'uppercase',
      fontWeight: 700,
      lineHeight: '2rem',
      fontSize: '1.5rem',
    },
    subheading: {
      // fontFamily: '"Bitter", serif,"Helvetica Neue", Arial',
      // textTransform: 'uppercase',
      fontWeight: 300,
    },
    button: {
      fontFamily: '"Open Sans", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 700,
      boxShadow: 'none !important',
      borderRadius: 0,
    },
    display1: {
      fontFamily: '"Bitter", serif, "Helvetica Neue", Arial',
      color: '#000000',
    },
  },
  maxContentWidth: 760,
  leftDrawerWidth: 320,
  leftDrawerWidthMin: 73,
});


export default theme;
