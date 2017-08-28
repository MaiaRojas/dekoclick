import { createMuiTheme } from 'material-ui/styles';
import createPalette from 'material-ui/styles/palette';
//import amber from './colors/amber';
//import grey from './colors/grey';
import amber from 'material-ui/colors/amber';
import grey from 'material-ui/colors/grey';
import red from 'material-ui/colors/red';

const theme = createMuiTheme({
  palette: createPalette({
    primary: grey,
    accent: amber,
    error: red,
  }),
});

export default theme;
