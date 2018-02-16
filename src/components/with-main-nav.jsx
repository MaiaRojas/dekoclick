import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import MainNav from '../components/main-nav';


const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
  },
  main: {
    marginLeft: 0,
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.leftDrawerWidth,
    },
  },
});


const WithMainNav = ({ component: Component, classes, ...props }) => (
  <div className={`app ${classes.root}`}>
    <MainNav {...props} />
    <div className={`${classes.main} main`}>
      <Component {...props} />
    </div>
  </div>
);


WithMainNav.propTypes = {
  component: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
  }).isRequired,
};


export default withStyles(styles)(WithMainNav);
