'use strict';


import { createMuiTheme, createPalette, createTypography } from 'material-ui/styles';
//import amber from './colors/amber';
//import grey from './colors/grey';
import { amber, grey } from 'material-ui/colors';


const typography = createTypography(createPalette(), {});
const headline = Object.assign({}, typography.headline, { marginBottom: 20 });
const title = Object.assign({}, typography.title, { marginBottom: 16 });
const subheading = Object.assign({}, typography.subheading, { marginBottom: 10 });


//console.log(typography);


const theme = createMuiTheme({
  palette: createPalette({
    primary: amber,
    //secondary: grey,
  }),
  typography: Object.assign({}, typography, {
    //headline,
    //title,
    //subheading,
  }),
});


export default theme;
