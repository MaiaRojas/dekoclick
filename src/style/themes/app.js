'use strict';


import { createMuiTheme } from 'material-ui/styles';
import createPalette from 'material-ui/styles/palette';
//import amber from './colors/amber';
//import grey from './colors/grey';
import { amber, grey } from 'material-ui/colors';


const theme = createMuiTheme({
  palette: createPalette({
    primary: amber,
    //secondary: grey,
  }),
});


export default theme;
